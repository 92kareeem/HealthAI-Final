import pytesseract
from PIL import Image
import cv2
import numpy as np
import re
import logging
from typing import Dict, List, Any
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class OCRProcessor:
    def __init__(self):
        # Configure Tesseract path if needed
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        
        self.medical_keywords = self._load_medical_keywords()
        self.lab_value_patterns = self._load_lab_patterns()
    
    def _load_medical_keywords(self) -> Dict[str, List[str]]:
        """Load medical keywords for different categories"""
        return {
            'lab_tests': [
                'hemoglobin', 'hematocrit', 'white blood cell', 'wbc', 'rbc', 'platelet',
                'glucose', 'cholesterol', 'triglycerides', 'creatinine', 'bun',
                'alt', 'ast', 'bilirubin', 'albumin', 'protein', 'sodium', 'potassium',
                'chloride', 'co2', 'calcium', 'phosphorus', 'magnesium', 'iron',
                'ferritin', 'b12', 'folate', 'vitamin d', 'tsh', 't3', 't4'
            ],
            'medications': [
                'mg', 'ml', 'tablet', 'capsule', 'injection', 'syrup', 'cream',
                'ointment', 'drops', 'inhaler', 'patch', 'suppository',
                'once daily', 'twice daily', 'three times', 'as needed', 'prn'
            ],
            'vital_signs': [
                'blood pressure', 'bp', 'heart rate', 'hr', 'pulse', 'temperature',
                'temp', 'respiratory rate', 'rr', 'oxygen saturation', 'spo2',
                'weight', 'height', 'bmi'
            ],
            'symptoms': [
                'pain', 'fever', 'cough', 'shortness of breath', 'fatigue',
                'nausea', 'vomiting', 'diarrhea', 'constipation', 'headache',
                'dizziness', 'chest pain', 'abdominal pain', 'back pain'
            ]
        }
    
    def _load_lab_patterns(self) -> Dict[str, Dict]:
        """Load patterns for extracting lab values"""
        return {
            'hemoglobin': {
                'pattern': r'(?:hemoglobin|hgb|hb)[\s:]*(\d+\.?\d*)\s*(?:g/dl|g/l)?',
                'normal_range': {'male': (13.8, 17.2), 'female': (12.1, 15.1)},
                'unit': 'g/dL'
            },
            'glucose': {
                'pattern': r'(?:glucose|blood sugar)[\s:]*(\d+\.?\d*)\s*(?:mg/dl|mmol/l)?',
                'normal_range': {'fasting': (70, 100), 'random': (70, 140)},
                'unit': 'mg/dL'
            },
            'cholesterol': {
                'pattern': r'(?:total cholesterol|cholesterol)[\s:]*(\d+\.?\d*)\s*(?:mg/dl)?',
                'normal_range': {'total': (0, 200)},
                'unit': 'mg/dL'
            },
            'creatinine': {
                'pattern': r'(?:creatinine|creat)[\s:]*(\d+\.?\d*)\s*(?:mg/dl)?',
                'normal_range': {'male': (0.7, 1.3), 'female': (0.6, 1.1)},
                'unit': 'mg/dL'
            },
            'white_blood_cell': {
                'pattern': r'(?:wbc|white blood cell)[\s:]*(\d+\.?\d*)\s*(?:k/ul|x10\^3)?',
                'normal_range': {'general': (4.5, 11.0)},
                'unit': 'K/uL'
            }
        }
    
    def extract_text(self, image_path: str) -> str:
        """Extract text from medical document image"""
        try:
            # Load and preprocess image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not load image")
            
            # Preprocess image for better OCR
            processed_image = self._preprocess_for_ocr(image)
            
            # Extract text using Tesseract
            text = pytesseract.image_to_string(processed_image, config='--psm 6')
            
            # Clean extracted text
            cleaned_text = self._clean_extracted_text(text)
            
            logger.info(f"Successfully extracted text from {image_path}")
            return cleaned_text
            
        except Exception as e:
            logger.error(f"Error extracting text: {str(e)}")
            raise
    
    def _preprocess_for_ocr(self, image: np.ndarray) -> np.ndarray:
        """Preprocess image for better OCR results"""
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply Gaussian blur to reduce noise
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            
            # Apply adaptive thresholding
            thresh = cv2.adaptiveThreshold(
                blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
            )
            
            # Morphological operations to clean up
            kernel = np.ones((1, 1), np.uint8)
            cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
            
            # Resize image for better OCR (if too small)
            height, width = cleaned.shape
            if height < 300 or width < 300:
                scale_factor = max(300 / height, 300 / width)
                new_width = int(width * scale_factor)
                new_height = int(height * scale_factor)
                cleaned = cv2.resize(cleaned, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
            
            return cleaned
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            return image
    
    def _clean_extracted_text(self, text: str) -> str:
        """Clean and normalize extracted text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters that might interfere
        text = re.sub(r'[^\w\s\.\,\:\;$$$$\-\/\%]', '', text)
        
        # Normalize common OCR errors
        text = text.replace('|', 'I')
        text = text.replace('0', 'O', 1) if text.startswith('0') else text
        
        return text.strip()
    
    def analyze_medical_report(self, extracted_text: str) -> Dict[str, Any]:
        """Analyze extracted medical report text"""
        try:
            analysis = {
                'report_type': self._identify_report_type(extracted_text),
                'extracted_values': self._extract_lab_values(extracted_text),
                'medications': self._extract_medications(extracted_text),
                'vital_signs': self._extract_vital_signs(extracted_text),
                'symptoms': self._extract_symptoms(extracted_text),
                'recommendations': [],
                'abnormal_findings': [],
                'summary': ''
            }
            
            # Analyze extracted values
            analysis['abnormal_findings'] = self._identify_abnormal_values(analysis['extracted_values'])
            analysis['recommendations'] = self._generate_recommendations(analysis)
            analysis['summary'] = self._generate_summary(analysis)
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing medical report: {str(e)}")
            return {
                'error': str(e),
                'recommendations': ['Please consult with healthcare professional for manual review']
            }
    
    def _identify_report_type(self, text: str) -> str:
        """Identify the type of medical report"""
        text_lower = text.lower()
        
        if any(keyword in text_lower for keyword in ['lab', 'laboratory', 'blood test', 'chemistry']):
            return 'laboratory_report'
        elif any(keyword in text_lower for keyword in ['x-ray', 'ct scan', 'mri', 'ultrasound', 'imaging']):
            return 'imaging_report'
        elif any(keyword in text_lower for keyword in ['prescription', 'medication', 'pharmacy']):
            return 'prescription'
        elif any(keyword in text_lower for keyword in ['discharge', 'summary', 'hospital']):
            return 'discharge_summary'
        elif any(keyword in text_lower for keyword in ['consultation', 'visit', 'examination']):
            return 'consultation_note'
        else:
            return 'general_medical_document'
    
    def _extract_lab_values(self, text: str) -> Dict[str, Any]:
        """Extract laboratory values from text"""
        extracted_values = {}
        text_lower = text.lower()
        
        for lab_name, lab_info in self.lab_value_patterns.items():
            pattern = lab_info['pattern']
            matches = re.finditer(pattern, text_lower, re.IGNORECASE)
            
            for match in matches:
                try:
                    value = float(match.group(1))
                    extracted_values[lab_name] = {
                        'value': value,
                        'unit': lab_info['unit'],
                        'normal_range': lab_info['normal_range'],
                        'status': self._evaluate_lab_value(value, lab_info['normal_range'])
                    }
                except ValueError:
                    continue
        
        return extracted_values
    
    def _evaluate_lab_value(self, value: float, normal_ranges: Dict) -> str:
        """Evaluate if lab value is normal, high, or low"""
        # Use general range if available, otherwise use first available range
        if 'general' in normal_ranges:
            min_val, max_val = normal_ranges['general']
        else:
            # Use first available range
            min_val, max_val = list(normal_ranges.values())[0]
        
        if value < min_val:
            return 'low'
        elif value > max_val:
            return 'high'
        else:
            return 'normal'
    
    def _extract_medications(self, text: str) -> List[Dict[str, Any]]:
        """Extract medication information from text"""
        medications = []
        text_lower = text.lower()
        
        # Pattern for medication extraction
        med_pattern = r'(\w+(?:\s+\w+)*)\s+(\d+\.?\d*)\s*(mg|ml|g|mcg|units?)\s*(?:(\d+)\s*(?:times?|x)\s*(?:daily|day|per day)?)?'
        
        matches = re.finditer(med_pattern, text_lower)
        
        for match in matches:
            medication = {
                'name': match.group(1).title(),
                'dosage': float(match.group(2)),
                'unit': match.group(3),
                'frequency': match.group(4) if match.group(4) else 'as directed'
            }
            medications.append(medication)
        
        return medications
    
    def _extract_vital_signs(self, text: str) -> Dict[str, Any]:
        """Extract vital signs from text"""
        vital_signs = {}
        text_lower = text.lower()
        
        # Blood pressure pattern
        bp_pattern = r'(?:blood pressure|bp)[\s:]*(\d+)\/(\d+)'
        bp_match = re.search(bp_pattern, text_lower)
        if bp_match:
            vital_signs['blood_pressure'] = {
                'systolic': int(bp_match.group(1)),
                'diastolic': int(bp_match.group(2)),
                'status': self._evaluate_blood_pressure(int(bp_match.group(1)), int(bp_match.group(2)))
            }
        
        # Heart rate pattern
        hr_pattern = r'(?:heart rate|hr|pulse)[\s:]*(\d+)'
        hr_match = re.search(hr_pattern, text_lower)
        if hr_match:
            hr_value = int(hr_match.group(1))
            vital_signs['heart_rate'] = {
                'value': hr_value,
                'status': 'normal' if 60 <= hr_value <= 100 else 'abnormal'
            }
        
        # Temperature pattern
        temp_pattern = r'(?:temperature|temp)[\s:]*(\d+\.?\d*)'
        temp_match = re.search(temp_pattern, text_lower)
        if temp_match:
            temp_value = float(temp_match.group(1))
            vital_signs['temperature'] = {
                'value': temp_value,
                'status': 'normal' if 97.0 <= temp_value <= 99.5 else 'abnormal'
            }
        
        return vital_signs
    
    def _evaluate_blood_pressure(self, systolic: int, diastolic: int) -> str:
        """Evaluate blood pressure status"""
        if systolic < 120 and diastolic < 80:
            return 'normal'
        elif systolic < 130 and diastolic < 80:
            return 'elevated'
        elif systolic < 140 or diastolic < 90:
            return 'stage_1_hypertension'
        elif systolic >= 140 or diastolic >= 90:
            return 'stage_2_hypertension'
        else:
            return 'hypertensive_crisis'
    
    def _extract_symptoms(self, text: str) -> List[str]:
        """Extract symptoms mentioned in the text"""
        symptoms = []
        text_lower = text.lower()
        
        for symptom in self.medical_keywords['symptoms']:
            if symptom in text_lower:
                symptoms.append(symptom)
        
        return symptoms
    
    def _identify_abnormal_values(self, lab_values: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify abnormal lab values"""
        abnormal_findings = []
        
        for lab_name, lab_data in lab_values.items():
            if lab_data['status'] != 'normal':
                abnormal_findings.append({
                    'test': lab_name,
                    'value': lab_data['value'],
                    'unit': lab_data['unit'],
                    'status': lab_data['status'],
                    'severity': self._determine_severity(lab_name, lab_data['value'], lab_data['status'])
                })
        
        return abnormal_findings
    
    def _determine_severity(self, lab_name: str, value: float, status: str) -> str:
        """Determine severity of abnormal lab value"""
        # Simplified severity assessment
        severity_thresholds = {
            'hemoglobin': {'low': 8.0, 'high': 20.0},
            'glucose': {'low': 50.0, 'high': 300.0},
            'creatinine': {'low': 0.3, 'high': 3.0}
        }
        
        if lab_name in severity_thresholds:
            thresholds = severity_thresholds[lab_name]
            if status == 'low' and value < thresholds['low']:
                return 'severe'
            elif status == 'high' and value > thresholds['high']:
                return 'severe'
            else:
                return 'moderate'
        
        return 'mild'
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        # Recommendations based on abnormal findings
        for finding in analysis['abnormal_findings']:
            if finding['severity'] == 'severe':
                recommendations.append(f"Immediate medical attention needed for {finding['test']}")
            elif finding['severity'] == 'moderate':
                recommendations.append(f"Follow up with doctor regarding {finding['test']}")
        
        # Recommendations based on report type
        report_type = analysis['report_type']
        if report_type == 'laboratory_report':
            recommendations.append("Discuss results with your healthcare provider")
            recommendations.append("Follow prescribed treatment plan")
        elif report_type == 'prescription':
            recommendations.append("Take medications as prescribed")
            recommendations.append("Monitor for side effects")
        
        # General recommendations
        if not recommendations:
            recommendations.append("Continue regular health monitoring")
            recommendations.append("Maintain healthy lifestyle")
        
        return recommendations
    
    def _generate_summary(self, analysis: Dict[str, Any]) -> str:
        """Generate summary of the medical report analysis"""
        summary_parts = []
        
        # Report type
        summary_parts.append(f"Report Type: {analysis['report_type'].replace('_', ' ').title()}")
        
        # Lab values summary
        if analysis['extracted_values']:
            normal_count = sum(1 for v in analysis['extracted_values'].values() if v['status'] == 'normal')
            total_count = len(analysis['extracted_values'])
            summary_parts.append(f"Lab Values: {normal_count}/{total_count} within normal range")
        
        # Abnormal findings
        if analysis['abnormal_findings']:
            severe_count = sum(1 for f in analysis['abnormal_findings'] if f['severity'] == 'severe')
            if severe_count > 0:
                summary_parts.append(f"⚠️ {severe_count} severe abnormal finding(s) requiring immediate attention")
        
        # Medications
        if analysis['medications']:
            summary_parts.append(f"Medications: {len(analysis['medications'])} identified")
        
        return ". ".join(summary_parts) if summary_parts else "Medical document processed successfully"
