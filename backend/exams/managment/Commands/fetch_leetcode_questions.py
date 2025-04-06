import json
import requests
from django.core.management.base import BaseCommand
from django.db import transaction
from ...models import CodingQuestion, TestCase

class Command(BaseCommand):
    help = 'Fetch coding questions from LeetCode and store them in the database'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=10, help='Number of questions to fetch')
        parser.add_argument('--difficulty', type=str, default=None, 
                            help='Filter by difficulty (easy, medium, hard)')

    def handle(self, *args, **options):
        limit = options['limit']
        difficulty = options['difficulty']
        
        self.stdout.write(f"Fetching {limit} LeetCode questions...")
        
        # LeetCode GraphQL endpoint
        url = "https://leetcode.com/graphql"
        
        # GraphQL query to fetch problems
        query = """
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total
            questions {
              questionId
              questionFrontendId
              title
              titleSlug
              difficulty
              topicTags {
                name
                slug
              }
            }
          }
        }
        """
        
        variables = {
            "categorySlug": "",
            "skip": 0,
            "limit": limit,
            "filters": {}
        }
        
        if difficulty:
            variables["filters"]["difficulty"] = difficulty.upper()
        
        try:
            # Fetch the list of problems
            response = requests.post(url, json={"query": query, "variables": variables})
            response.raise_for_status()
            data = response.json()
            
            questions = data.get('data', {}).get('problemsetQuestionList', {}).get('questions', [])
            
            if not questions:
                self.stdout.write(self.style.WARNING("No questions found"))
                return
            
            self.stdout.write(f"Found {len(questions)} questions. Fetching details...")
            
            # Process each question
            for question_data in questions:
                self._process_question(question_data)
                
            self.stdout.write(self.style.SUCCESS(f"Successfully imported {len(questions)} questions"))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error fetching questions: {str(e)}"))
    
    def _process_question(self, question_data):
        title_slug = question_data.get('titleSlug')
        
        # Fetch detailed question data
        question_detail = self._fetch_question_detail(title_slug)
        if not question_detail:
            return
        
        question_content = question_detail.get('content', '')
        question_id = question_data.get('questionId')
        title = question_data.get('title', '')
        difficulty = question_data.get('difficulty', '').lower()
        
        # Extract tags
        tags = []
        for tag in question_data.get('topicTags', []):
            tags.append(tag.get('name'))
        
        # Extract example test cases from the content
        examples = self._extract_examples(question_content)
        
        with transaction.atomic():
            # Create or update the question
            question, created = CodingQuestion.objects.update_or_create(
                question_id=question_id,
                defaults={
                    'title': title,
                    'description': question_content,
                    'difficulty': difficulty,
                    'tags': tags
                }
            )
            
            # Delete existing test cases
            if not created:
                question.test_cases.all().delete()
            
            # Create test cases
            for example in examples:
                TestCase.objects.create(
                    question=question,
                    input_data=example.get('input', ''),
                    expected_output=example.get('output', '')
                )
            
            status = "Created" if created else "Updated"
            self.stdout.write(f"{status} question: {title}")
    
    def _fetch_question_detail(self, title_slug):
        url = "https://leetcode.com/graphql"
        
        query = """
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            content
            difficulty
            exampleTestcases
            sampleTestCase
          }
        }
        """
        
        variables = {
            "titleSlug": title_slug
        }
        
        try:
            response = requests.post(url, json={"query": query, "variables": variables})
            response.raise_for_status()
            data = response.json()
            return data.get('data', {}).get('question', {})
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error fetching question detail for {title_slug}: {str(e)}"))
            return None
    
    def _extract_examples(self, content):
        """Extract example inputs and outputs from question content"""
        examples = []
        
        # This is a simplified extraction method - actual implementation may need more robust parsing
        # depending on the HTML structure of LeetCode questions
        import re
        
        # Find all example blocks
        example_blocks = re.findall(r'<strong>Example \d+:</strong>(.*?)(?=<strong>|$)', content, re.DOTALL)
        
        for block in example_blocks:
            # Extract input and output
            input_match = re.search(r'<strong>Input:</strong>\s*(.*?)\s*(?=<strong>|$)', block, re.DOTALL)
            output_match = re.search(r'<strong>Output:</strong>\s*(.*?)\s*(?=<strong>|$)', block, re.DOTALL)
            
            input_data = input_match.group(1).strip() if input_match else ""
            output_data = output_match.group(1).strip() if output_match else ""
            
            # Clean HTML tags
            input_data = re.sub(r'<[^>]+>', '', input_data)
            output_data = re.sub(r'<[^>]+>', '', output_data)
            
            examples.append({
                'input': input_data,
                'output': output_data
            })
        
        return examples

