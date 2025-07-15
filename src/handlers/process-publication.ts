import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { randomUUID } from 'crypto';
import {
  PublicationInput,
  Publication,
  EducationLevel,
  EducationKeywords,
  EducationLevelScores,
  ValidationResult,
  ProcessPublicationResponse,
  ErrorResponse,
  ApiResponse,
  CORS_HEADERS,
  HTTP_STATUS,
  isEducationLevel,
} from '../types/index.js';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.PUBLICATIONS_TABLE;

if (!tableName) {
  throw new Error('PUBLICATIONS_TABLE environment variable is not set');
}

// Education level categorization keywords
const EDUCATION_KEYWORDS: EducationKeywords = {
  'K-12': [
    'elementary', 'middle school', 'high school', 'k-12', 'kindergarten', 'grade',
    'primary school', 'secondary school', 'teen', 'adolescent', 'youth',
    'preschool', 'early childhood', 'student achievement', 'classroom management'
  ],
  'Higher Ed': [
    'university', 'college', 'undergraduate', 'graduate', 'doctoral', 'phd',
    'campus', 'academic', 'faculty', 'professor', 'higher education',
    'post-secondary', 'bachelor', 'master', 'research university', 'dissertation'
  ],
  'Adult Learning': [
    'adult education', 'continuing education', 'professional development', 'workforce',
    'lifelong learning', 'adult learner', 'career', 'professional training',
    'workplace learning', 'adult literacy', 'vocational', 'certification',
    'upskilling', 'reskilling', 'corporate training'
  ]
};

/**
 * Categorizes a publication based on its content using keyword matching
 */
function categorizePublication(publication: PublicationInput): EducationLevel {
  const searchText = [
    publication.title || '',
    publication.abstract || '',
    publication.keywords || '',
    publication.description || ''
  ].join(' ').toLowerCase();

  const scores: EducationLevelScores = {
    'K-12': 0,
    'Higher Ed': 0,
    'Adult Learning': 0
  };

  // Score each category based on keyword matches
  for (const [category, keywords] of Object.entries(EDUCATION_KEYWORDS)) {
    if (!isEducationLevel(category)) continue;
    
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        scores[category] += 1;
        // Give extra weight to title matches
        if ((publication.title || '').toLowerCase().includes(keyword.toLowerCase())) {
          scores[category] += 1;
        }
      }
    }
  }

  // Return category with highest score, default to Higher Ed if no clear match
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) {
    return 'Higher Ed'; // Default category
  }

  return Object.keys(scores).find(key => 
    isEducationLevel(key) && scores[key] === maxScore
  ) as EducationLevel || 'Higher Ed';
}

/**
 * Validates incoming publication data
 */
function validatePublicationData(data: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Request body must be a valid object');
    return { isValid: false, errors };
  }

  const pub = data as Partial<PublicationInput>;
  
  if (!pub.title || typeof pub.title !== 'string' || pub.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (!pub.authors || !Array.isArray(pub.authors) || pub.authors.length === 0) {
    errors.push('Authors is required and must be a non-empty array');
  }
  
  if (pub.authors && Array.isArray(pub.authors)) {
    const invalidAuthors = pub.authors.some(author => typeof author !== 'string' || author.trim().length === 0);
    if (invalidAuthors) {
      errors.push('All authors must be non-empty strings');
    }
  }
  
  if (pub.publicationDate && typeof pub.publicationDate === 'string' && isNaN(Date.parse(pub.publicationDate))) {
    errors.push('Publication date must be a valid date string');
  }
  
  if (pub.title && typeof pub.title === 'string' && pub.title.length > 500) {
    errors.push('Title must be less than 500 characters');
  }
  
  if (pub.abstract && typeof pub.abstract === 'string' && pub.abstract.length > 5000) {
    errors.push('Abstract must be less than 5000 characters');
  }

  if (pub.keywords && typeof pub.keywords !== 'string') {
    errors.push('Keywords must be a string');
  }

  if (pub.description && typeof pub.description !== 'string') {
    errors.push('Description must be a string');
  }

  if (pub.sourceUrl && typeof pub.sourceUrl !== 'string') {
    errors.push('Source URL must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates a standardized error response
 */
function createErrorResponse(
  statusCode: number,
  error: string,
  message: string,
  details?: string[]
): APIGatewayProxyResult {
  const errorResponse: ErrorResponse = {
    error,
    message,
    ...(details && { details })
  };

  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(errorResponse)
  };
}

/**
 * Creates a standardized success response
 */
function createSuccessResponse<T>(
  statusCode: number,
  data: T
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(data)
  };
}

/**
 * Processes incoming webhook data for research publications
 */
export const processPublicationHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(
      HTTP_STATUS.METHOD_NOT_ALLOWED,
      'Method not allowed',
      `This endpoint only accepts POST requests, received: ${event.httpMethod}`
    );
  }

  // All log statements are written to CloudWatch
  console.info('Processing publication webhook:', JSON.stringify(event, null, 2));

  if (!event.body) {
    return createErrorResponse(
      HTTP_STATUS.BAD_REQUEST,
      'Missing request body',
      'Request body is required'
    );
  }

  let publicationData: unknown;
  try {
    publicationData = JSON.parse(event.body);
  } catch (error) {
    console.error('Invalid JSON in request body:', error);
    return createErrorResponse(
      HTTP_STATUS.BAD_REQUEST,
      'Invalid JSON',
      'Request body must be valid JSON'
    );
  }

  // Validate input data
  const validation = validatePublicationData(publicationData);
  if (!validation.isValid) {
    console.error('Validation failed:', validation.errors);
    return createErrorResponse(
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      'Invalid publication data',
      validation.errors
    );
  }

  // Type assertion is safe here because validation passed
  const validatedData = publicationData as PublicationInput;

  // Categorize the publication
  const educationLevel = categorizePublication(validatedData);
  
  // Create the publication record
  const publication: Publication = {
    id: randomUUID(),
    title: validatedData.title.trim(),
    abstract: validatedData.abstract || '',
    authors: validatedData.authors,
    publicationDate: validatedData.publicationDate || new Date().toISOString(),
    keywords: validatedData.keywords || '',
    description: validatedData.description || '',
    sourceUrl: validatedData.sourceUrl || '',
    educationLevel,
    processedAt: new Date().toISOString(),
    originalData: validatedData
  };

  // Store in DynamoDB
  const params = {
    TableName: tableName,
    Item: publication
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    console.log('Publication successfully stored:', publication.id);
    
    // Log categorization for monitoring
    console.log(`Publication categorized as: ${educationLevel}`, {
      id: publication.id,
      title: publication.title,
      category: educationLevel
    });
    
  } catch (error) {
    console.error('Error storing publication:', error);
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Internal server error',
      'Failed to store publication'
    );
  }

  const response: ProcessPublicationResponse = {
    message: 'Publication processed successfully',
    publication: {
      id: publication.id,
      title: publication.title,
      educationLevel: publication.educationLevel,
      processedAt: publication.processedAt
    }
  };

  console.info(`Publication processed successfully: ${publication.id}, Category: ${educationLevel}`);
  return createSuccessResponse(HTTP_STATUS.CREATED, response);
}; 