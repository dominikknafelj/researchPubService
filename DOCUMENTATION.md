# Research Publication Notification System (TypeScript)

## Overview

This is a serverless notification system built using AWS Lambda and API Gateway that processes incoming webhook data when new research publications are added to Digital Promise's content management system. The system automatically categorizes publications by education level and provides both REST API endpoints and a React component for viewing the categorized publications.

**Technology Stack:**
- **Backend**: TypeScript, AWS Lambda, API Gateway, DynamoDB
- **Frontend**: React with TypeScript
- **Build System**: esbuild for fast TypeScript compilation
- **Testing**: Jest with TypeScript support
- **Linting**: ESLint with TypeScript rules

## Architecture

### System Components

1. **AWS Lambda Functions (TypeScript)**
   - `processPublicationHandler`: Main webhook processor that categorizes publications
   - `getAllPublicationsHandler`: Retrieves all publications with optional filtering
   - `getPublicationByIdHandler`: Retrieves a specific publication by ID

2. **API Gateway**
   - RESTful API endpoints for all operations
   - CORS enabled for web frontend integration
   - Automatic request/response validation

3. **DynamoDB Table**
   - `PublicationsTable`: Stores publication metadata and categorization results
   - Primary key: `id` (UUID)
   - Provisioned throughput: 2 read/write capacity units

4. **React Component (TypeScript)**
   - `PublicationsList`: Modern, responsive UI for viewing categorized publications
   - Real-time filtering and categorization summaries
   - Mobile-first responsive design

### Data Flow

```
Webhook Request → API Gateway → Lambda Function → DynamoDB → Response
                                     ↓
                            Education Level Categorization
                                     ↓
                            CloudWatch Logging
```

## Type Definitions

The system uses comprehensive TypeScript types defined in `src/types/index.ts`:

- `PublicationInput`: Input data structure for new publications
- `Publication`: Complete publication record with metadata
- `PublicationResponse`: API response format
- `EducationLevel`: Union type for education categories
- `ValidationResult`: Input validation results
- `GetAllPublicationsResponse`: API response for bulk retrieval

## API Endpoints

### 1. Process Publication (POST /publications)

**Purpose**: Receives webhook data for new publications and processes them.

**Request Body**:
```json
{
  "title": "Advanced Machine Learning in K-12 Education",
  "abstract": "This study explores the implementation of machine learning concepts in elementary and middle school curricula...",
  "authors": ["Dr. Jane Smith", "Prof. John Doe"],
  "publicationDate": "2024-01-15",
  "keywords": "machine learning, K-12, education, curriculum",
  "description": "A comprehensive study on ML integration in schools",
  "sourceUrl": "https://example.com/publication/123"
}
```

**Response**:
```json
{
  "message": "Publication processed successfully",
  "publication": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Advanced Machine Learning in K-12 Education",
    "educationLevel": "K-12",
    "processedAt": "2024-01-20T10:30:00Z"
  }
}
```

### 2. Get All Publications (GET /publications)

**Purpose**: Retrieves all publications with optional filtering.

**Query Parameters**:
- `educationLevel`: Filter by education level (K-12, Higher Ed, Adult Learning)
- `limit`: Limit number of results (max 100)

**Response**:
```json
{
  "publications": [...],
  "summary": {
    "total": 25,
    "byEducationLevel": {
      "K-12": 8,
      "Higher Ed": 12,
      "Adult Learning": 5
    }
  },
  "filters": {
    "educationLevel": "all",
    "limit": "none"
  }
}
```

### 3. Get Publication by ID (GET /publications/{id})

**Purpose**: Retrieves a specific publication by its ID.

