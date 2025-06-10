import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import logging 
from typing import Dict, List, Any
import re
from datetime import datetime

logger = logging.getLogger(__name__)

class DiseasePredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        self.symptom_keywords = self._load_symptom_keywords()
        self._load_models()
    
    def _load_symptom_keywords(self) -> Dict[str, List[str]]:
        """Load symptom keywords for different diseases"""
        return {
            'cardiovascular': [
                'chest pain', 'heart pain', 'shortness of breath', 'palpitations',
                'irregular heartbeat', 'fatigue', 'dizziness', 'swelling legs',
                'high blood pressure', 'chest tightness', 'rapid heartbeat'
            ],
            'respiratory': [
                'cough', 'shortness of breath', 'wheezing', 'chest tightness',
                'difficulty breathing', 'sputum', 'fever', 'throat pain',
                'runny nose', 'congestion', 'asthma', 'pneumonia symptoms'
            ],
            'diabetes': [
                'frequent urination', 'excessive thirst', 'unexplained weight loss',
                'fatigue', 'blurred vision', 'slow healing wounds', 'tingling hands',
                'tingling feet', 'increased hunger', 'high blood sugar'
            ],
            'neurological': [
                'headache', 'dizziness', 'confusion', 'memory loss', 'seizures',
                'numbness', 'weakness', 'tremors', 'balance problems',
                'speech difficulties', 'vision problems', 'coordination issues'
            ],
            'gastrointestinal': [
                'nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal pain',
                'bloating', 'heartburn', 'loss of appetite', 'weight loss',
                'blood in stool', 'stomach pain', 'indigestion'
            ],
            'musculoskeletal': [
                'joint pain', 'muscle pain', 'stiffness', 'swelling joints',
                'limited range of motion', 'back pain', 'neck pain',
                'muscle weakness', 'bone pain', 'arthritis symptoms'
            ]
        }
    
    def _load_models(self):
        """Load pre-trained models or create new ones"""
        try:
            # Try to load existing models
            model_path = 'models'
            if os.path.exists(model_path):
                for disease_category in self.symptom_keywords.keys():
                    model_file = os.path.join(model_path, f'{disease_category}_model.joblib')
                    scaler_file = os.path.join(model_path, f'{disease_category}_scaler.joblib')
                    
                    if os.path.exists(model_file) and os.path.exists(scaler_file):
                        self.models[disease_category] = joblib.load(model_file)
                        self.scalers[disease_category] = joblib.load(scaler_file)
            
            # If no models exist, create and train new ones
            if not self.models:
                self._create_and_train_models()
                
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            self._create_and_train_models()
    
    def _create_and_train_models(self):
        """Create and train disease prediction models"""
        try:
            # Generate synthetic training data for demonstration
            # In production, use real medical datasets
            training_data = self._generate_synthetic_data()
            
            for disease_category in self.symptom_keywords.keys():
                # Prepare data for this disease category
                X, y = self._prepare_training_data(training_data, disease_category)
                
                if len(X) > 0:
                    # Split data
                    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
                    
                    # Scale features
                    scaler = StandardScaler()
                    X_train_scaled = scaler.fit_transform(X_train)
                    X_test_scaled = scaler.transform(X_test)
                    
                    # Train model
                    model = GradientBoostingClassifier(n_estimators=100, random_state=42)
                    model.fit(X_train_scaled, y_train)
                    
                    # Evaluate model
                    y_pred = model.predict(X_test_scaled)
                    accuracy = accuracy_score(y_test, y_pred)
                    logger.info(f"{disease_category} model accuracy: {accuracy:.2f}")
                    
                    # Store model and scaler
                    self.models[disease_category] = model
                    self.scalers[disease_category] = scaler
                    
                    # Save models
                    os.makedirs('models', exist_ok=True)
                    joblib.dump(model, f'models/{disease_category}_model.joblib')
                    joblib.dump(scaler, f'models/{disease_category}_scaler.joblib')
                    
        except Exception as e:
            logger.error(f"Error creating models: {str(e)}")
    
    def _generate_synthetic_data(self) -> List[Dict]:
        """Generate synthetic training data for demonstration"""
        # This is simplified synthetic data
        # In production, use real medical datasets
        synthetic_data = []
        
        # Generate samples for each disease category
        for disease, symptoms in self.symptom_keywords.items():
            for i in range(1000):  # 1000 samples per disease
                sample = {
                    'symptoms': ' '.join(np.random.choice(symptoms, size=np.random.randint(2, 5), replace=False)),
                    'age': np.random.randint(18, 80),
                    'gender': np.random.choice(['male', 'female']),
                    'severity': np.random.randint(1, 11),
                    'duration_days': np.random.randint(1, 30),
                    'has_fever': np.random.choice([0, 1]),
                    'has_fatigue': np.random.choice([0, 1]),
                    'disease_category': disease,
                    'risk_level': np.random.choice(['low', 'medium', 'high'])
                }
                synthetic_data.append(sample)
        
        return synthetic_data
    
    def _prepare_training_data(self, data: List[Dict], disease_category: str):
        """Prepare training data for a specific disease category"""
        try:
            # Convert to DataFrame
            df = pd.DataFrame(data)
            
            # Create features
            features = []
            labels = []
            
            for _, row in df.iterrows():
                feature_vector = self._extract_features(row)
                features.append(feature_vector)
                
                # Binary classification: this disease vs others
                label = 1 if row['disease_category'] == disease_category else 0
                labels.append(label)
            
            return np.array(features), np.array(labels)
            
        except Exception as e:
            logger.error(f"Error preparing training data: {str(e)}")
            return np.array([]), np.array([])
    
    def _extract_features(self, data: Dict) -> List[float]:
        """Extract features from input data"""
        features = []
        
        # Basic demographic features
        features.append(float(data.get('age', 0)))
        features.append(1.0 if data.get('gender', '').lower() == 'male' else 0.0)
        
        # Symptom severity and duration
        features.append(float(data.get('severity', 0)))
        features.append(float(data.get('duration_days', 0)))
        
        # Binary symptom features
        features.append(float(data.get('has_fever', 0)))
        features.append(float(data.get('has_fatigue', 0)))
        
        # Symptom keyword matching for each category
        symptoms_text = data.get('symptoms', '').lower()
        for category, keywords in self.symptom_keywords.items():
            keyword_count = sum(1 for keyword in keywords if keyword in symptoms_text)
            features.append(float(keyword_count))
        
        # Vital signs if available
        vital_signs = data.get('vital_signs', {})
        features.append(float(vital_signs.get('heart_rate', 70)))
        features.append(float(vital_signs.get('blood_pressure_systolic', 120)))
        features.append(float(vital_signs.get('blood_pressure_diastolic', 80)))
        features.append(float(vital_signs.get('temperature', 98.6)))
        
        return features
    
    def predict_disease(self, input_data: Dict) -> Dict:
        """Predict disease based on symptoms and patient data"""
        try:
            # Extract features
            features = self._extract_features(input_data)
            feature_vector = np.array(features).reshape(1, -1)
            
            predictions = {}
            confidence_scores = {}
            
            # Get predictions from all models
            for disease_category, model in self.models.items():
                if disease_category in self.scalers:
                    # Scale features
                    scaler = self.scalers[disease_category]
                    scaled_features = scaler.transform(feature_vector)
                    
                    # Get prediction and probability
                    prediction = model.predict(scaled_features)[0]
                    probabilities = model.predict_proba(scaled_features)[0]
                    
                    predictions[disease_category] = prediction
                    confidence_scores[disease_category] = max(probabilities)
            
            # Find the most likely disease category
            if confidence_scores:
                most_likely_disease = max(confidence_scores.items(), key=lambda x: x[1])
                disease_category = most_likely_disease[0]
                confidence = most_likely_disease[1]
                
                # Generate detailed prediction
                result = self._generate_prediction_result(
                    disease_category, confidence, input_data
                )
                
                return result
            else:
                return {
                    'condition': 'Unable to determine',
                    'confidence': 0,
                    'category': 'unknown',
                    'recommendations': ['Please consult with a healthcare professional'],
                    'urgency': 'medium',
                    'next_steps': ['Schedule appointment with doctor']
                }
                
        except Exception as e:
            logger.error(f"Error in disease prediction: {str(e)}")
            return {
                'condition': 'Analysis error',
                'confidence': 0,
                'category': 'error',
                'recommendations': ['Please try again or consult with a healthcare professional'],
                'urgency': 'medium',
                'next_steps': ['Contact support if problem persists']
            }
    
    def _generate_prediction_result(self, disease_category: str, confidence: float, input_data: Dict) -> Dict:
        """Generate detailed prediction result"""
        
        # Disease-specific information
        disease_info = {
            'cardiovascular': {
                'conditions': ['Hypertension', 'Coronary Artery Disease', 'Heart Arrhythmia', 'Heart Failure'],
                'recommendations': [
                    'Monitor blood pressure regularly',
                    'Maintain a heart-healthy diet',
                    'Exercise regularly as recommended by doctor',
                    'Avoid smoking and excessive alcohol'
                ],
                'urgency_keywords': ['chest pain', 'heart attack', 'severe shortness of breath']
            },
            'respiratory': {
                'conditions': ['Asthma', 'Pneumonia', 'Bronchitis', 'COPD'],
                'recommendations': [
                    'Avoid respiratory irritants',
                    'Use prescribed inhalers as directed',
                    'Stay hydrated',
                    'Get adequate rest'
                ],
                'urgency_keywords': ['severe difficulty breathing', 'chest pain', 'high fever']
            },
            'diabetes': {
                'conditions': ['Type 2 Diabetes', 'Pre-diabetes', 'Diabetic Complications'],
                'recommendations': [
                    'Monitor blood sugar levels',
                    'Follow diabetic diet plan',
                    'Take medications as prescribed',
                    'Regular exercise'
                ],
                'urgency_keywords': ['very high blood sugar', 'diabetic ketoacidosis', 'severe dehydration']
            },
            'neurological': {
                'conditions': ['Migraine', 'Tension Headache', 'Neurological Disorder'],
                'recommendations': [
                    'Keep a symptom diary',
                    'Avoid known triggers',
                    'Get adequate sleep',
                    'Manage stress levels'
                ],
                'urgency_keywords': ['severe headache', 'confusion', 'seizure', 'stroke symptoms']
            },
            'gastrointestinal': {
                'conditions': ['Gastritis', 'IBS', 'Food Poisoning', 'Peptic Ulcer'],
                'recommendations': [
                    'Stay hydrated',
                    'Eat bland, easy-to-digest foods',
                    'Avoid spicy and fatty foods',
                    'Rest and avoid stress'
                ],
                'urgency_keywords': ['severe abdominal pain', 'blood in vomit', 'severe dehydration']
            },
            'musculoskeletal': {
                'conditions': ['Arthritis', 'Muscle Strain', 'Joint Inflammation'],
                'recommendations': [
                    'Rest affected area',
                    'Apply ice or heat as appropriate',
                    'Gentle stretching exercises',
                    'Anti-inflammatory medications if recommended'
                ],
                'urgency_keywords': ['severe pain', 'inability to move', 'severe swelling']
            }
        }
        
        info = disease_info.get(disease_category, {})
        
        # Determine most likely specific condition
        conditions = info.get('conditions', ['General condition'])
        most_likely_condition = conditions[0]  # Simplified selection
        
        # Determine urgency
        symptoms_text = input_data.get('symptoms', '').lower()
        urgency_keywords = info.get('urgency_keywords', [])
        severity = input_data.get('severity', 5)
        
        if any(keyword in symptoms_text for keyword in urgency_keywords) or severity >= 8:
            urgency = 'high'
        elif severity >= 6:
            urgency = 'medium'
        else:
            urgency = 'low'
        
        # Generate recommendations
        recommendations = info.get('recommendations', ['Consult with healthcare professional'])
        
        # Add severity-based recommendations
        if urgency == 'high':
            recommendations.insert(0, 'Seek immediate medical attention')
        elif urgency == 'medium':
            recommendations.insert(0, 'Schedule appointment with doctor within 24-48 hours')
        
        # Generate next steps
        next_steps = []
        if urgency == 'high':
            next_steps = ['Call emergency services or go to emergency room', 'Contact your doctor immediately']
        elif urgency == 'medium':
            next_steps = ['Schedule appointment with appropriate specialist', 'Monitor symptoms closely']
        else:
            next_steps = ['Schedule routine appointment', 'Continue monitoring symptoms']
        
        return {
            'condition': most_likely_condition,
            'confidence': round(confidence * 100, 1),
            'category': disease_category,
            'recommendations': recommendations,
            'urgency': urgency,
            'next_steps': next_steps,
            'severity_assessment': severity,
            'follow_up_needed': urgency in ['high', 'medium'],
            'specialist_referral': disease_category if urgency != 'low' else None
        }
    
    def get_model_info(self) -> Dict:
        """Get information about loaded models"""
        return {
            'loaded_models': list(self.models.keys()),
            'model_count': len(self.models),
            'supported_categories': list(self.symptom_keywords.keys())
        }
