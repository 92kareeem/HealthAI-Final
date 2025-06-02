import re
from typing import Dict, Any, List
from datetime import datetime

def validate_patient_data(health_data: Dict[str, Any]) -> bool:
    """Validate patient health data"""
    try:
        # Check required fields
        if not health_data.get('patient_id'):
            return False
        
        # Validate vital signs ranges
        if health_data.get('heart_rate'):
            hr = health_data['heart_rate']
            if not isinstance(hr, int) or hr < 30 or hr > 200:
                return False
        
        if health_data.get('blood_pressure_systolic'):
            systolic = health_data['blood_pressure_systolic']
            if not isinstance(systolic, int) or systolic < 70 or systolic > 250:
                return False
        
        if health_data.get('blood_pressure_diastolic'):
            diastolic = health_data['blood_pressure_diastolic']
            if not isinstance(diastolic, int) or diastolic < 40 or diastolic > 150:
                return False
        
        if health_data.get('temperature'):
            temp = float(health_data['temperature'])
            if temp < 90.0 or temp > 110.0:
                return False
        
        if health_data.get('weight'):
            weight = float(health_data['weight'])
            if weight < 10.0 or weight > 500.0:
                return False
        
        if health_data.get('height'):
            height = float(health_data['height'])
            if height < 50.0 or height > 250.0:
                return False
        
        return True
        
    except (ValueError, TypeError):
        return False

def validate_medical_record(record_data: Dict[str, Any]) -> bool:
    """Validate medical record data"""
    try:
        # Check required fields
        required_fields = ['patient_id', 'record_type', 'title']
        if not all(field in record_data for field in required_fields):
            return False
        
        # Validate record type
        valid_types = [
            'lab_report', 'imaging', 'prescription', 'consultation_note',
            'discharge_summary', 'vaccination_record', 'allergy_record'
        ]
        if record_data['record_type'] not in valid_types:
            return False
        
        # Validate file size if present
        if record_data.get('file_size'):
            file_size = record_data['file_size']
            max_size = 50 * 1024 * 1024  # 50MB
            if file_size > max_size:
                return False
        
        return True
        
    except (ValueError, TypeError):
        return False

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone_number(phone: str) -> bool:
    """Validate phone number format"""
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    # Check if it's between 10-15 digits
    return 10 <= len(digits_only) <= 15

def validate_wallet_address(address: str) -> bool:
    """Validate crypto wallet address format"""
    # Basic validation for Ethereum-style addresses
    if address.startswith('0x') and len(address) == 42:
        return re.match(r'^0x[a-fA-F0-9]{40}$', address) is not None
    return False

def validate_consultation_data(consultation_data: Dict[str, Any]) -> bool:
    """Validate consultation data"""
    try:
        # Check required fields
        required_fields = ['patient_id', 'doctor_id']
        if not all(field in consultation_data for field in required_fields):
            return False
        
        # Validate consultation type
        valid_types = ['regular', 'emergency', 'follow_up', 'telemedicine']
        if consultation_data.get('consultation_type') not in valid_types:
            return False
        
        # Validate scheduled time if present
        if consultation_data.get('scheduled_at'):
            try:
                scheduled_time = datetime.fromisoformat(consultation_data['scheduled_at'].replace('Z', '+00:00'))
                # Check if scheduled time is in the future
                if scheduled_time <= datetime.utcnow():
                    return False
            except ValueError:
                return False
        
        # Validate duration
        if consultation_data.get('duration'):
            duration = consultation_data['duration']
            if not isinstance(duration, int) or duration < 5 or duration > 180:
                return False
        
        return True
        
    except (ValueError, TypeError):
        return False

def sanitize_input(input_string: str) -> str:
    """Sanitize user input to prevent injection attacks"""
    if not isinstance(input_string, str):
        return ""
    
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', ';', '(', ')', '|', '`']
    sanitized = input_string
    
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')
    
    # Limit length
    return sanitized[:1000]

def validate_symptoms_input(symptoms: str) -> bool:
    """Validate symptoms input"""
    if not isinstance(symptoms, str):
        return False
    
    # Check length
    if len(symptoms.strip()) < 5 or len(symptoms) > 2000:
        return False
    
    # Check for potentially malicious content
    malicious_patterns = [
        r'<script.*?>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe.*?>',
        r'<object.*?>'
    ]
    
    for pattern in malicious_patterns:
        if re.search(pattern, symptoms, re.IGNORECASE):
            return False
    
    return True
