import os
import shutil
from git import Repo

TEMP_REPO_DIR = "temp_repo"

def clone_and_load_repo(repo_url: str):
    """Clones a GitHub repository and reads code files."""
    if os.path.exists(TEMP_REPO_DIR):
        def remove_readonly(func, path, excinfo):
            try:
                os.chmod(path, 0o777)
                func(path)
            except Exception:
                pass
        shutil.rmtree(TEMP_REPO_DIR, onerror=remove_readonly)
    
    # Clone the repository
    print(f"Cloning {repo_url}...")
    Repo.clone_from(repo_url, TEMP_REPO_DIR)
    
    documents = []
    valid_extensions = {".py", ".js", ".ts", ".tsx", ".jsx", ".md"}
    
    for root, dirs, files in os.walk(TEMP_REPO_DIR):
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in valid_extensions:
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    rel_path = os.path.relpath(file_path, TEMP_REPO_DIR)
                    
                    documents.append({
                        "page_content": content,
                        "metadata": {"source": repo_url, "file_path": rel_path}
                    })
                except Exception as e:
                    print(f"Error reading file {file_path}: {e}")
                    
    return documents