**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Advanced Machine Learning in K-12 Education",
  "abstract": "This study explores...",
  "authors": ["Dr. Jane Smith", "Prof. John Doe"],
  "publicationDate": "2024-01-15",
  "keywords": "machine learning, K-12, education, curriculum",
  "description": "A comprehensive study on ML integration in schools",
  "sourceUrl": "https://example.com/publication/123",
  "educationLevel": "K-12",
  "processedAt": "2024-01-20T10:30:00Z"
}
```

## Education Level Categorization

The system uses keyword-based categorization to classify publications into three education levels:

### K-12 Education
**Keywords**: elementary, middle school, high school, k-12, kindergarten, grade, primary school, secondary school, teen, adolescent, youth, preschool, early childhood, student achievement, classroom management

### Higher Education
**Keywords**: university, college, undergraduate, graduate, doctoral, phd, campus, academic, faculty, professor, higher education, post-secondary, bachelor, master, research university, dissertation

### Adult Learning
**Keywords**: adult education, continuing education, professional development, workforce, lifelong learning, adult learner, career, professional training, workplace learning, adult literacy, vocational, certification, upskilling, reskilling, corporate training

### Classification Algorithm

1. **Text Analysis**: Combines title, abstract, keywords, and description
2. **Keyword Matching**: Scores each category based on keyword frequency
3. **Weighted Scoring**: Title matches receive double weight
4. **Default Assignment**: Publications with no clear match default to "Higher Ed"

## TypeScript Development

### Type Safety Benefits

- **Compile-time Error Detection**: Catch type errors before deployment
- **IntelliSense Support**: Better IDE support with auto-completion
- **Refactoring Safety**: Reliable code refactoring with type checking
- **API Contract Enforcement**: Ensure API responses match defined types

### Development Workflow

```bash
# Install dependencies
npm install

# Type checking
npm run type-check

# Build TypeScript code
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Input Validation

The system includes comprehensive TypeScript-based input validation:

### Required Fields
- `title`: Non-empty string (max 500 characters)
- `authors`: Non-empty array of strings

### Optional Fields
- `abstract`: String (max 5000 characters)
- `publicationDate`: Valid ISO date string
- `keywords`: String
- `description`: String
- `sourceUrl`: String (URL format)

### Error Responses
- **400 Bad Request**: Invalid JSON, missing required fields, validation errors
- **405 Method Not Allowed**: Wrong HTTP method
- **404 Not Found**: Publication not found (GET by ID)
- **500 Internal Server Error**: Database or system errors

## Build Process

The system uses esbuild for fast TypeScript compilation:

### Build Configuration
```javascript
{
  entryPoints: [
    'src/handlers/process-publication.ts',
    'src/handlers/get-all-publications.ts',
    'src/handlers/get-publication-by-id.ts'
  ],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  target: 'es2022',
  format: 'esm',
  sourcemap: true,
  minify: true,
  external: ['@aws-sdk/*']
}
```

### Build Commands
```bash
# Build for production
npm run build

# Build SAM application
npm run build:sam

# Type check only
npm run build:tsc
```

## CloudWatch Logging

The system provides comprehensive logging with TypeScript type safety:

### Log Types
- **Info Logs**: Request processing, successful operations
- **Error Logs**: Validation failures, database errors
- **Debug Logs**: Categorization decisions, processing metrics

### Log Format
```json
{
  "timestamp": "2024-01-20T10:30:00Z",
  "level": "INFO",
  "message": "Publication processed successfully",
  "publicationId": "550e8400-e29b-41d4-a716-446655440000",
  "category": "K-12",
  "processingTime": "150ms"
}
```

## React Component Usage (TypeScript)

### Installation
```bash
npm install react react-dom
npm install --save-dev @types/react @types/react-dom
```

### Basic Usage
```tsx
import React from 'react';
import PublicationsList from './src/components/PublicationsList';

function App(): JSX.Element {
  return (
    <div className="App">
      <PublicationsList 
        apiEndpoint="https://your-api-gateway-url.amazonaws.com/Prod"
      />
    </div>
  );
}

export default App;
```

### Features
- **Type-Safe Props**: Fully typed component props and state
- **Real-time Filtering**: Filter publications by education level
- **Responsive Design**: Mobile-first approach with grid layout
- **Loading States**: Animated loading spinners
- **Error Handling**: User-friendly error messages with retry options
- **Summary Cards**: Visual overview of publication distribution
- **Modern UI**: Clean, professional design with hover effects

