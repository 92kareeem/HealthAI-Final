from supabase import create_client, Client
from config import Config
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class SupabaseClient:
    def __init__(self):
        self.supabase: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
    
    # ==================== USER MANAGEMENT ====================
    
    def create_user(self, user_data: Dict) -> Dict:
        """Create new user"""
        try:
            result = self.supabase.table('users').insert(user_data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise
    
    def get_user_by_wallet(self, wallet_address: str) -> Optional[Dict]:
        """Get user by wallet address"""
        try:
            result = self.supabase.table('users').select('*').eq('wallet_address', wallet_address).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error getting user by wallet: {str(e)}")
            return None
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        try:
            result = self.supabase.table('users').select('*').eq('id', user_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error getting user by ID: {str(e)}")
            return None
    
    def create_session(self, user_id: str, token: str) -> bool:
        """Create user session"""
        try:
            session_data = {
                'user_id': user_id,
                'token': token,
                'created_at': datetime.utcnow().isoformat(),
                'expires_at': (datetime.utcnow() + timedelta(days=7)).isoformat()
            }
            self.supabase.table('user_sessions').insert(session_data).execute()
            return True
        except Exception as e:
            logger.error(f"Error creating session: {str(e)}")
            return False
    
    # ==================== PATIENT MANAGEMENT ====================
    
    def get_all_patients(self) -> List[Dict]:
        """Get all patients"""
        try:
            result = self.supabase.table('users').select('*').eq('role', 'patient').execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Error getting patients: {str(e)}")
            return []
    
    def get_patient_by_id(self, patient_id: str) -> Optional[Dict]:
        """Get patient by ID"""
        try:
            result = self.supabase.table('users').select('*').eq('id', patient_id).eq('role', 'patient').execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error getting patient: {str(e)}")
            return None
    
    def get_patient_medical_history(self, patient_id: str) -> List[Dict]:
        """Get patient's medical history"""
        try:
            result = self.supabase.table('medical_records').select('*').eq('patient_id', patient_id).order('created_at', desc=True).execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Error getting medical history: {str(e)}")
            return []
    
    # ==================== HEALTH RECORDS ====================
    
    def create_health_record(self, health_data: Dict) -> str:
        """Create health record"""
        try:
            result = self.supabase.table('health_records').insert(health_data).execute()
            return result.data[0]['id'] if result.data else None
        except Exception as e:
            logger.error(f"Error creating health record: {str(e)}")
            raise
    
    def get_patient_health_records(self, patient_id: str, limit: int = 50) -> List[Dict]:
        """Get patient's health records"""
        try:
            result = self.supabase.table('health_records').select('*').eq('patient_id', patient_id).order('recorded_at', desc=True).limit(limit).execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Error getting health records: {str(e)}")
            return []
    
    # ==================== MEDICAL RECORDS ====================
    
    def create_medical_record(self, record_data: Dict) -> str:
        """Create medical record"""
        try:
            result = self.supabase.table('medical_records').insert(record_data).execute()
            return result.data[0]['id'] if result.data else None
        except Exception as e:
            logger.error(f"Error creating medical record: {str(e)}")
            raise
    
    def get_patient_medical_records(self, patient_id: str) -> List[Dict]:
        """Get patient's medical records"""
        try:
            result = self.supabase.table('medical_records').select('*').eq('patient_id', patient_id).order('created_at', desc=True).execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Error getting medical records: {str(e)}")
            return []
    
    def get_medical_record_by_id(self, record_id: str) -> Optional[Dict]:
        """Get medical record by ID"""
        try:
            result = self.supabase.table('medical_records').select('*').eq('id', record_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error getting medical record: {str(e)}")
            return None
    
    # ==================== AI ANALYSIS ====================
    
    def create_symptom_analysis(self, analysis_data: Dict) -> str:
        """Create symptom analysis record"""
        try:
            result = self.supabase.table('symptom_analyses').insert(analysis_data).execute()
            return result.data[0]['id'] if result.data else None
        except Exception as e:
            logger.error(f"Error creating symptom analysis: {str(e)}")
            raise
    
    def create_image_diagnosis(self, diagnosis_data: Dict) -> str:
        """Create image diagnosis record"""
        try:
            result = self.supabase.table('image_diagnoses').insert(diagnosis_data).execute()
            return result.data[0]['id'] if result.data else None
        except Exception as e:
            logger.error(f"Error creating image diagnosis: {str(e)}")
            raise
    
    def create_ocr_analysis(self, ocr_data: Dict) -> str:
        """Create OCR analysis record"""
        try:
            result = self.supabase.table('ocr_analyses').insert(ocr_data).execute()
            return result.data[0]['id'] if result.data else None
        except Exception as e:
            logger.error(f"Error creating OCR analysis: {str(e)}")
            raise
    
    # ==================== CONSULTATIONS ====================
    
    def create_consultation(self, consultation_data: Dict) -> str:
        """Create consultation"""
        try:
            result = self.supabase.table('consultations').insert(consultation_data).execute()
            return result.data[0]['id'] if result.data else None
        except Exception as e:
            logger.error(f"Error creating consultation: {str(e)}")
            raise
    
    def update_consultation(self, consultation_id: str, update_data: Dict) -> bool:
        """Update consultation"""
        try:
            result = self.supabase.table('consultations').update(update_data).eq('id', consultation_id).execute()
            return len(result.data) > 0
        except Exception as e:
            logger.error(f"Error updating consultation: {str(e)}")
            return False
    
    def get_consultations_by_doctor(self, doctor_id: str, limit: int = 50) -> List[Dict]:
        """Get consultations by doctor"""
        try:
            result = self.supabase.table('consultations').select('*').eq('doctor_id', doctor_id).order('created_at', desc=True).limit(limit).execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Error getting consultations: {str(e)}")
            return []
    
    def get_consultations_by_patient(self, patient_id: str, limit: int = 50) -> List[Dict]:
        """Get consultations by patient"""
        try:
            result = self.supabase.table('consultations').select('*').eq('patient_id', patient_id).order('created_at', desc=True).limit(limit).execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Error getting patient consultations: {str(e)}")
            return []
    
    # ==================== EMERGENCY SERVICES ====================
    
    def create_emergency_alert(self, alert_data: Dict) -> str:
        """Create emergency alert"""
        try:
            result = self.supabase.table('emergency_alerts').insert(alert_data).execute()
            return result.data[0]['id'] if result.data else None
        except Exception as e:
            logger.error(f"Error creating emergency alert: {str(e)}")
            raise
    
    def create_ambulance_request(self, ambulance_data: Dict) -> str:
        """Create ambulance request"""
        try:
            result = self.supabase.table('ambulance_requests').insert(ambulance_data).execute()
            return result.data[0]['id'] if result.data else None
        except Exception as e:
            logger.error(f"Error creating ambulance request: {str(e)}")
            raise
    
    def get_active_emergency_alerts(self) -> List[Dict]:
        """Get active emergency alerts"""
        try:
            result = self.supabase.table('emergency_alerts').select('*').eq('status', 'active').order('created_at', desc=True).execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Error getting emergency alerts: {str(e)}")
            return []
    
    # ==================== HEALTH MONITORING ====================
    
    def get_health_alerts(self, doctor_id: str = None, severity: str = None) -> List[Dict]:
        """Get health monitoring alerts"""
        try:
            query = self.supabase.table('health_alerts').select('*')
            
            if doctor_id:
                query = query.eq('assigned_doctor_id', doctor_id)
            if severity:
                query = query.eq('severity', severity)
            
            result = query.order('created_at', desc=True).execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Error getting health alerts: {str(e)}")
            return []
    
    def create_health_alert(self, alert_data: Dict) -> str:
        """Create health alert"""
        try:
            result = self.supabase.table('health_alerts').insert(alert_data).execute()
            return result.data[0]['id'] if result.data else None
        except Exception as e:
            logger.error(f"Error creating health alert: {str(e)}")
            raise
    
    # ==================== ANALYTICS ====================
    
    def get_consultation_stats(self, time_range: str = '7d') -> Dict:
        """Get consultation statistics"""
        try:
            # Calculate date range
            if time_range == '24h':
                start_date = datetime.utcnow() - timedelta(hours=24)
            elif time_range == '7d':
                start_date = datetime.utcnow() - timedelta(days=7)
            elif time_range == '30d':
                start_date = datetime.utcnow() - timedelta(days=30)
            else:
                start_date = datetime.utcnow() - timedelta(days=90)
            
            result = self.supabase.table('consultations').select('*').gte('created_at', start_date.isoformat()).execute()
            consultations = result.data or []
            
            # Calculate statistics
            total_consultations = len(consultations)
            emergency_consultations = len([c for c in consultations if c.get('consultation_type') == 'emergency'])
            completed_consultations = len([c for c in consultations if c.get('status') == 'completed'])
            
            return {
                'total_consultations': total_consultations,
                'emergency_consultations': emergency_consultations,
                'completed_consultations': completed_consultations,
                'completion_rate': (completed_consultations / total_consultations * 100) if total_consultations > 0 else 0
            }
        except Exception as e:
            logger.error(f"Error getting consultation stats: {str(e)}")
            return {}
    
    def get_patient_stats(self) -> Dict:
        """Get patient statistics"""
        try:
            result = self.supabase.table('users').select('*').eq('role', 'patient').execute()
            patients = result.data or []
            
            active_patients = len([p for p in patients if p.get('last_login_at') and 
                                 datetime.fromisoformat(p['last_login_at'].replace('Z', '+00:00')) > 
                                 datetime.utcnow() - timedelta(days=30)])
            
            return {
                'total_patients': len(patients),
                'active_patients': active_patients,
                'new_patients_this_month': len([p for p in patients if 
                                              datetime.fromisoformat(p['created_at'].replace('Z', '+00:00')) > 
                                              datetime.utcnow() - timedelta(days=30)])
            }
        except Exception as e:
            logger.error(f"Error getting patient stats: {str(e)}")
            return {}
