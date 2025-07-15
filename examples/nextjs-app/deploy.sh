#!/bin/bash

# Deploy Research Publications Next.js App to AWS Amplify

set -e

echo "🚀 Starting deployment of Research Publications Next.js App to AWS Amplify..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "   Run: brew install awscli (macOS) or follow AWS documentation"
    exit 1
fi

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo "⚠️  Amplify CLI is not installed. Installing..."
    npm install -g @aws-amplify/cli
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ No package.json found. Please run this script from the nextjs-app directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type checking
echo "🔍 Running type checking..."
npm run type-check

# Build the project
echo "🏗️  Building the project..."
npm run build

echo "✅ Build completed successfully!"

# Instructions for manual deployment
echo ""
echo "📋 Manual Deployment Instructions:"
echo "1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/"
echo "2. Click 'New app' -> 'Host web app'"
echo "3. Choose 'Deploy without Git provider' or connect your Git repository"
echo "4. Upload the built project or connect your repository"
echo "5. Set environment variables in Amplify Console:"
echo "   - NEXT_PUBLIC_API_ENDPOINT: Your API Gateway URL"
echo "6. Amplify will automatically detect Next.js and deploy"
echo ""
echo "🌐 Your app will be available at: https://[app-id].amplifyapp.com"
echo ""
echo "🔧 For automatic deployment with Git:"
echo "1. Push your code to a Git repository (GitHub, GitLab, etc.)"
echo "2. Connect the repository in Amplify Console"
echo "3. Amplify will automatically redeploy on every push"

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf deployment-package.tar.gz -X <(echo "node_modules" && echo ".git" && echo "deployment-package.tar.gz") .

echo "✅ Deployment package created: deployment-package.tar.gz"
echo "📤 You can upload this package to AWS Amplify Console"

echo "🎉 Deployment preparation complete!" 