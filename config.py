import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    
    # Supabase Configuration
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
    
    # IPFS Configuration (Pinata)
    PINATA_API_KEY = os.environ.get('PINATA_API_KEY')
    PINATA_SECRET_KEY = os.environ.get('PINATA_SECRET_KEY')
    
    # AI Model Configuration
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    HUGGINGFACE_API_KEY = os.environ.get('HUGGINGFACE_API_KEY')
    
    # File Upload Configuration
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max file size
    
    # Encryption Configuration
    ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY') or 'your-encryption-key-here'
    
    # Emergency Service Configuration
    EMERGENCY_NOTIFICATION_URL = os.environ.get('EMERGENCY_NOTIFICATION_URL')
    
    # Database Configuration
    DATABASE_URL = os.environ.get('DATABASE_URL')
