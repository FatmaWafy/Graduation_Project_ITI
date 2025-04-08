import subprocess
import tempfile
import time
import os

def run_code_with_test_cases(code, language, test_cases):
    # Temporary file to write the submitted code
    with tempfile.NamedTemporaryFile(delete=False, mode='w', suffix=f'.{language}') as temp_file:
        temp_file.write(code)
        temp_file_path = temp_file.name

    # Store results for each test case
    results = []

    for test_case in test_cases:
        input_data = test_case.get('input', '')
        expected_output = test_case.get('expected_output', '')
        timeout = test_case.get('timeout', 5)

        try:
            start_time = time.time()  # Capture start time

            # Execute code depending on the language
            if language == 'python':
                result = subprocess.run(
                    ['python3', temp_file_path],
                    input=input_data,
                    capture_output=True,
                    text=True,
                    timeout=timeout
                )
            elif language == 'javascript':
                # Ensure Node.js is installed on the server
                result = subprocess.run(
                    ['node', temp_file_path],
                    input=input_data,
                    capture_output=True,
                    text=True,
                    timeout=timeout
                )
            elif language == 'java':
                # Compile and run Java code (you must have `javac` installed)
                result = subprocess.run(
                    ['javac', temp_file_path],  # Compile Java code
                    capture_output=True,
                    text=True,
                    timeout=timeout
                )
                if result.returncode == 0:  # Only run if compilation was successful
                    result = subprocess.run(
                        ['java', temp_file_path.replace('.java', '')],  # Run the compiled code
                        input=input_data,
                        capture_output=True,
                        text=True,
                        timeout=timeout
                    )
            else:
                raise ValueError(f"Unsupported language: {language}")

            end_time = time.time()  # Capture end time
            execution_time = end_time - start_time  # Calculate execution time

            # Handle output and compare with expected output
            passed = result.stdout.strip() == expected_output.strip()
            results.append({
                'id': test_case['id'],
                'input': input_data,
                'expected_output': expected_output,
                'actual_output': result.stdout.strip(),
                'pass': passed,
                'execution_time': execution_time,  # Capture execution time
                'score': test_case.get('points', 1) if passed else 0  # Assign points for passed tests
            })

        except subprocess.TimeoutExpired:
            results.append({
                'id': test_case['id'],
                'input': input_data,
                'expected_output': expected_output,
                'actual_output': 'Timeout',
                'pass': False,
                'execution_time': None,
                'score': 0
            })
        except Exception as e:
            results.append({
                'id': test_case['id'],
                'input': input_data,
                'expected_output': expected_output,
                'actual_output': str(e),
                'pass': False,
                'execution_time': None,
                'score': 0
            })

    # Cleanup temporary file
    try:
        os.remove(temp_file_path)
    except Exception as e:
        print(f"Error cleaning up temporary file: {e}")

    return results
