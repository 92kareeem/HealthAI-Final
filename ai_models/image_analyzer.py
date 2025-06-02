import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input
import os
import logging
from typing import Dict, Any
from PIL import Image
import joblib

logger = logging.getLogger(__name__)

class ImageAnalyzer:
    def __init__(self):
        self.models = {}
        self._load_models()
    
    def _load_models(self):
        """Load pre-trained image analysis models"""
        try:
            model_path = 'models/image_models'
            
            # Load different models for different types of analysis
            model_files = {
                'eye_anemia': 'eye_anemia_model.h5',
                'pneumonia': 'pneumonia_model.h5',
                'skin_cancer': 'skin_cancer_model.h5',
                'heart_disease': 'heart_disease_model.h5'
            }
            
            for model_name, filename in model_files.items():
                model_file_path = os.path.join(model_path, filename)
                if os.path.exists(model_file_path):
                    try:
                        self.models[model_name] = load_model(model_file_path)
                        logger.info(f"Loaded {model_name} model successfully")
                    except Exception as e:
                        logger.warning(f"Could not load {model_name} model: {str(e)}")
                        # Use placeholder model for demonstration
                        self.models[model_name] = self._create_placeholder_model()
                else:
                    logger.warning(f"Model file not found: {model_file_path}")
                    # Use placeholder model for demonstration
                    self.models[model_name] = self._create_placeholder_model()
                    
        except Exception as e:
            logger.error(f"Error loading image models: {str(e)}")
            # Create placeholder models for demonstration
            for model_name in ['eye_anemia', 'pneumonia', 'skin_cancer', 'heart_disease']:
                self.models[model_name] = self._create_placeholder_model()
    
    def _create_placeholder_model(self):
        """Create a placeholder model for demonstration"""
        # This is a simplified placeholder
        # In production, use actual trained models
        return {
            'type': 'placeholder',
            'predict': lambda x: np.random.rand(1, 2)  # Random prediction
        }
    
    def _preprocess_image(self, image_path: str, target_size: tuple = (224, 224)) -> np.ndarray:
        """Preprocess image for model input"""
        try:
            # Load and resize image
            img = Image.open(image_path)
            img = img.convert('RGB')
            img = img.resize(target_size)
            
            # Convert to array and preprocess
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = preprocess_input(img_array)
            
            return img_array
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            raise
    
    def detect_eye_anemia(self, image_path: str) -> Dict[str, Any]:
        """Detect anemia from eye/nail images"""
        try:
            # Preprocess image
            processed_image = self._preprocess_image(image_path)
            
            # Get model prediction
            model = self.models.get('eye_anemia')
            if model and model.get('type') != 'placeholder':
                prediction = model.predict(processed_image)
            else:
                # Placeholder prediction for demonstration
                prediction = np.random.rand(1, 2)
            
            # Interpret results
            confidence = float(np.max(prediction))
            is_anemic = prediction[0][1] > 0.5  # Assuming binary classification
            
            # Additional analysis using color analysis
            color_analysis = self._analyze_eye_color(image_path)
            
            result = {
                'condition': 'Anemia detected' if is_anemic else 'No anemia detected',
                'confidence': round(confidence * 100, 1),
                'severity': self._determine_anemia_severity(confidence, color_analysis),
                'recommendations': self._get_anemia_recommendations(is_anemic),
                'color_analysis': color_analysis,
                'next_steps': ['Confirm with blood test', 'Consult with hematologist'] if is_anemic else ['Regular monitoring'],
                'urgency': 'medium' if is_anemic else 'low'
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in eye anemia detection: {str(e)}")
            return {
                'condition': 'Analysis error',
                'confidence': 0,
                'error': str(e),
                'recommendations': ['Please try again with a clearer image']
            }
    
    def _analyze_eye_color(self, image_path: str) -> Dict[str, Any]:
        """Analyze eye color for anemia indicators"""
        try:
            # Load image
            img = cv2.imread(image_path)
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            # Convert to HSV for better color analysis
            img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            
            # Analyze color distribution
            # Focus on red channel which is reduced in anemia
            red_channel = img_rgb[:, :, 0]
            avg_red = np.mean(red_channel)
            
            # Analyze saturation
            saturation = img_hsv[:, :, 1]
            avg_saturation = np.mean(saturation)
            
            # Simple heuristic for anemia detection
            # Lower red values and saturation may indicate anemia
            red_threshold = 120  # Threshold for red channel
            saturation_threshold = 100  # Threshold for saturation
            
            return {
                'average_red_value': float(avg_red),
                'average_saturation': float(avg_saturation),
                'red_below_threshold': avg_red < red_threshold,
                'saturation_below_threshold': avg_saturation < saturation_threshold,
                'color_score': float((avg_red + avg_saturation) / 2)
            }
            
        except Exception as e:
            logger.error(f"Error in color analysis: {str(e)}")
            return {'error': str(e)}
    
    def _determine_anemia_severity(self, confidence: float, color_analysis: Dict) -> str:
        """Determine anemia severity based on analysis"""
        if confidence > 0.8 and color_analysis.get('red_below_threshold', False):
            return 'severe'
        elif confidence > 0.6:
            return 'moderate'
        elif confidence > 0.4:
            return 'mild'
        else:
            return 'none'
    
    def _get_anemia_recommendations(self, is_anemic: bool) -> list:
        """Get recommendations based on anemia detection"""
        if is_anemic:
            return [
                'Increase iron-rich foods in diet',
                'Consider iron supplements (consult doctor first)',
                'Get complete blood count (CBC) test',
                'Avoid tea/coffee with meals',
                'Include vitamin C rich foods'
            ]
        else:
            return [
                'Maintain balanced diet',
                'Regular health checkups',
                'Monitor for symptoms like fatigue'
            ]
    
    def detect_pneumonia(self, image_path: str) -> Dict[str, Any]:
        """Detect pneumonia from chest X-ray images"""
        try:
            # Preprocess image
            processed_image = self._preprocess_image(image_path)
            
            # Get model prediction
            model = self.models.get('pneumonia')
            if model and model.get('type') != 'placeholder':
                prediction = model.predict(processed_image)
            else:
                # Placeholder prediction
                prediction = np.random.rand(1, 2)
            
            confidence = float(np.max(prediction))
            has_pneumonia = prediction[0][1] > 0.5
            
            # Additional image analysis
            lung_analysis = self._analyze_lung_regions(image_path)
            
            result = {
                'condition': 'Pneumonia detected' if has_pneumonia else 'Normal chest X-ray',
                'confidence': round(confidence * 100, 1),
                'affected_regions': lung_analysis.get('affected_regions', []),
                'severity': 'high' if has_pneumonia and confidence > 0.8 else 'medium' if has_pneumonia else 'low',
                'recommendations': [
                    'Immediate medical attention required',
                    'Antibiotic treatment may be needed',
                    'Rest and hydration',
                    'Follow-up chest X-ray'
                ] if has_pneumonia else ['Regular monitoring', 'Maintain good respiratory hygiene'],
                'urgency': 'high' if has_pneumonia else 'low',
                'next_steps': ['Emergency consultation', 'Blood tests'] if has_pneumonia else ['Routine follow-up']
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in pneumonia detection: {str(e)}")
            return {
                'condition': 'Analysis error',
                'confidence': 0,
                'error': str(e),
                'recommendations': ['Please consult radiologist for proper diagnosis']
            }
    
    def _analyze_lung_regions(self, image_path: str) -> Dict[str, Any]:
        """Analyze lung regions in chest X-ray"""
        try:
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            
            # Simple region analysis
            height, width = img.shape
            
            # Divide into regions
            left_lung = img[:, :width//2]
            right_lung = img[:, width//2:]
            upper_region = img[:height//2, :]
            lower_region = img[height//2:, :]
            
            # Analyze density variations (simplified)
            left_density = np.mean(left_lung)
            right_density = np.mean(right_lung)
            upper_density = np.mean(upper_region)
            lower_density = np.mean(lower_region)
            
            affected_regions = []
            density_threshold = 100  # Simplified threshold
            
            if left_density < density_threshold:
                affected_regions.append('left_lung')
            if right_density < density_threshold:
                affected_regions.append('right_lung')
            if upper_density < density_threshold:
                affected_regions.append('upper_lobe')
            if lower_density < density_threshold:
                affected_regions.append('lower_lobe')
            
            return {
                'affected_regions': affected_regions,
                'left_lung_density': float(left_density),
                'right_lung_density': float(right_density),
                'density_analysis': 'abnormal' if affected_regions else 'normal'
            }
            
        except Exception as e:
            logger.error(f"Error in lung region analysis: {str(e)}")
            return {'error': str(e)}
    
    def detect_skin_cancer(self, image_path: str) -> Dict[str, Any]:
        """Detect skin cancer from skin lesion images"""
        try:
            # Preprocess image
            processed_image = self._preprocess_image(image_path)
            
            # Get model prediction
            model = self.models.get('skin_cancer')
            if model and model.get('type') != 'placeholder':
                prediction = model.predict(processed_image)
            else:
                # Placeholder prediction with multiple classes
                prediction = np.random.rand(1, 4)  # 4 classes: benign, melanoma, basal cell, squamous cell
            
            # Interpret results
            class_names = ['benign', 'melanoma', 'basal_cell_carcinoma', 'squamous_cell_carcinoma']
            predicted_class = np.argmax(prediction[0])
            confidence = float(prediction[0][predicted_class])
            
            # ABCDE analysis
            abcde_analysis = self._analyze_abcde_criteria(image_path)
            
            result = {
                'condition': class_names[predicted_class],
                'confidence': round(confidence * 100, 1),
                'cancer_risk': 'high' if predicted_class > 0 and confidence > 0.7 else 'low',
                'abcde_analysis': abcde_analysis,
                'recommendations': self._get_skin_cancer_recommendations(predicted_class, confidence),
                'urgency': 'high' if predicted_class > 0 else 'low',
                'next_steps': ['Immediate dermatologist consultation', 'Biopsy may be required'] if predicted_class > 0 else ['Regular skin monitoring']
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in skin cancer detection: {str(e)}")
            return {
                'condition': 'Analysis error',
                'confidence': 0,
                'error': str(e),
                'recommendations': ['Please consult dermatologist for proper evaluation']
            }
    
    def _analyze_abcde_criteria(self, image_path: str) -> Dict[str, Any]:
        """Analyze ABCDE criteria for melanoma detection"""
        try:
            img = cv2.imread(image_path)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # A - Asymmetry
            height, width = gray.shape
            left_half = gray[:, :width//2]
            right_half = cv2.flip(gray[:, width//2:], 1)
            
            # Resize to match if needed
            min_width = min(left_half.shape[1], right_half.shape[1])
            left_half = left_half[:, :min_width]
            right_half = right_half[:, :min_width]
            
            asymmetry_score = np.mean(np.abs(left_half.astype(float) - right_half.astype(float)))
            
            # B - Border irregularity (simplified)
            edges = cv2.Canny(gray, 50, 150)
            border_irregularity = np.sum(edges) / (height * width)
            
            # C - Color variation
            img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            color_std = np.std(img_hsv[:, :, 0])  # Hue variation
            
            # D - Diameter (approximate)
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            if contours:
                largest_contour = max(contours, key=cv2.contourArea)
                area = cv2.contourArea(largest_contour)
                diameter = 2 * np.sqrt(area / np.pi)
            else:
                diameter = 0
            
            return {
                'asymmetry_score': float(asymmetry_score),
                'border_irregularity': float(border_irregularity),
                'color_variation': float(color_std),
                'estimated_diameter_pixels': float(diameter),
                'risk_factors': {
                    'asymmetric': asymmetry_score > 20,
                    'irregular_border': border_irregularity > 0.1,
                    'color_varied': color_std > 30,
                    'large_diameter': diameter > 100
                }
            }
            
        except Exception as e:
            logger.error(f"Error in ABCDE analysis: {str(e)}")
            return {'error': str(e)}
    
    def _get_skin_cancer_recommendations(self, predicted_class: int, confidence: float) -> list:
        """Get recommendations based on skin cancer prediction"""
        if predicted_class > 0 and confidence > 0.7:
            return [
                'Seek immediate dermatologist consultation',
                'Avoid sun exposure',
                'Do not attempt self-treatment',
                'Biopsy may be required for definitive diagnosis',
                'Monitor for changes in size, color, or shape'
            ]
        elif predicted_class > 0:
            return [
                'Schedule dermatologist appointment',
                'Monitor the lesion closely',
                'Protect from sun exposure',
                'Take photos to track changes'
            ]
        else:
            return [
                'Continue regular skin self-examinations',
                'Use sunscreen regularly',
                'Annual dermatologist check-up recommended',
                'Monitor for any new or changing lesions'
            ]
    
    def detect_heart_disease(self, image_path: str) -> Dict[str, Any]:
        """Detect heart disease from ECG or cardiac imaging"""
        try:
            # Preprocess image
            processed_image = self._preprocess_image(image_path)
            
            # Get model prediction
            model = self.models.get('heart_disease')
            if model and model.get('type') != 'placeholder':
                prediction = model.predict(processed_image)
            else:
                # Placeholder prediction
                prediction = np.random.rand(1, 3)  # Normal, Arrhythmia, Ischemia
            
            conditions = ['normal', 'arrhythmia', 'ischemia']
            predicted_condition = np.argmax(prediction[0])
            confidence = float(prediction[0][predicted_condition])
            
            # Additional ECG analysis if applicable
            ecg_analysis = self._analyze_ecg_patterns(image_path)
            
            result = {
                'condition': conditions[predicted_condition],
                'confidence': round(confidence * 100, 1),
                'cardiac_risk': 'high' if predicted_condition > 0 and confidence > 0.7 else 'low',
                'ecg_analysis': ecg_analysis,
                'recommendations': self._get_heart_disease_recommendations(predicted_condition),
                'urgency': 'high' if predicted_condition > 0 and confidence > 0.8 else 'medium' if predicted_condition > 0 else 'low',
                'next_steps': ['Cardiology consultation', 'Additional cardiac tests'] if predicted_condition > 0 else ['Regular monitoring']
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in heart disease detection: {str(e)}")
            return {
                'condition': 'Analysis error',
                'confidence': 0,
                'error': str(e),
                'recommendations': ['Please consult cardiologist for proper evaluation']
            }
    
    def _analyze_ecg_patterns(self, image_path: str) -> Dict[str, Any]:
        """Analyze ECG patterns (simplified)"""
        try:
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            
            # Simple pattern analysis
            # In a real implementation, this would involve sophisticated signal processing
            
            # Detect peaks (simplified)
            height, width = img.shape
            
            # Analyze horizontal lines (ECG traces)
            horizontal_profile = np.mean(img, axis=1)
            peaks = []
            
            # Simple peak detection
            for i in range(1, len(horizontal_profile) - 1):
                if (horizontal_profile[i] > horizontal_profile[i-1] and 
                    horizontal_profile[i] > horizontal_profile[i+1]):
                    peaks.append(i)
            
            # Calculate approximate heart rate
            if len(peaks) > 1:
                avg_peak_distance = np.mean(np.diff(peaks))
                # This is a very simplified calculation
                estimated_hr = 60 / (avg_peak_distance * 0.04)  # Assuming 25mm/s paper speed
            else:
                estimated_hr = 0
            
            return {
                'detected_peaks': len(peaks),
                'estimated_heart_rate': float(estimated_hr),
                'rhythm_regularity': 'regular' if len(peaks) > 2 and np.std(np.diff(peaks)) < 5 else 'irregular',
                'signal_quality': 'good' if len(peaks) > 5 else 'poor'
            }
            
        except Exception as e:
            logger.error(f"Error in ECG analysis: {str(e)}")
            return {'error': str(e)}
    
    def _get_heart_disease_recommendations(self, predicted_condition: int) -> list:
        """Get recommendations based on heart condition prediction"""
        if predicted_condition == 1:  # Arrhythmia
            return [
                'Immediate cardiology consultation',
                'Continuous cardiac monitoring may be needed',
                'Avoid stimulants (caffeine, nicotine)',
                'Monitor symptoms like palpitations or dizziness',
                'Medication adjustment may be required'
            ]
        elif predicted_condition == 2:  # Ischemia
            return [
                'Emergency cardiac evaluation required',
                'Avoid physical exertion',
                'Take prescribed cardiac medications',
                'Monitor for chest pain or shortness of breath',
                'Cardiac catheterization may be needed'
            ]
        else:  # Normal
            return [
                'Continue heart-healthy lifestyle',
                'Regular exercise as tolerated',
                'Maintain healthy diet',
                'Regular cardiac check-ups',
                'Monitor blood pressure and cholesterol'
            ]
    
    def general_analysis(self, image_path: str) -> Dict[str, Any]:
        """General medical image analysis"""
        try:
            # Basic image analysis
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError("Could not load image")
            
            # Image quality assessment
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Calculate image quality metrics
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            brightness = np.mean(gray)
            contrast = np.std(gray)
            
            # Determine image type based on characteristics
            image_type = self._classify_image_type(img)
            
            result = {
                'image_type': image_type,
                'quality_metrics': {
                    'sharpness': float(laplacian_var),
                    'brightness': float(brightness),
                    'contrast': float(contrast),
                    'quality_score': self._calculate_quality_score(laplacian_var, brightness, contrast)
                },
                'recommendations': [
                    'Image quality is acceptable for analysis' if laplacian_var > 100 else 'Consider retaking image with better focus',
                    'Consult appropriate specialist based on image type',
                    'Ensure proper lighting and positioning for future images'
                ],
                'suggested_analysis': self._suggest_specific_analysis(image_type)
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in general analysis: {str(e)}")
            return {
                'image_type': 'unknown',
                'error': str(e),
                'recommendations': ['Please ensure image is clear and properly formatted']
            }
    
    def _classify_image_type(self, img: np.ndarray) -> str:
        """Classify the type of medical image"""
        # This is a simplified classification
        # In practice, you'd use more sophisticated methods
        
        height, width = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Analyze image characteristics
        avg_brightness = np.mean(gray)
        
        # Simple heuristics for classification
        if avg_brightness < 50:  # Very dark images
            return 'x_ray'
        elif width > height * 1.5:  # Wide images
            return 'ecg'
        elif avg_brightness > 150:  # Bright images
            return 'skin_lesion'
        else:
            return 'general_medical'
    
    def _calculate_quality_score(self, sharpness: float, brightness: float, contrast: float) -> float:
        """Calculate overall image quality score"""
        # Normalize metrics and combine
        sharpness_score = min(sharpness / 500, 1.0)  # Normalize sharpness
        brightness_score = 1.0 - abs(brightness - 128) / 128  # Optimal brightness around 128
        contrast_score = min(contrast / 64, 1.0)  # Normalize contrast
        
        # Weighted average
        quality_score = (sharpness_score * 0.4 + brightness_score * 0.3 + contrast_score * 0.3)
        return round(quality_score * 100, 1)
    
    def _suggest_specific_analysis(self, image_type: str) -> str:
        """Suggest specific analysis based on image type"""
        suggestions = {
            'x_ray': 'Use pneumonia detection for chest X-rays',
            'ecg': 'Use heart disease detection for ECG analysis',
            'skin_lesion': 'Use skin cancer detection for skin lesions',
            'eye_image': 'Use eye anemia detection for eye/nail images',
            'general_medical': 'Upload to appropriate specific analysis tool'
        }
        
        return suggestions.get(image_type, 'Consult with medical professional for proper analysis')
