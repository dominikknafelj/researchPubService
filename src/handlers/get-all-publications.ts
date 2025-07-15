import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  PublicationResponse,
  DynamoDBPublicationItem,
  GetAllPublicationsResponse,
  PublicationSummary,
  ErrorResponse,
  EducationLevel,
  CORS_HEADERS,
  HTTP_STATUS,
  EDUCATION_LEVELS,
  isEducationLevel,
} from '../types/index.js';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.PUBLICATIONS_TABLE;

if (!tableName) {
  throw new Error('PUBLICATIONS_TABLE environment variable is not set');
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
 * Converts DynamoDB item to API response format
 */
function convertToPublicationResponse(item: DynamoDBPublicationItem): PublicationResponse {
  const response: PublicationResponse = {
    id: item.id,
    title: item.title,
    authors: item.authors,
    educationLevel: item.educationLevel,
    processedAt: item.processedAt
  };

  // Only include optional properties if they exist
  if (item.abstract) response.abstract = item.abstract;
  if (item.publicationDate) response.publicationDate = item.publicationDate;
  if (item.keywords) response.keywords = item.keywords;
  if (item.description) response.description = item.description;
  if (item.sourceUrl) response.sourceUrl = item.sourceUrl;

  return response;
}

/**
 * Calculates publication summary statistics
 */
function calculateSummary(publications: PublicationResponse[]): PublicationSummary {
  return {
    total: publications.length,
    byEducationLevel: {
      'K-12': publications.filter(p => p.educationLevel === 'K-12').length,
      'Higher Ed': publications.filter(p => p.educationLevel === 'Higher Ed').length,
      'Adult Learning': publications.filter(p => p.educationLevel === 'Adult Learning').length
    }
  };
}

/**
 * A HTTP get method to get all publications from the DynamoDB table
 * Supports filtering by education level via query parameter
 */
export const getAllPublicationsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'GET') {
    return createErrorResponse(
      HTTP_STATUS.METHOD_NOT_ALLOWED,
      'Method not allowed',
      `This endpoint only accepts GET requests, received: ${event.httpMethod}`
    );
  }

  // All log statements are written to CloudWatch
  console.info('Getting all publications:', JSON.stringify(event, null, 2));

  // Extract query parameters for filtering
  const queryParams = event.queryStringParameters || {};
  const educationLevelParam = queryParams.educationLevel;
  const limitParam = queryParams.limit;

  // Parse and validate education level parameter
  let educationLevel: EducationLevel | undefined;
  if (educationLevelParam) {
    if (!isEducationLevel(educationLevelParam)) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid education level',
        `Education level must be one of: ${EDUCATION_LEVELS.join(', ')}`,
        EDUCATION_LEVELS
      );
    }
    educationLevel = educationLevelParam;
  }

  // Parse and validate limit parameter
  let limit: number | undefined;
  if (limitParam) {
    const parsedLimit = parseInt(limitParam, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid limit',
        'Limit must be a positive integer'
      );
    }
    limit = Math.min(parsedLimit, 100); // Cap at 100 to prevent large responses
  }

  // Build scan parameters
  const scanParams: {
    TableName: string;
    FilterExpression?: string;
    ExpressionAttributeValues?: Record<string, unknown>;
    Limit?: number;
  } = {
    TableName: tableName
  };

  // Add filter expression if education level is specified
  if (educationLevel) {
    scanParams.FilterExpression = 'educationLevel = :educationLevel';
    scanParams.ExpressionAttributeValues = {
      ':educationLevel': educationLevel
    };
  }

  // Add limit if specified
  if (limit) {
    scanParams.Limit = limit;
  }

  try {
    const data = await ddbDocClient.send(new ScanCommand(scanParams));
    const rawItems = (data.Items || []) as DynamoDBPublicationItem[];

    // Convert to API response format
    let publications = rawItems.map(convertToPublicationResponse);

    // Sort publications by processedAt date (newest first)
    publications.sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime());

    // Calculate summary statistics
    const summary = calculateSummary(publications);

    console.log(`Retrieved ${publications.length} publications`, summary);

    const response: GetAllPublicationsResponse = {
      publications,
      summary,
      filters: {
        educationLevel: educationLevel || 'all',
        limit: limit || 'none'
      }
    };

    console.info(`Retrieved ${publications.length} publications successfully`);
    return createSuccessResponse(HTTP_STATUS.OK, response);
    
  } catch (error) {
    console.error('Error retrieving publications:', error);
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Internal server error',
      'Failed to retrieve publications'
    );
  }
}; 