import sys
from pathlib import Path

# Ensure the backend directory is in sys.path so 'app' package is always resolvable
_BACKEND_DIR = Path(__file__).resolve().parent
if str(_BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(_BACKEND_DIR))
