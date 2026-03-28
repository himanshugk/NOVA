# pyre-ignore-all-errors
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nova_dev.db")
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week
