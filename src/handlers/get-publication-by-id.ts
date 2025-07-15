import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  PublicationResponse,
  DynamoDBPublicationItem,
  ErrorResponse,
  CORS_HEADERS,
  HTTP_STATUS,
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
 * Validates UUID format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * A HTTP get method to get one publication by id from the DynamoDB table
 */
export const getPublicationByIdHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'GET') {
    return createErrorResponse(
      HTTP_STATUS.METHOD_NOT_ALLOWED,
      'Method not allowed',
      `This endpoint only accepts GET requests, received: ${event.httpMethod}`
    );
  }

  // All log statements are written to CloudWatch
  console.info('Getting publication by ID:', JSON.stringify(event, null, 2));

  // Extract the publication ID from the path parameters
  const publicationId = event.pathParameters?.id;
  
  if (!publicationId) {
    return createErrorResponse(
      HTTP_STATUS.BAD_REQUEST,
      'Missing publication ID',
      'Publication ID is required in the URL path'
    );
  }

  // Basic validation for UUID format
  if (!isValidUUID(publicationId)) {
    return createErrorResponse(
      HTTP_STATUS.BAD_REQUEST,
      'Invalid publication ID format',
      'Publication ID must be a valid UUID'
    );
  }

  // Get the publication from DynamoDB
  const params = {
    TableName: tableName,
    Key: { id: publicationId }
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    
    if (!data.Item) {
      console.log(`Publication not found: ${publicationId}`);
      return createErrorResponse(
        HTTP_STATUS.NOT_FOUND,
        'Publication not found',
        `No publication found with ID: ${publicationId}`
      );
    }

    // Convert DynamoDB item to API response format
    const publication = convertToPublicationResponse(data.Item as DynamoDBPublicationItem);

    console.log(`Publication retrieved successfully: ${publicationId}`);
    console.info(`Publication retrieved: ${publicationId}, Category: ${publication.educationLevel}`);
    
    return createSuccessResponse(HTTP_STATUS.OK, publication);

  } catch (error) {
    console.error('Error retrieving publication:', error);
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Internal server error',
      'Failed to retrieve publication'
    );
  }
}; 