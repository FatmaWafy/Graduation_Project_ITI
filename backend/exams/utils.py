import os
import subprocess
import tempfile


def run_code_by_language(code, language, input_data):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix={
            'python': '.py',
            'javascript': '.js',
            'java': '.java',
        }.get(language, '.txt')) as temp_file:
            temp_file.write(code.encode())
            temp_file.flush()
            filename = temp_file.name
            basename = os.path.basename(filename).split('.')[0]

        if language == 'python':
            command = ['python', filename]
        elif language == 'javascript':
            command = ['node', filename]
        elif language == 'java':
            compile = subprocess.run(['javac', filename], capture_output=True)
            if compile.returncode != 0:
                return {"error": compile.stderr.decode()}
            command = ['java', basename]
        else:
            return {"error": f"Unsupported language: {language}"}

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
        try:
            os.remove(filename)
            if language == 'java':
                os.remove(f"{basename}.class")
        except:
            pass
