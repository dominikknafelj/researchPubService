# React App Example

This example demonstrates how to use the PublicationsList component in a React TypeScript application.

## Setup

1. **Create a new React app:**
   ```bash
   npx create-react-app my-publications-app --template typescript
   cd my-publications-app
   ```

2. **Copy the component:**
   ```bash
   # Copy the component and types from the main project
   cp ../../src/components/PublicationsList.tsx src/components/
   cp ../../src/components/PublicationsList.css src/components/
   cp ../../src/types/index.ts src/types/
   ```

3. **Update the import in App.tsx:**
   ```tsx
   import PublicationsList from './components/PublicationsList';
   ```

4. **Configure the API endpoint:**
   Create a `.env.local` file in your React app root:
   ```env
   REACT_APP_API_ENDPOINT=https://your-actual-api-gateway-url.amazonaws.com/Prod
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```

## Environment Variables

The example uses environment variables for configuration:

- `REACT_APP_API_ENDPOINT`: Your API Gateway endpoint URL
- `REACT_APP_ENV`: Optional environment identifier

## Alternative: Use as NPM Package

For a real project, consider publishing the component as an NPM package:

```bash
npm install @your-org/publications-list
```

Then use it like:
```tsx
import { PublicationsList } from '@your-org/publications-list';
```

## Files in this example

- `App.tsx` - Basic usage example with proper structure
- `App.css` - Styling for the example app
- `package.json.example` - Template package.json for Create React App
- `README.md` - This file

## Features Demonstrated

- ✅ TypeScript integration
- ✅ Environment variable configuration
- ✅ Proper component structure
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

## Production Considerations

In a real application, you would also:
- Set up proper routing (React Router)
- Add error boundaries
- Implement authentication
- Add comprehensive testing
- Configure proper build process
- Set up CI/CD pipeline
- Add monitoring and analytics

## Testing

The component includes built-in error handling and loading states. You can test different scenarios:

1. **No API endpoint**: Component shows error message
2. **Invalid API endpoint**: Shows connection error
3. **Empty results**: Shows "No publications found"
4. **Loading state**: Shows spinner while fetching

## API Integration

The component expects your API to return data in this format:

```typescript
interface GetAllPublicationsResponse {
  publications: PublicationResponse[];
  summary: {
    total: number;
    byEducationLevel: {
      'K-12': number;
      'Higher Ed': number;
      'Adult Learning': number;
    };
  };
  filters: {
    educationLevel: string;
    limit: number | 'none';
  };
}
```

Make sure your deployed API matches this contract for proper integration. 