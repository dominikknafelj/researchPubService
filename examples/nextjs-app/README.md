# Research Publications Next.js App

A modern Next.js application for displaying categorized research publications from Digital Promise's content management system.

## Overview

This Next.js application provides a clean, responsive interface for browsing research publications categorized by education level (K-12, Higher Education, Adult Learning). Built with TypeScript and deployed on AWS Amplify.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript**: Full type safety and enhanced developer experience
- **Real-time Data**: Fetches live data from the AWS Lambda API
- **Category Filtering**: Filter publications by education level
- **Modern UI**: Clean, professional design with hover effects and animations
- **Error Handling**: Comprehensive error handling with retry functionality
- **Loading States**: Smooth loading animations and states
- **SEO Optimized**: Meta tags and semantic HTML structure

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: CSS3 with responsive design
- **Deployment**: AWS Amplify
- **API**: AWS Lambda functions with API Gateway
- **Data Storage**: DynamoDB (via Lambda functions)

## Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- AWS CLI (for deployment)
- Git (for version control)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd researchPubService/examples/nextjs-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   # API Configuration
   NEXT_PUBLIC_API_ENDPOINT=https://your-api-gateway-url.amazonaws.com/Prod
   
   # Optional: Development settings
   NODE_ENV=development
   ```

## Development

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size

### Project Structure

```
examples/nextjs-app/
├── components/           # React components
│   └── PublicationsList.tsx
├── lib/                 # Utilities and configuration
│   └── config.ts
├── pages/               # Next.js pages
│   ├── _app.tsx        # App component
│   └── index.tsx       # Home page
├── styles/             # CSS styles
│   └── globals.css
├── types/              # TypeScript type definitions
│   └── index.ts
├── public/             # Static assets
├── next.config.js      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
├── amplify.yml         # AWS Amplify build configuration
├── deploy.sh           # Deployment script
└── README.md           # This file
```

## Configuration

### API Endpoint

The application requires an API endpoint to fetch publications. Set this in your environment variables:

```bash
NEXT_PUBLIC_API_ENDPOINT=https://your-api-gateway-url.amazonaws.com/Prod
```

### Default Configuration

The app includes a default configuration in `lib/config.ts` that can be customized:

```typescript
// Default API endpoint (update this to your actual endpoint)
const defaultApiEndpoint = 'https://1ocg29j297.execute-api.us-east-1.amazonaws.com/Prod';
```

## API Integration

The application integrates with the following API endpoints:

- `GET /publications` - Fetch all publications
- `GET /publications?educationLevel={level}` - Filter by education level
- `GET /publications/{id}` - Get specific publication (for future use)

### API Response Format

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
    educationLevel: EducationLevel | 'all';
    limit: number | 'none';
  };
}
```

## Deployment

### AWS Amplify (Recommended)

1. **Prepare for deployment**:
   ```bash
   ./deploy.sh
   ```

2. **Deploy using AWS Amplify Console**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Choose deployment method:
     - **Option A**: Upload the `deployment-package.tar.gz` created by `deploy.sh`
     - **Option B**: Connect your Git repository for automatic deployments

3. **Configure environment variables** in Amplify Console:
   - `NEXT_PUBLIC_API_ENDPOINT`: Your API Gateway URL

4. **Deploy**: Amplify will automatically detect Next.js and deploy

### Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to any static hosting service** (Vercel, Netlify, etc.)

### Automatic Deployment with Git

1. **Push your code** to a Git repository (GitHub, GitLab, etc.)
2. **Connect the repository** in AWS Amplify Console
3. **Amplify will automatically redeploy** on every push to the main branch

## Usage

### Main Features

1. **Browse Publications**: View all publications with summary statistics
2. **Filter by Category**: Use the dropdown to filter by education level
3. **Publication Details**: Each card shows title, authors, abstract, and metadata
4. **Responsive Design**: Works on all device sizes
5. **Error Handling**: Automatic retry on failed requests

### Navigation

- **Home Page**: Lists all publications with filtering options
- **Category Filter**: Dropdown to filter by K-12, Higher Ed, or Adult Learning
- **Refresh**: Manual refresh button to reload data

### Publication Card Information

Each publication card displays:
- **Category Badge**: Color-coded education level
- **Title**: Publication title
- **Authors**: Formatted author names
- **Abstract**: Truncated preview (if available)
- **Keywords**: Publication keywords (if available)
- **Publication Date**: When the research was published
- **Source Link**: Link to original publication (if available)
- **Processed Date**: When the publication was processed by the system

## Performance

### Optimization Features

- **Static Site Generation**: Pre-rendered pages for better performance
- **Image Optimization**: Automatic image optimization (if images are added)
- **Code Splitting**: Automatic code splitting for faster loading
- **Caching**: Efficient caching strategies

### Performance Monitoring

Monitor your deployed application using:
- AWS CloudWatch (for Amplify)
- Next.js built-in analytics
- Web Vitals monitoring

## Troubleshooting

### Common Issues

1. **API Connection Error**:
   - Verify `NEXT_PUBLIC_API_ENDPOINT` is set correctly
   - Check that the API Gateway is accessible
   - Ensure CORS is properly configured on the API

2. **Build Errors**:
   - Run `npm run type-check` to identify TypeScript errors
   - Check that all dependencies are installed
   - Verify Node.js version compatibility

3. **Deployment Issues**:
   - Ensure AWS CLI is configured with proper permissions
   - Check Amplify build logs for specific errors
   - Verify environment variables are set in Amplify Console

### Development Tips

1. **Hot Reloading**: Changes are automatically reflected in development
2. **Type Safety**: Use TypeScript for better development experience
3. **Component Development**: Components are modular and reusable
4. **CSS Organization**: Global styles in `styles/globals.css`

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes** and ensure tests pass
4. **Commit your changes**: `git commit -m "Add your feature"`
5. **Push to the branch**: `git push origin feature/your-feature`
6. **Create a Pull Request**

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For support and questions:
- Check the [troubleshooting section](#troubleshooting)
- Review the [API documentation](../README.md)
- Contact the development team

## Changelog

### v1.0.0 (Initial Release)
- Next.js 14 setup with TypeScript
- Responsive publications listing
- Category filtering functionality
- AWS Amplify deployment configuration
- Comprehensive documentation

## Future Enhancements

- Individual publication detail pages
- Search functionality
- Advanced filtering options
- User authentication
- Publication bookmarking
- Social sharing features
- Dark mode support
- Internationalization (i18n)

---

**Digital Promise Research Publications System** - Built with ❤️ using Next.js and AWS 