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

// React component types
export interface PublicationsListProps {
  apiEndpoint?: string;
}

export interface CategoryInfo {
  value: EducationLevel | 'all';
  label: string;
  color: string;
}

// Next.js specific types
export interface PageProps {
  apiEndpoint?: string;
}

export interface PublicationDetailProps {
  publication: PublicationResponse;
}

// Constants
export const EDUCATION_LEVELS: EducationLevel[] = ['K-12', 'Higher Ed', 'Adult Learning'];

// Utility types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

// Type guards
export function isEducationLevel(value: string): value is EducationLevel {
  return EDUCATION_LEVELS.includes(value as EducationLevel);
}

export function isValidHttpMethod(method: string): method is HttpMethod {
  return ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'].includes(method);
} 