from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import logging
from werkzeug.utils import secure_filename
import uuid

# Import our modules
from config import Config
from database.supabase_client import SupabaseClient
from ai_models.disease_predictor import DiseasePredictor
from ai_models.image_analyzer import ImageAnalyzer
from ai_models.ocr_processor import OCRProcessor
from services.ipfs_service import IPFSService
from services.emergency_service import EmergencyService
from services.analytics_service import AnalyticsService
from utils.validators import validate_patient_data, validate_medical_record
from utils.encryption import encrypt_sensitive_data, decrypt_sensitive_data
from backend.anemia_detection import predict_anemia_eye, predict_anemia_nail, get_anemia_health_status

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize services
db = SupabaseClient()
disease_predictor = DiseasePredictor()
image_analyzer = ImageAnalyzer()
ocr_processor = OCRProcessor()
ipfs_service = IPFSService()
emergency_service = EmergencyService()
analytics_service = AnalyticsService()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf', 'dcm'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ==================== AUTHENTICATION ROUTES ====================

@app.route('/api/auth/wallet-login', methods=['POST'])
def wallet_login():
    """Authenticate user with crypto wallet"""
    try:
        data = request.get_json()
        wallet_address = data.get('wallet_address')
        signature = data.get('signature')
        
        if not wallet_address or not signature:
            return jsonify({'error': 'Wallet address and signature required'}), 400
        
        # Verify wallet signature (simplified)
        user = db.get_user_by_wallet(wallet_address)
        
        if not user:
            # Create new user
            user_data = {
                'wallet_address': wallet_address,
                'created_at': datetime.utcnow().isoformat(),
                'role': 'patient',  # Default role
                'is_verified': False
            }
            user = db.create_user(user_data)
        
        # Generate session token
        token = str(uuid.uuid4())
        db.create_session(user['id'], token)
        
        return jsonify({
            'success': True,
            'user': user,
            'token': token
        })
        
    except Exception as e:
        logger.error(f"Wallet login error: {str(e)}")
        return jsonify({'error': 'Authentication failed'}), 500

