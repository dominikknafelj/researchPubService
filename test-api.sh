#!/bin/bash

# Research Publication Notification System - API Testing Script
# Update API_ENDPOINT with your actual API Gateway URL

API_ENDPOINT="https://your-api-gateway-url.amazonaws.com/Prod"

echo "=============================================="
echo "Research Publication Notification System"
echo "API Testing Script"
echo "=============================================="
echo ""

# Test 1: Create a K-12 publication
echo "Test 1: Creating a K-12 publication..."
curl -X POST "$API_ENDPOINT/publications" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Effective Classroom Management in Elementary Schools",
    "abstract": "This study examines classroom management strategies for elementary school teachers, focusing on creating positive learning environments for young students.",
    "authors": ["Dr. Jennifer Williams", "Prof. Robert Martinez"],
    "publicationDate": "2024-01-10",
    "keywords": "elementary, classroom management, K-12, teaching strategies",
    "description": "Research on elementary school classroom management techniques",
    "sourceUrl": "https://example.com/k12-management-study"
  }'
echo -e "\n"

# Test 2: Create a Higher Ed publication
echo "Test 2: Creating a Higher Education publication..."
curl -X POST "$API_ENDPOINT/publications" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Digital Transformation in University Libraries",
    "abstract": "An analysis of how university libraries are adapting to digital technologies and changing student needs in higher education.",
    "authors": ["Dr. Amanda Thompson", "Prof. David Lee"],
    "publicationDate": "2024-01-12",
    "keywords": "university, library, digital transformation, higher education",
    "description": "Study on digital transformation in academic libraries",
    "sourceUrl": "https://example.com/university-libraries-study"
  }'
echo -e "\n"

# Test 3: Create an Adult Learning publication
echo "Test 3: Creating an Adult Learning publication..."
curl -X POST "$API_ENDPOINT/publications" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Professional Development in the Digital Age",
    "abstract": "Exploring effective professional development strategies for adult learners in the context of rapid technological change.",
    "authors": ["Dr. Lisa Johnson", "Prof. Mark Davis"],
    "publicationDate": "2024-01-14",
    "keywords": "professional development, adult learning, workforce, career",
    "description": "Research on adult professional development programs",
    "sourceUrl": "https://example.com/adult-learning-study"
  }'
echo -e "\n"

# Test 4: Get all publications
echo "Test 4: Retrieving all publications..."
curl -X GET "$API_ENDPOINT/publications"
echo -e "\n"

# Test 5: Get publications filtered by K-12
echo "Test 5: Retrieving K-12 publications only..."
curl -X GET "$API_ENDPOINT/publications?educationLevel=K-12"
echo -e "\n"

# Test 6: Get publications filtered by Higher Ed
echo "Test 6: Retrieving Higher Ed publications only..."
curl -X GET "$API_ENDPOINT/publications?educationLevel=Higher%20Ed"
echo -e "\n"

# Test 7: Get publications filtered by Adult Learning
echo "Test 7: Retrieving Adult Learning publications only..."
curl -X GET "$API_ENDPOINT/publications?educationLevel=Adult%20Learning"
echo -e "\n"

# Test 8: Test error handling with invalid data
echo "Test 8: Testing error handling with invalid data..."
curl -X POST "$API_ENDPOINT/publications" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "authors": []
  }'
echo -e "\n"

# Test 9: Test wrong HTTP method
echo "Test 9: Testing wrong HTTP method..."
curl -X GET "$API_ENDPOINT/publications" \
  -X DELETE
echo -e "\n"

echo "=============================================="
echo "API Testing Complete"
echo "=============================================="
echo ""
echo "To use this script:"
echo "1. Update API_ENDPOINT with your actual API Gateway URL"
echo "2. Run: chmod +x test-api.sh"
echo "3. Run: ./test-api.sh"
echo ""
echo "For individual publication retrieval:"
echo "curl -X GET \"\$API_ENDPOINT/publications/{publication-id}\"" 