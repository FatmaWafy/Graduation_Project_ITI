import os
import subprocess
import tempfile

def run_code_and_test(code, language, input_data):
    try:
        # Determine the temporary file suffix for different languages
        file_extension = {
            'python': '.py',
            'javascript': '.js',
            'java': '.java',
        }.get(language, '.txt')

        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(code.encode())
            temp_file.flush()
            filename = temp_file.name
            basename = os.path.basename(filename).split('.')[0]

        if language == 'python':
            command = ['python', filename]
        elif language == 'javascript':
            command = ['node', filename]
        elif language == 'java':
            # Compile the Java file first
            compile = subprocess.run(['javac', filename], capture_output=True)
            if compile.returncode != 0:
                return {"error": compile.stderr.decode()}
            # Run the Java class file after successful compilation
            command = ['java', basename]
        else:
            return {"error": f"Unsupported language: {language}"}

        # Run the code with a timeout of 5 seconds
        process = subprocess.Popen(
            command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        output, error = process.communicate(input=input_data.encode(), timeout=5)

        if error:
            return {"error": error.decode()}
        return {"output": output.decode().strip()}

    except subprocess.TimeoutExpired:
        return {"error": "Execution timed out."}
    except Exception as e:
        return {"error": str(e)}
    finally:
        # Cleanup the temporary file
        try:
            os.remove(filename)
            # Remove the Java class file if it's Java
            if language == 'java':
                os.remove(f"{basename}.class")
        except Exception as cleanup_error:
            print(f"Error cleaning up temp files: {cleanup_error}")

