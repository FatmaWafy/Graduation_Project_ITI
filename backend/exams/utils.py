import os
import subprocess
import tempfile
import json
from django.conf import settings

def run_code_and_test(code, language, test_cases):
    """
    Executes student code against multiple test cases and returns detailed results.
    
    Args:
        code (str): The student's submitted code
        language (str): Programming language ('python', 'javascript', 'java')
        test_cases (QuerySet): Django queryset of TestCase objects
    
    Returns:
        list: List of dictionaries containing test results
    """
    results = []
    
    # Validate language support
    supported_languages = ['python', 'javascript', 'java']
    if language not in supported_languages:
        return [{
            "error": f"Unsupported language: {language}",
            "score": 0,
            "passed": False
        } for _ in test_cases]

    try:
        # Create temporary file
        file_extension = {
            'python': '.py',
            'javascript': '.js',
            'java': '.java',
        }[language]

        with tempfile.NamedTemporaryFile(
            mode='w+',
            suffix=file_extension,
            delete=False,
            dir=settings.CODE_EXECUTION_TEMP_DIR  # Configure this in settings.py
        ) as temp_file:
            temp_file.write(code)
            temp_file.flush()
            filename = temp_file.name
            basename = os.path.basename(filename).split('.')[0]

        # Compile Java code if needed
        if language == 'java':
            compile_process = subprocess.run(
                ['javac', filename],
                capture_output=True,
                text=True,
                timeout=10
            )
            if compile_process.returncode != 0:
                return [{
                    "error": compile_process.stderr,
                    "score": 0,
                    "passed": False
                } for _ in test_cases]

        # Process each test case
        for test_case in test_cases:
            result = {
                "test_case_id": test_case.id,
                "input": test_case.input,
                "expected_output": test_case.expected_output,
                "score": 0,
                "passed": False,
                "actual_output": None,
                "error": None
            }

            try:
                # Prepare command based on language
                if language == 'python':
                    command = ['python', filename]
                elif language == 'javascript':
                    command = ['node', filename]
                elif language == 'java':
                    command = ['java', '-cp', os.path.dirname(filename), basename]

                # Execute the code with timeout
                process = subprocess.run(
                    command,
                    input=test_case.input,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    timeout=test_case.timeout or 5  # Use test case timeout or default 5s
                )

                if process.stderr:
                    result["error"] = process.stderr
                else:
                    actual_output = process.stdout.strip()
                    result["actual_output"] = actual_output
                    result["passed"] = (actual_output == test_case.expected_output)
                    result["score"] = test_case.points if result["passed"] else 0

            except subprocess.TimeoutExpired:
                result["error"] = "Execution timed out"
            except Exception as e:
                result["error"] = str(e)
            
            results.append(result)

        return results

    except Exception as e:
        return [{
            "error": f"System error: {str(e)}",
            "score": 0,
            "passed": False
        } for _ in test_cases]
    finally:
        # Cleanup temporary files
        try:
            if os.path.exists(filename):
                os.remove(filename)
            if language == 'java' and os.path.exists(f"{basename}.class"):
                os.remove(f"{basename}.class")
        except Exception as cleanup_error:
            print(f"Cleanup error: {cleanup_error}")