#!/bin/bash

# Monitor logs for Research Publications Next.js App

echo "🔍 Research Publications App - Log Monitoring"
echo "=============================================="

# Function to monitor CloudWatch logs
monitor_lambda_logs() {
    echo "📊 Monitoring Lambda Function Logs..."
    echo "Available log groups:"
    aws logs describe-log-groups --log-group-name-prefix="/aws/lambda/research-pub-service" --query 'logGroups[*].logGroupName' --output table
    
    echo ""
    echo "To tail logs for a specific function:"
    echo "aws logs tail /aws/lambda/research-pub-service-dev-processPublicationHandler --follow"
    echo "aws logs tail /aws/lambda/research-pub-service-dev-getAllPublicationsHandler --follow"
    echo "aws logs tail /aws/lambda/research-pub-service-dev-getPublicationByIdHandler --follow"
}

# Function to check API Gateway logs
monitor_api_logs() {
    echo "🌐 API Gateway Logs (if enabled)..."
    echo "To enable API Gateway logging:"
    echo "1. Go to API Gateway Console"
    echo "2. Select your API"
    echo "3. Go to Stages → Prod → Logs/Tracing"
    echo "4. Enable CloudWatch Logs"
}

# Function to monitor Amplify build logs
monitor_amplify_logs() {
    echo "🚀 Amplify Build Logs..."
    echo "View at: https://console.aws.amazon.com/amplify/home?region=us-east-1#/d5hhnh9fbej5y"
    echo ""
    echo "Recent builds:"
    aws amplify list-jobs --app-id d5hhnh9fbej5y --branch-name master --max-results 5 --query 'jobSummaries[*].{Status:status,CommitTime:commitTime,JobId:jobId}' --output table
}

# Function to test application endpoints
test_endpoints() {
    echo "🧪 Testing Application Endpoints..."
    echo ""
    
    echo "Testing API Gateway..."
    curl -s -w "Status: %{http_code}, Time: %{time_total}s\n" https://1ocg29j297.execute-api.us-east-1.amazonaws.com/Prod/publications -o /dev/null
    
    echo "Testing Next.js App..."
    curl -s -w "Status: %{http_code}, Time: %{time_total}s\n" -u test:test123# https://master.d5hhnh9fbej5y.amplifyapp.com/ -o /dev/null
}

# Main menu
echo "Select monitoring option:"
echo "1. Monitor Lambda logs"
echo "2. Check API Gateway logs"
echo "3. View Amplify build logs"
echo "4. Test endpoints"
echo "5. All"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1) monitor_lambda_logs ;;
    2) monitor_api_logs ;;
    3) monitor_amplify_logs ;;
    4) test_endpoints ;;
    5) 
        monitor_lambda_logs
        echo ""
        monitor_api_logs
        echo ""
        monitor_amplify_logs
        echo ""
        test_endpoints
        ;;
    *) echo "Invalid choice" ;;
esac

echo ""
echo "🎯 Pro Tips:"
echo "- Use browser DevTools Console for real-time client-side logs"
echo "- Enable CloudWatch Logs for detailed server-side monitoring"
echo "- Use AWS X-Ray for distributed tracing"
echo "- Set up CloudWatch Alarms for proactive monitoring" 