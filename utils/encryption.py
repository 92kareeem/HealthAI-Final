from cryptography.fernet import Fernet
from config import Config
import base64
import logging

logger = logging.getLogger(__name__)

class EncryptionService:
    def __init__(self):
        # In production, use a proper key management system
        self.key = Config.ENCRYPTION_KEY.encode()
        if len(self.key) != 32:
            # Pad or truncate to 32 bytes
            self.key = self.key[:32].ljust(32, b'0')
        
        self.cipher_suite = Fernet(base64.urlsafe_b64encode(self.key))
    
    def encrypt(self, data: str) -> str:
        """Encrypt sensitive data"""
        try:
            if not data:
                return ""
            
            encrypted_data = self.cipher_suite.encrypt(data.encode())
            return base64.urlsafe_b64encode(encrypted_data).decode()
            
        except Exception as e:
            logger.error(f"Encryption error: {str(e)}")
            raise
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        try:
            if not encrypted_data:
                return ""
            
            decoded_data = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted_data = self.cipher_suite.decrypt(decoded_data)
            return decrypted_data.decode()
            
        except Exception as e:
            logger.error(f"Decryption error: {str(e)}")
            raise

# Global encryption service instance
encryption_service = EncryptionService()

def encrypt_sensitive_data(data: str) -> str:
    """Encrypt sensitive data"""
    return encryption_service.encrypt(data)

def decrypt_sensitive_data(encrypted_data: str) -> str:
    """Decrypt sensitive data"""
    return encryption_service.decrypt(encrypted_data)
