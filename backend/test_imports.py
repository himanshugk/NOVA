# pyre-ignore-all-errors
import sys
try:
    import fastapi
    from app.main import app
    print("BACKEND IMPORTS SUCCESSFUL")
except Exception as e:
    print(f"ERROR: {e}")
