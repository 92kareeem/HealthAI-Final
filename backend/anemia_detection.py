from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image, ImageFile
import io
import os
import logging
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.resnet50 import preprocess_input
import cv2
from supabase import create_client, Client
from datetime import datetime
import uuid
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Allow truncated images to load
ImageFile.LOAD_TRUNCATED_IMAGES = True

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class AnemiaDetector:
    def __init__(self):
        self.eye_model = None
        self.nail_model = None
        self.load_models()
    
    def load_models(self):
        """Load and verify both eye and nail models"""
        try:
            # Update these paths to your model locations
            eye_model_path = os.path.join('models', 'eye_model_ResNet.keras')
            nail_model_path = os.path.join('models', 'nail_model_ResNet.keras')
            
            if os.path.exists(eye_model_path):
                self.eye_model = tf.keras.models.load_model(eye_model_path)
                logger.info("✅ Eye model loaded successfully")
            else:
                logger.warning("❌ Eye model not found")
                
            if os.path.exists(nail_model_path):
                self.nail_model = tf.keras.models.load_model(nail_model_path)
                logger.info("✅ Nail model loaded successfully")
            else:
                logger.warning("❌ Nail model not found")
                
        except Exception as e:
            logger.error(f"❌ Error loading models: {str(e)}")
    
    def _detect_conjunctiva(self, image: np.ndarray) -> tuple:
        """Detect conjunctival region in eye image using advanced processing"""
        try:
            lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
            _, A, _ = cv2.split(lab)
            
            # Adaptive thresholding for robustness
            thresh = cv2.adaptiveThreshold(
                A, 255, 
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                cv2.THRESH_BINARY_INV, 11, 2
            )
            
            # Remove top 60% (eyelid region)
            h, w = thresh.shape
            thresh[:int(h * 0.6), :] = 0
            
            # Morphological operations
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
            cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
            cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_OPEN, kernel)
            
            # Find best contour
            contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            best_box = None
            max_area = 0
            for cnt in contours:
                x, y, w, h = cv2.boundingRect(cnt)
                area = w * h
                if area > max_area and w > 30 and h > 15:
                    max_area = area
                    best_box = (x, y, x + w, y + h)
            
            return best_box
        except Exception as e:
            logger.warning(f"Conjunctiva detection failed: {str(e)}")
            return None
    
    def _preprocess_image(self, image: np.ndarray, target_size=(224, 224)) -> np.ndarray:
        """Preprocess image for model prediction"""
        try:
            # Convert to RGB if needed
            if len(image.shape) == 2 or image.shape[2] == 1:
                image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
            elif image.shape[2] == 4:
                image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
            else:
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Resize and preprocess
            image = cv2.resize(image, target_size)
            image = img_to_array(image)
            image = preprocess_input(image)
            return np.expand_dims(image, axis=0)
        except Exception as e:
            logger.error(f"Image preprocessing failed: {str(e)}")
            raise ValueError(f"Image processing error: {str(e)}")
    
    def predict_eye(self, image_bytes: bytes, patient_id: str = None) -> dict:
        """Make anemia prediction from eye image"""
        try:
            if not self.eye_model:
                return {
                    'success': False,
                    'error': 'Eye model not available',
                    'code': 'MODEL_NOT_LOADED'
                }
            
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Try ROI detection first
            box = self._detect_conjunctiva(image)
            if box:
                x1, y1, x2, y2 = box
                roi = image[y1:y2, x1:x2]
                input_img = self._preprocess_image(roi)
                roi_detected = True
            else:
                # Fallback to full image
                input_img = self._preprocess_image(image)
                roi_detected = False
            
            # Make prediction
            preds = self.eye_model.predict(input_img)[0]
            
            # Handle both binary and categorical outputs
            if len(preds) == 1:  # Binary output
                prob = float(preds[0])
                prediction = "Anemia Detected" if prob > 0.5 else "No Anemia"
                confidence = max(prob, 1-prob) * 100
            else:  # Categorical output
                class_idx = np.argmax(preds)
                prediction = ["No Anemia", "Anemia Detected"][class_idx]
                confidence = float(preds[class_idx]) * 100
            
            # Store result in database
            if patient_id:
                self._store_analysis_result(
                    patient_id=patient_id,
                    analysis_type='eye_anemia',
                    prediction=prediction,
                    confidence=confidence,
                    roi_detected=roi_detected
                )
            
            return {
                'success': True,
                'prediction': prediction,
                'confidence': round(confidence, 2),
                'roi_detected': roi_detected,
                'type': 'eye'
            }
            
        except Exception as e:
            logger.error(f"Eye prediction error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'code': 'PREDICTION_ERROR'
            }
    
    def predict_nail(self, image_bytes: bytes, patient_id: str = None) -> dict:
        """Make anemia prediction from nail image"""
        try:
            if not self.nail_model:
                return {
                    'success': False,
                    'error': 'Nail model not available',
                    'code': 'MODEL_NOT_LOADED'
                }
            
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Preprocess full nail image
            input_img = self._preprocess_image(image)
            
            # Make prediction
            preds = self.nail_model.predict(input_img)[0]
            
            # Handle both binary and categorical outputs
            if len(preds) == 1:  # Binary output
                prob = float(preds[0])
                prediction = "Anemia Detected" if prob > 0.5 else "No Anemia"
                confidence = max(prob, 1-prob) * 100
            else:  # Categorical output
                class_idx = np.argmax(preds)
                prediction = ["No Anemia", "Anemia Detected"][class_idx]
                confidence = float(preds[class_idx]) * 100
            
            # Store result in database
            if patient_id:
                self._store_analysis_result(
                    patient_id=patient_id,
                    analysis_type='nail_anemia',
                    prediction=prediction,
                    confidence=confidence
                )
            
            return {
                'success': True,
                'prediction': prediction,
                'confidence': round(confidence, 2),
                'type': 'nail'
            }
            
        except Exception as e:
            logger.error(f"Nail prediction error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'code': 'PREDICTION_ERROR'
            }
    
    def _store_analysis_result(self, patient_id: str, analysis_type: str, prediction: str, confidence: float, roi_detected: bool = None):
        """Store analysis result in Supabase database"""
        try:
            analysis_data = {
                'id': str(uuid.uuid4()),
                'patient_id': patient_id,
                'diagnosis_type': analysis_type,
                'result': {
                    'prediction': prediction,
                    'confidence': confidence,
                    'roi_detected': roi_detected,
                    'analysis_timestamp': datetime.utcnow().isoformat()
                },
                'confidence': confidence,
                'created_at': datetime.utcnow().isoformat()
            }
            
            result = supabase.table('image_diagnoses').insert(analysis_data).execute()
            logger.info(f"Stored analysis result: {result.data}")
            
        except Exception as e:
            logger.error(f"Failed to store analysis result: {str(e)}")

# Initialize detector
detector = AnemiaDetector()

def predict_anemia_eye(image_bytes: bytes, patient_id: str = None) -> dict:
    """Public function for eye anemia prediction"""
    return detector.predict_eye(image_bytes, patient_id)

def predict_anemia_nail(image_bytes: bytes, patient_id: str = None) -> dict:
    """Public function for nail anemia prediction"""
    return detector.predict_nail(image_bytes, patient_id)

def get_anemia_health_status() -> dict:
    """Get health status of anemia detection models"""
    return {
        'eye_model_loaded': detector.eye_model is not None,
        'nail_model_loaded': detector.nail_model is not None,
        'status': 'healthy' if (detector.eye_model and detector.nail_model) else 'partial'
    }