@app.route('/api/auth/register', methods=['POST'])
def register_user():
    """Register new user with additional details"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['wallet_address', 'name', 'email', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        existing_user = db.get_user_by_wallet(data['wallet_address'])
        if existing_user:
            return jsonify({'error': 'User already exists'}), 409
        
        # Encrypt sensitive data
        encrypted_email = encrypt_sensitive_data(data['email'])
        
        user_data = {
            'wallet_address': data['wallet_address'],
            'name': data['name'],
            'email': encrypted_email,
            'role': data['role'],
            'specialization': data.get('specialization'),
            'license_number': data.get('license_number'),
            'hospital': data.get('hospital'),
            'created_at': datetime.utcnow().isoformat(),
            'is_verified': data['role'] == 'patient'  # Patients auto-verified, doctors need verification
        }
        
        user = db.create_user(user_data)
        
        return jsonify({
            'success': True,
            'user': user,
            'message': 'User registered successfully'
        })
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

# ==================== AI DIAGNOSIS ROUTES ====================

@app.route('/api/ai/symptom-analysis', methods=['POST'])
def analyze_symptoms():
    """Analyze symptoms using AI models"""
    try:
        data = request.get_json()
        
        symptoms = data.get('symptoms', '')
        duration = data.get('duration', '')
        severity = data.get('severity', 5)
        medical_history = data.get('medical_history', [])
        vital_signs = data.get('vital_signs', {})
        
        if not symptoms:
            return jsonify({'error': 'Symptoms description required'}), 400
        
        # Prepare input for AI model
        input_data = {
            'symptoms': symptoms,
            'duration': duration,
            'severity': int(severity),
            'medical_history': medical_history,
            'vital_signs': vital_signs
        }
        
        # Get AI prediction
        prediction = disease_predictor.predict_disease(input_data)
        
        # Store analysis in database
        analysis_data = {
            'patient_id': data.get('patient_id'),
            'symptoms': symptoms,
            'prediction': prediction,
            'confidence': prediction['confidence'],
            'created_at': datetime.utcnow().isoformat()
        }
        
        analysis_id = db.create_symptom_analysis(analysis_data)
        
        return jsonify({
            'success': True,
            'analysis_id': analysis_id,
            'prediction': prediction
        })
        
    except Exception as e:
        logger.error(f"Symptom analysis error: {str(e)}")
        return jsonify({'error': 'Analysis failed'}), 500

@app.route('/api/ai/image-diagnosis', methods=['POST'])
def image_diagnosis():
    """Analyze medical images for disease detection"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        diagnosis_type = request.form.get('diagnosis_type', 'general')
        patient_id = request.form.get('patient_id')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Secure filename
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Analyze image based on type
            if diagnosis_type == 'eye_anemia':
                result = image_analyzer.detect_eye_anemia(file_path)
            elif diagnosis_type == 'heart_disease':
                result = image_analyzer.detect_heart_disease(file_path)
            elif diagnosis_type == 'skin_cancer':
                result = image_analyzer.detect_skin_cancer(file_path)
            elif diagnosis_type == 'pneumonia':
                result = image_analyzer.detect_pneumonia(file_path)
            else:
                result = image_analyzer.general_analysis(file_path)
            
            # Store result in database
            diagnosis_data = {
                'patient_id': patient_id,
                'diagnosis_type': diagnosis_type,
                'image_path': file_path,
                'result': result,
                'confidence': result['confidence'],
                'created_at': datetime.utcnow().isoformat()
            }
            
            diagnosis_id = db.create_image_diagnosis(diagnosis_data)
            
            # Clean up uploaded file
            os.remove(file_path)
            
            return jsonify({
                'success': True,
                'diagnosis_id': diagnosis_id,
                'result': result
            })
        
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        logger.error(f"Image diagnosis error: {str(e)}")
        return jsonify({'error': 'Image analysis failed'}), 500

@app.route('/api/ai/ocr-analysis', methods=['POST'])
def ocr_analysis():
    """Extract and analyze text from medical reports"""
    try:
        if 'document' not in request.files:
            return jsonify({'error': 'No document file provided'}), 400
        
        file = request.files['document']
        patient_id = request.form.get('patient_id')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Extract text using OCR
            extracted_text = ocr_processor.extract_text(file_path)
            
            # Analyze extracted medical data
            analysis = ocr_processor.analyze_medical_report(extracted_text)
            
            # Store OCR result
            ocr_data = {
                'patient_id': patient_id,
                'document_path': file_path,
                'extracted_text': extracted_text,
                'analysis': analysis,
                'created_at': datetime.utcnow().isoformat()
            }
            
            ocr_id = db.create_ocr_analysis(ocr_data)
            
            # Clean up uploaded file
            os.remove(file_path)
            
            return jsonify({
                'success': True,
                'ocr_id': ocr_id,
                'extracted_text': extracted_text,
                'analysis': analysis
            })
        
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        logger.error(f"OCR analysis error: {str(e)}")
        return jsonify({'error': 'OCR analysis failed'}), 500

@app.route('/api/ai/anemia/eye', methods=['POST'])
def anemia_eye_detection():
    """Anemia detection from eye images"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        patient_id = request.form.get('patient_id')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Read file content
            file_content = file.read()
            
            # Get prediction
            result = predict_anemia_eye(file_content, patient_id)
            
            return jsonify(result)
        
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        logger.error(f"Anemia eye detection error: {str(e)}")
        return jsonify({'error': 'Analysis failed'}), 500

@app.route('/api/ai/anemia/nail', methods=['POST'])
def anemia_nail_detection():
    """Anemia detection from nail images"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        patient_id = request.form.get('patient_id')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Read file content
            file_content = file.read()
            
            # Get prediction
            result = predict_anemia_nail(file_content, patient_id)
            
            return jsonify(result)
        
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        logger.error(f"Anemia nail detection error: {str(e)}")
        return jsonify({'error': 'Analysis failed'}), 500

