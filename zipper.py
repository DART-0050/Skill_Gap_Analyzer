import os
import zipfile

def zip_clean_project(source_dir, output_zip):
    exclude_dirs = {'.git', 'venv', '__pycache__', '.idea', '.vscode', 'node_modules'}
    exclude_exts = {'.pyc', '.pyo', '.log'}

    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Remove excluded directories from traversal
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if any(file.endswith(ext) for ext in exclude_exts):
                    continue
                full_path = os.path.join(root, file)
                relative_path = os.path.relpath(full_path, source_dir)
                zipf.write(full_path, arcname=relative_path)

    print(f"✅ Created clean ZIP: {output_zip}")

# === CONFIGURATION ===
source_directory = "."  # Current directory
output_zip_name = "project_clean.zip"

zip_clean_project(source_directory, output_zip_name)
