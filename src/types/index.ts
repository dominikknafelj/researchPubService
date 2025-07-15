// Publication data types
export interface PublicationInput {
  title: string;
  abstract?: string;
  authors: string[];
  publicationDate?: string;
  keywords?: string;
  description?: string;
  sourceUrl?: string;
}

export interface Publication extends PublicationInput {
  id: string;
  educationLevel: EducationLevel;
  processedAt: string;
  originalData: PublicationInput;
}

export interface PublicationResponse {
  id: string;
  title: string;
  abstract?: string;
  authors: string[];
  publicationDate?: string;
  keywords?: string;
  description?: string;
  sourceUrl?: string;
  educationLevel: EducationLevel;
  processedAt: string;
}

// Education level types
export type EducationLevel = 'K-12' | 'Higher Ed' | 'Adult Learning';

export interface EducationKeywords {
  'K-12': string[];
  'Higher Ed': string[];
  'Adult Learning': string[];
}

export interface EducationLevelScores {
  'K-12': number;
  'Higher Ed': number;
  'Adult Learning': number;
}

// API response types
export interface ApiResponse<T = unknown> {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: string[];
}

export interface ProcessPublicationResponse {
  message: string;
  publication: {
    id: string;
    title: string;
    educationLevel: EducationLevel;
    processedAt: string;
  };
}

export interface GetAllPublicationsResponse {
  publications: PublicationResponse[];
  summary: PublicationSummary;
  filters: {
    educationLevel: EducationLevel | 'all';
    limit: number | 'none';
  };
}

export interface PublicationSummary {
  total: number;
  byEducationLevel: {
    'K-12': number;
    'Higher Ed': number;
    'Adult Learning': number;
  };
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// DynamoDB types
export interface DynamoDBPublicationItem {
  id: string;
  title: string;
  abstract?: string;
  authors: string[];
  publicationDate?: string;
  keywords?: string;
  description?: string;
  sourceUrl?: string;
  educationLevel: EducationLevel;
  processedAt: string;
  originalData: PublicationInput;
}

// Lambda event types (extending AWS Lambda types)
export interface CustomAPIGatewayEvent {
  httpMethod: string;
  path: string;
  pathParameters?: Record<string, string> | null;
  queryStringParameters?: Record<string, string> | null;
  headers?: Record<string, string>;
  body?: string | null;
}

// React component types
export interface PublicationsListProps {
  apiEndpoint?: string;
}

export interface CategoryInfo {
  value: EducationLevel | 'all';
  label: string;
  color: string;
}

// Constants
export const EDUCATION_LEVELS: EducationLevel[] = ['K-12', 'Higher Ed', 'Adult Learning'];

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Utility types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

// Type guards
export function isEducationLevel(value: string): value is EducationLevel {
  return EDUCATION_LEVELS.includes(value as EducationLevel);
}

export function isValidHttpMethod(method: string): method is HttpMethod {
  return ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'].includes(method);
} 