## Deployment Instructions

### Prerequisites
- AWS CLI configured with appropriate permissions
- AWS SAM CLI installed
- Node.js 22.x or later
- TypeScript 5.x or later

### Step 1: Clone and Setup
```bash
git clone <repository-url>
cd researchPubService
npm install
```

### Step 2: Build TypeScript Code
```bash
# Build the TypeScript handlers
npm run build

# Verify build output
ls -la dist/
```

### Step 3: Deploy with SAM
```bash
# Build SAM application
npm run build:sam

# Deploy to AWS (first time)
npm run deploy:guided

# Deploy updates
npm run deploy
```

### Step 4: Test the System
```bash
# Test the API endpoints
curl -X POST https://your-api-gateway-url.amazonaws.com/Prod/publications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Publication",
    "authors": ["Test Author"],
    "abstract": "This is a test publication about university research."
  }'
```

## Testing

### Unit Tests (TypeScript)
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
```
__tests__/
├── unit/
│   ├── handlers/
│   │   ├── process-publication.test.ts
│   │   ├── get-all-publications.test.ts
│   │   └── get-publication-by-id.test.ts
│   └── types/
│       └── validation.test.ts
```

### Integration Testing
```bash
# Local testing with SAM
npm run local

# Test with events
sam local invoke processPublicationFunction --event events/event-process-publication.json
```

## Performance Considerations

- **TypeScript Compilation**: Fast builds with esbuild
- **Lambda Cold Starts**: Minimized through connection reuse and bundling
- **Tree Shaking**: Unused code elimination with esbuild
- **Source Maps**: Debugging support in production
- **Type Guards**: Runtime type checking for API boundaries

## Security Considerations

1. **Type Safety**: Compile-time prevention of type-related vulnerabilities
2. **Input Validation**: Comprehensive TypeScript-based validation
3. **API Gateway**: Rate limiting and throttling enabled
4. **DynamoDB**: IAM policies restrict access to specific tables
5. **Lambda**: Minimal IAM permissions following least privilege principle

## Environment Variables

The Lambda functions use the following environment variables:
- `PUBLICATIONS_TABLE`: DynamoDB table name (auto-configured by SAM)
- `NODE_OPTIONS`: `--enable-source-maps` for debugging support

## Monitoring and Maintenance

### TypeScript-Specific Monitoring
- **Build Failures**: Monitor TypeScript compilation errors
- **Type Coverage**: Ensure comprehensive type coverage
- **Performance**: Monitor build times and bundle sizes

### Maintenance Tasks
1. **Weekly**: Review TypeScript compilation warnings
2. **Monthly**: Update TypeScript and related dependencies
3. **Quarterly**: Review and update type definitions
4. **As needed**: Refactor types for better maintainability

## Troubleshooting

### TypeScript Issues
1. **Compilation Errors**: Check tsconfig.json and type definitions
2. **Build Failures**: Verify esbuild configuration
3. **Type Errors**: Review type definitions and imports
4. **Performance**: Monitor bundle sizes and compilation time

### Common Issues
1. **Deploy Failures**: Check build output and SAM configuration
2. **API Errors**: Verify type definitions match API contracts
3. **Runtime Errors**: Check source maps and CloudWatch logs

## Future Enhancements

1. **Advanced Types**: Branded types and stricter validation
2. **Code Generation**: API client generation from TypeScript types
3. **Schema Validation**: Runtime schema validation with type inference
4. **Performance**: Further optimization of TypeScript compilation
5. **Developer Experience**: Better tooling and IDE integration

## Support

For issues or questions, please:
1. Check TypeScript compilation errors first
2. Review the type definitions in `src/types/index.ts`
3. Consult the troubleshooting section
4. Review CloudWatch logs with source map support
5. Contact the development team

---

*This documentation covers the TypeScript implementation of the Digital Promise Research Publication Notification System coding assessment.* 