@app.route('/api/ai/anemia/health', methods=['GET'])
def anemia_health_check():
    """Check anemia detection models health"""
    try:
        health_status = get_anemia_health_status()
        return jsonify({
            'success': True,
            'anemia_detection': health_status
        })
    except Exception as e:
        logger.error(f"Anemia health check error: {str(e)}")
        return jsonify({'error': 'Health check failed'}), 500

# ==================== PATIENT ROUTES ====================

@app.route('/api/patients', methods=['GET'])
def get_patients():
    """Get all patients (for doctors)"""
    try:
        patients = db.get_all_patients()
        return jsonify({
            'success': True,
            'patients': patients
        })
    except Exception as e:
        logger.error(f"Get patients error: {str(e)}")
        return jsonify({'error': 'Failed to fetch patients'}), 500

@app.route('/api/patients/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    """Get specific patient details"""
    try:
        patient = db.get_patient_by_id(patient_id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        # Get patient's medical history
        medical_history = db.get_patient_medical_history(patient_id)
        
        return jsonify({
            'success': True,
            'patient': patient,
            'medical_history': medical_history
        })
    except Exception as e:
        logger.error(f"Get patient error: {str(e)}")
        return jsonify({'error': 'Failed to fetch patient'}), 500

@app.route('/api/patients/<patient_id>/health-data', methods=['POST'])
def update_health_data():
    """Update patient health data"""
    try:
        data = request.get_json()
        patient_id = request.view_args['patient_id']
        
        health_data = {
            'patient_id': patient_id,
            'heart_rate': data.get('heart_rate'),
            'blood_pressure': data.get('blood_pressure'),
            'temperature': data.get('temperature'),
            'weight': data.get('weight'),
            'height': data.get('height'),
            'recorded_at': datetime.utcnow().isoformat()
        }
        
        # Validate health data
        if not validate_patient_data(health_data):
            return jsonify({'error': 'Invalid health data'}), 400
        
        health_id = db.create_health_record(health_data)
        
        # Check for emergency conditions
        emergency_check = emergency_service.check_emergency_conditions(health_data)
        if emergency_check['is_emergency']:
            # Trigger emergency alert
            emergency_service.trigger_emergency_alert(patient_id, emergency_check)
        
        return jsonify({
            'success': True,
            'health_id': health_id,
            'emergency_alert': emergency_check
        })
        
    except Exception as e:
        logger.error(f"Update health data error: {str(e)}")
        return jsonify({'error': 'Failed to update health data'}), 500

# ==================== MEDICAL RECORDS ROUTES ====================

@app.route('/api/medical-records', methods=['POST'])
def upload_medical_record():
    """Upload medical record to IPFS"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        patient_id = request.form.get('patient_id')
        record_type = request.form.get('record_type')
        title = request.form.get('title')
        description = request.form.get('description')
        doctor_id = request.form.get('doctor_id')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Upload to IPFS
            ipfs_hash = ipfs_service.upload_file(file_path)
            
            # Encrypt sensitive metadata
            encrypted_description = encrypt_sensitive_data(description)
            
            # Store record metadata in database
            record_data = {
                'patient_id': patient_id,
                'doctor_id': doctor_id,
                'record_type': record_type,
                'title': title,
                'description': encrypted_description,
                'file_name': filename,
                'file_size': os.path.getsize(file_path),
                'ipfs_hash': ipfs_hash,
                'created_at': datetime.utcnow().isoformat(),
                'status': 'verified'
            }
            
            if not validate_medical_record(record_data):
                return jsonify({'error': 'Invalid record data'}), 400
            
            record_id = db.create_medical_record(record_data)
            
            # Clean up local file
            os.remove(file_path)
            
            return jsonify({
                'success': True,
                'record_id': record_id,
                'ipfs_hash': ipfs_hash
            })
        
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        logger.error(f"Upload medical record error: {str(e)}")
        return jsonify({'error': 'Failed to upload record'}), 500

@app.route('/api/medical-records/<patient_id>', methods=['GET'])
def get_medical_records(patient_id):
    """Get all medical records for a patient"""
    try:
        records = db.get_patient_medical_records(patient_id)
        
        # Decrypt sensitive data for authorized access
        for record in records:
            if record.get('description'):
                record['description'] = decrypt_sensitive_data(record['description'])
        
        return jsonify({
            'success': True,
            'records': records
        })
    except Exception as e:
        logger.error(f"Get medical records error: {str(e)}")
        return jsonify({'error': 'Failed to fetch records'}), 500

@app.route('/api/medical-records/download/<record_id>', methods=['GET'])
def download_medical_record(record_id):
    """Download medical record from IPFS"""
    try:
        record = db.get_medical_record_by_id(record_id)
        if not record:
            return jsonify({'error': 'Record not found'}), 404
        
        # Download from IPFS
        file_content = ipfs_service.download_file(record['ipfs_hash'])
        
        return jsonify({
            'success': True,
            'file_content': file_content,
            'file_name': record['file_name']
        })
    except Exception as e:
        logger.error(f"Download medical record error: {str(e)}")
        return jsonify({'error': 'Failed to download record'}), 500

# ==================== EMERGENCY ROUTES ====================

@app.route('/api/emergency/alert', methods=['POST'])
def create_emergency_alert():
    """Create emergency alert"""
    try:
        data = request.get_json()
        
        alert_data = {
            'patient_id': data.get('patient_id'),
            'emergency_type': data.get('emergency_type'),
            'severity': data.get('severity', 'high'),
            'symptoms': data.get('symptoms'),
            'location': data.get('location'),
            'contact_number': data.get('contact_number'),
            'created_at': datetime.utcnow().isoformat(),
            'status': 'active'
        }
        
        alert_id = db.create_emergency_alert(alert_data)
        
        # Notify available emergency doctors
        emergency_service.notify_emergency_doctors(alert_data)
        
        return jsonify({
            'success': True,
            'alert_id': alert_id,
            'message': 'Emergency alert created successfully'
        })
        
    except Exception as e:
        logger.error(f"Emergency alert error: {str(e)}")
        return jsonify({'error': 'Failed to create emergency alert'}), 500

@app.route('/api/emergency/ambulance', methods=['POST'])
def request_ambulance():
    """Request ambulance service"""
    try:
        data = request.get_json()
        
        ambulance_data = {
            'patient_id': data.get('patient_id'),
            'location': data.get('location'),
            'emergency_type': data.get('emergency_type'),
            'priority': data.get('priority', 'high'),
            'contact_number': data.get('contact_number'),
            'requested_at': datetime.utcnow().isoformat(),
            'status': 'requested'
        }
        
        request_id = db.create_ambulance_request(ambulance_data)
        
        # Calculate ETA and dispatch
        dispatch_info = emergency_service.dispatch_ambulance(ambulance_data)
        
        return jsonify({
            'success': True,
            'request_id': request_id,
            'dispatch_info': dispatch_info
        })
        
    except Exception as e:
        logger.error(f"Ambulance request error: {str(e)}")
        return jsonify({'error': 'Failed to request ambulance'}), 500

# ==================== ANALYTICS ROUTES ====================

@app.route('/api/analytics/dashboard', methods=['GET'])
def get_dashboard_analytics():
    """Get dashboard analytics data"""
    try:
        time_range = request.args.get('time_range', '7d')
        
        analytics_data = analytics_service.get_dashboard_metrics(time_range)
        
        return jsonify({
            'success': True,
            'analytics': analytics_data
        })
    except Exception as e:
        logger.error(f"Dashboard analytics error: {str(e)}")
        return jsonify({'error': 'Failed to fetch analytics'}), 500

@app.route('/api/analytics/consultations', methods=['GET'])
def get_consultation_analytics():
    """Get consultation analytics"""
    try:
        doctor_id = request.args.get('doctor_id')
        time_range = request.args.get('time_range', '30d')
        
        consultation_data = analytics_service.get_consultation_analytics(doctor_id, time_range)
        
        return jsonify({
            'success': True,
            'consultations': consultation_data
        })
    except Exception as e:
        logger.error(f"Consultation analytics error: {str(e)}")
        return jsonify({'error': 'Failed to fetch consultation analytics'}), 500

@app.route('/api/analytics/patient-health-trends', methods=['GET'])
def get_patient_health_trends():
    """Get patient health trends"""
    try:
        patient_id = request.args.get('patient_id')
        time_range = request.args.get('time_range', '90d')
        
        health_trends = analytics_service.get_patient_health_trends(patient_id, time_range)
        
        return jsonify({
            'success': True,
            'health_trends': health_trends
        })
    except Exception as e:
        logger.error(f"Health trends error: {str(e)}")
        return jsonify({'error': 'Failed to fetch health trends'}), 500

# ==================== CONSULTATION ROUTES ====================

@app.route('/api/consultations', methods=['POST'])
def create_consultation():
    """Create new consultation"""
    try:
        data = request.get_json()
        
        consultation_data = {
            'patient_id': data.get('patient_id'),
            'doctor_id': data.get('doctor_id'),
            'consultation_type': data.get('consultation_type', 'regular'),
            'symptoms': data.get('symptoms'),
            'diagnosis': data.get('diagnosis'),
            'prescription': data.get('prescription'),
            'notes': data.get('notes'),
            'scheduled_at': data.get('scheduled_at'),
            'duration': data.get('duration'),
            'status': 'scheduled',
            'created_at': datetime.utcnow().isoformat()
        }
        
        consultation_id = db.create_consultation(consultation_data)
        
        return jsonify({
            'success': True,
            'consultation_id': consultation_id
        })
        
    except Exception as e:
        logger.error(f"Create consultation error: {str(e)}")
        return jsonify({'error': 'Failed to create consultation'}), 500

@app.route('/api/consultations/<consultation_id>', methods=['PUT'])
def update_consultation(consultation_id):
    """Update consultation details"""
    try:
        data = request.get_json()
        
        update_data = {
            'diagnosis': data.get('diagnosis'),
            'prescription': data.get('prescription'),
            'notes': data.get('notes'),
            'status': data.get('status'),
            'completed_at': datetime.utcnow().isoformat() if data.get('status') == 'completed' else None
        }
        
        success = db.update_consultation(consultation_id, update_data)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Consultation updated successfully'
            })
        else:
            return jsonify({'error': 'Consultation not found'}), 404
        
    except Exception as e:
        logger.error(f"Update consultation error: {str(e)}")
        return jsonify({'error': 'Failed to update consultation'}), 500

# ==================== HEALTH MONITORING ROUTES ====================

@app.route('/api/health-monitoring/alerts', methods=['GET'])
def get_health_alerts():
    """Get health monitoring alerts"""
    try:
        doctor_id = request.args.get('doctor_id')
        severity = request.args.get('severity')
        
        alerts = db.get_health_alerts(doctor_id, severity)
        
        return jsonify({
            'success': True,
            'alerts': alerts
        })
    except Exception as e:
        logger.error(f"Get health alerts error: {str(e)}")
        return jsonify({'error': 'Failed to fetch health alerts'}), 500

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ==================== MAIN ====================

if __name__ == '__main__':
    # Create upload directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    app.run(debug=True, host='0.0.0.0', port=5000)