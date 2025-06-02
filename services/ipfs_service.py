import requests
import json
import os
import logging
from typing import Optional, Dict, Any
from config import Config
import hashlib

logger = logging.getLogger(__name__)

class IPFSService:
    def __init__(self):
        self.pinata_api_key = Config.PINATA_API_KEY
        self.pinata_secret_key = Config.PINATA_SECRET_KEY
        self.pinata_base_url = "https://api.pinata.cloud"
        self.gateway_url = "https://gateway.pinata.cloud/ipfs"
    
    def upload_file(self, file_path: str, metadata: Optional[Dict] = None) -> str:
        """Upload file to IPFS via Pinata"""
        try:
            url = f"{self.pinata_base_url}/pinning/pinFileToIPFS"
            
            headers = {
                'pinata_api_key': self.pinata_api_key,
                'pinata_secret_api_key': self.pinata_secret_key
            }
            
            # Prepare file for upload
            with open(file_path, 'rb') as file:
                files = {'file': file}
                
                # Add metadata if provided
                if metadata:
                    pinata_metadata = {
                        'name': metadata.get('name', os.path.basename(file_path)),
                        'keyvalues': metadata.get('keyvalues', {})
                    }
                    files['pinataMetadata'] = (None, json.dumps(pinata_metadata))
                
                response = requests.post(url, files=files, headers=headers)
                response.raise_for_status()
                
                result = response.json()
                ipfs_hash = result['IpfsHash']
                
                logger.info(f"File uploaded to IPFS: {ipfs_hash}")
                return ipfs_hash
                
        except Exception as e:
            logger.error(f"Error uploading to IPFS: {str(e)}")
            raise
    
    def upload_json(self, data: Dict[str, Any], name: str) -> str:
        """Upload JSON data to IPFS"""
        try:
            headers = {
                'Content-Type': 'application/json',
                'pinata_api_key': self.pinata_api_key,
                'pinata_secret_api_key': self.pinata_secret_key
            }
            
            payload = {
                'pinataContent': data,
                'pinataMetadata': {
                    'name': name
                },
                'pinataOptions': {
                    'cidVersion': 1
                }
            }
            
            response = requests.post(
                f"{self.pinata_base_url}/pinning/pinJSONToIPFS",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                ipfs_hash = result['IpfsHash']
                logger.info(f"JSON uploaded to IPFS: {ipfs_hash}")
                return ipfs_hash
            else:
                logger.error(f"JSON upload failed: {response.text}")
                raise Exception(f"Upload failed: {response.text}")
                
        except Exception as e:
            logger.error(f"Error uploading JSON to IPFS: {str(e)}")
            raise
    
    def download_file(self, ipfs_hash: str) -> bytes:
        """Download file from IPFS"""
        try:
            url = f"{self.gateway_url}/{ipfs_hash}"
            response = requests.get(url)
            response.raise_for_status()
            
            return response.content
            
        except Exception as e:
            logger.error(f"Error downloading from IPFS: {str(e)}")
            raise
    
    def get_file_info(self, ipfs_hash: str) -> Dict[str, Any]:
        """Get file information from IPFS"""
        try:
            url = f"{self.pinata_base_url}/data/pinList"
            headers = {
                'pinata_api_key': self.pinata_api_key,
                'pinata_secret_api_key': self.pinata_secret_key
            }
            
            params = {'hashContains': ipfs_hash}
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            result = response.json()
            if result['rows']:
                return result['rows'][0]
            else:
                return {}
                
        except Exception as e:
            logger.error(f"Error getting file info: {str(e)}")
            return {}
    
    def pin_file(self, ipfs_hash: str) -> bool:
        """Pin existing file on IPFS"""
        try:
            headers = {
                'Content-Type': 'application/json',
                'pinata_api_key': self.pinata_api_key,
                'pinata_secret_api_key': self.pinata_secret_key
            }
            
            payload = {
                'hashToPin': ipfs_hash,
                'pinataMetadata': {
                    'name': f"pinned-{ipfs_hash}"
                }
            }
            
            response = requests.post(
                f"{self.pinata_base_url}/pinning/pinByHash",
                json=payload,
                headers=headers
            )
            
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Error pinning file: {str(e)}")
            return False
    
    def unpin_file(self, ipfs_hash: str) -> bool:
        """Unpin file from IPFS"""
        try:
            headers = {
                'pinata_api_key': self.pinata_api_key,
                'pinata_secret_api_key': self.pinata_secret_key
            }
            
            response = requests.delete(
                f"{self.pinata_base_url}/pinning/unpin/{ipfs_hash}",
                headers=headers
            )
            
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Error unpinning file: {str(e)}")
            return False
    
    def get_pinned_files(self) -> list:
        """Get list of pinned files"""
        try:
            headers = {
                'pinata_api_key': self.pinata_api_key,
                'pinata_secret_api_key': self.pinata_secret_key
            }
            
            response = requests.get(
                f"{self.pinata_base_url}/data/pinList",
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('rows', [])
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error getting pinned files: {str(e)}")
            return []
    
    def calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA256 hash of file for verification"""
        try:
            sha256_hash = hashlib.sha256()
            with open(file_path, "rb") as f:
                for byte_block in iter(lambda: f.read(4096), b""):
                    sha256_hash.update(byte_block)
            return sha256_hash.hexdigest()
        except Exception as e:
            logger.error(f"Error calculating file hash: {str(e)}")
            return ""
    
    def verify_file_integrity(self, file_path: str, expected_hash: str) -> bool:
        """Verify file integrity using hash"""
        try:
            actual_hash = self.calculate_file_hash(file_path)
            return actual_hash == expected_hash
        except Exception as e:
            logger.error(f"Error verifying file integrity: {str(e)}")
            return False
