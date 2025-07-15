// Configuration utility for the Next.js app

export interface AppConfig {
  apiEndpoint: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

export const getConfig = (): AppConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Default API endpoint - should be set via environment variable
  const defaultApiEndpoint = 'https://1ocg29j297.execute-api.us-east-1.amazonaws.com/Prod';
  
  return {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || defaultApiEndpoint,
    isDevelopment,
    isProduction,
  };
};

export const config = getConfig(); 