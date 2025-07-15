#!/bin/bash

echo "🚀 Deploying Research Publication Notification System"
echo "=================================================="

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &>/dev/null; then
    echo "❌ AWS credentials not configured"
    echo "Please run: aws configure"
    exit 1
fi

# Build TypeScript code
echo "📦 Building TypeScript handlers..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ TypeScript build failed"
    exit 1
fi

# Deploy with SAM
echo "🚀 Deploying with SAM..."
sam deploy \
    --stack-name researchPubService \
    --region us-east-1 \
    --capabilities CAPABILITY_IAM \
    --confirm-changeset \
    --resolve-s3 \
    --parameter-overrides \
        ParameterKey=Environment,ParameterValue=prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🔗 Your API endpoints:"
    aws cloudformation describe-stacks \
        --stack-name researchPubService \
        --query 'Stacks[0].Outputs[?OutputKey==`WebEndpoint`].OutputValue' \
        --output text
    echo ""
    echo "📚 Next steps:"
    echo "1. Test your API endpoints"
    echo "2. Update the React component with your API URL"
    echo "3. Deploy your frontend application"
else
    echo "❌ Deployment failed"
    exit 1
fi 