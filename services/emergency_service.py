import logging
from typing import Dict, List, Any
from datetime import datetime, timedelta
import requests
import json
from database.supabase_client import SupabaseClient

logger = logging.getLogger(__name__)

class EmergencyService:
    def __init__(self):
        self.db = SupabaseClient()
        self.emergency_thresholds = {
            'heart_rate': {'min': 50, 'max': 120},
            'blood_pressure_systolic': {'min': 90, 'max': 180},
            'blood_pressure_diastolic': {'min': 60, 'max': 110},
            'temperature': {'min': 96.0, 'max': 102.0},
            'oxygen_saturation': {'min': 90, 'max': 100}
        }
    
    def check_emergency_conditions(self, health_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check if health data indicates emergency conditions"""
        try:
            emergency_indicators = []
            severity_score = 0
            
            # Check vital signs against thresholds
            for vital, value in health_data.items():
                if vital in self.emergency_thresholds and value is not None:
                    thresholds = self.emergency_thresholds[vital]
                    
                    if value < thresholds['min']:
                        emergency_indicators.append({
                            'vital': vital,
                            'value': value,
                            'condition': 'critically_low',
                            'severity': 'high'
                        })
                        severity_score += 3
                    elif value > thresholds['max']:
                        emergency_indicators.append({
                            'vital': vital,
                            'value': value,
                            'condition': 'critically_high',
                            'severity': 'high'
                        })
                        severity_score += 3
            
            # Determine overall emergency status
            is_emergency = severity_score >= 3
            
            return {
                'is_emergency': is_emergency,
                'severity_score': severity_score,
                'emergency_indicators': emergency_indicators,
                'recommended_action': self._get_recommended_action(severity_score),
                'urgency_level': self._determine_urgency_level(severity_score)
            }
            
        except Exception as e:
            logger.error(f"Error checking emergency conditions: {str(e)}")
            return {
                'is_emergency': False,
                'error': str(e)
            }
    
    def _get_recommended_action(self, severity_score: int) -> str:
        """Get recommended action based on severity score"""
        if severity_score >= 6:
            return "Call emergency services immediately"
        elif severity_score >= 3:
            return "Seek immediate medical attention"
        elif severity_score >= 1:
            return "Contact healthcare provider"
        else:
            return "Continue monitoring"
    
    def _determine_urgency_level(self, severity_score: int) -> str:
        """Determine urgency level"""
        if severity_score >= 6:
            return "critical"
        elif severity_score >= 3:
            return "high"
        elif severity_score >= 1:
            return "medium"
        else:
            return "low"
    
    def trigger_emergency_alert(self, patient_id: str, emergency_data: Dict[str, Any]) -> str:
        """Trigger emergency alert and notifications"""
        try:
            # Create emergency alert
            alert_data = {
                'patient_id': patient_id,
                'emergency_type': 'vital_signs_critical',
                'severity': emergency_data['urgency_level'],
                'symptoms': json.dumps(emergency_data['emergency_indicators']),
                'status': 'active',
                'created_at': datetime.utcnow().isoformat()
            }
            
            alert_id = self.db.create_emergency_alert(alert_data)
            
            # Notify emergency contacts
            self._notify_emergency_contacts(patient_id, emergency_data)
            
            # Notify available doctors
            self._notify_emergency_doctors(patient_id, emergency_data)
            
            # Create health alert for monitoring
            self._create_health_alert(patient_id, emergency_data)
            
            return alert_id
            
        except Exception as e:
            logger.error(f"Error triggering emergency alert: {str(e)}")
            raise
    
    def _notify_emergency_contacts(self, patient_id: str, emergency_data: Dict[str, Any]):
        """Notify patient's emergency contacts"""
        try:
            # Get emergency contacts from database
            contacts = self.db.supabase.table('emergency_contacts').select('*').eq('patient_id', patient_id).execute()
            
            for contact in contacts.data:
                notification_data = {
                    'user_id': None,  # External contact
                    'patient_id': patient_id,
                    'notification_type': 'emergency_alert',
                    'title': 'Emergency Alert',
                    'message': f"Emergency detected for patient. Severity: {emergency_data['urgency_level']}",
                    'severity': 'high',
                    'created_at': datetime.utcnow().isoformat()
                }
                
                self.db.supabase.table('notifications').insert(notification_data).execute()
                
                # Send SMS/Email notification (implementation depends on service provider)
                self._send_emergency_notification(contact, emergency_data)
                
        except Exception as e:
            logger.error(f"Error notifying emergency contacts: {str(e)}")
    
    def _notify_emergency_doctors(self, patient_id: str, emergency_data: Dict[str, Any]):
        """Notify available emergency doctors"""
        try:
            # Get available emergency doctors
            doctors = self.db.supabase.table('users').select('*').eq('role', 'doctor').eq('specialization', 'emergency').execute()
            
            for doctor in doctors.data:
                notification_data = {
                    'user_id': doctor['id'],
                    'patient_id': patient_id,
                    'notification_type': 'emergency_patient',
                    'title': 'Emergency Patient Alert',
                    'message': f"Emergency patient requires immediate attention. Severity: {emergency_data['urgency_level']}",
                    'severity': 'high',
                    'created_at': datetime.utcnow().isoformat()
                }
                
                self.db.supabase.table('notifications').insert(notification_data).execute()
                
        except Exception as e:
            logger.error(f"Error notifying emergency doctors: {str(e)}")
    
    def _create_health_alert(self, patient_id: str, emergency_data: Dict[str, Any]):
        """Create health alert for continuous monitoring"""
        try:
            alert_data = {
                'patient_id': patient_id,
                'alert_type': 'vital_signs_emergency',
                'severity': emergency_data['urgency_level'],
                'message': f"Critical vital signs detected: {emergency_data['recommended_action']}",
                'vital_signs': json.dumps(emergency_data['emergency_indicators']),
                'status': 'active',
                'created_at': datetime.utcnow().isoformat()
            }
            
            self.db.supabase.table('health_alerts').insert(alert_data).execute()
            
        except Exception as e:
            logger.error(f"Error creating health alert: {str(e)}")
    
    def _send_emergency_notification(self, contact: Dict[str, Any], emergency_data: Dict[str, Any]):
        """Send emergency notification via SMS/Email"""
        try:
            # This would integrate with SMS/Email service providers
            # For now, we'll log the notification
            logger.info(f"Emergency notification sent to {contact['name']} at {contact['phone_number']}")
            
            # Example integration with Twilio for SMS
            # message = f"EMERGENCY: Your emergency contact requires immediate medical attention. Severity: {emergency_data['urgency_level']}"
            # send_sms(contact['phone_number'], message)
            
        except Exception as e:
            logger.error(f"Error sending emergency notification: {str(e)}")
    
    def dispatch_ambulance(self, ambulance_data: Dict[str, Any]) -> Dict[str, Any]:
        """Dispatch ambulance and calculate ETA"""
        try:
            # Generate tracking ID
            tracking_id = f"AMB-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
            
            # Calculate estimated ETA (simplified)
            base_eta = 15  # Base 15 minutes
            priority_multiplier = {
                'critical': 0.5,
                'high': 0.7,
                'medium': 1.0,
                'low': 1.5
            }
            
            priority = ambulance_data.get('priority', 'medium')
            estimated_eta = int(base_eta * priority_multiplier.get(priority, 1.0))
            
            # Update ambulance request with dispatch info
            dispatch_info = {
                'tracking_id': tracking_id,
                'eta_minutes': estimated_eta,
                'dispatch_time': datetime.utcnow().isoformat(),
                'status': 'dispatched'
            }
            
            return dispatch_info
            
        except Exception as e:
            logger.error(f"Error dispatching ambulance: {str(e)}")
            return {
                'error': str(e),
                'tracking_id': None,
                'eta_minutes': None
            }
    
    def notify_emergency_doctors(self, alert_data: Dict[str, Any]):
        """Notify emergency doctors about new alert"""
        try:
            # Get emergency doctors
            doctors = self.db.supabase.table('users').select('*').eq('role', 'doctor').execute()
            
            emergency_doctors = [d for d in doctors.data if d.get('specialization') in ['emergency', 'critical_care']]
            
            for doctor in emergency_doctors:
                notification_data = {
                    'user_id': doctor['id'],
                    'patient_id': alert_data['patient_id'],
                    'notification_type': 'emergency_alert',
                    'title': f"Emergency Alert - {alert_data['emergency_type']}",
                    'message': f"Emergency patient requires attention. Type: {alert_data['emergency_type']}, Severity: {alert_data['severity']}",
                    'severity': alert_data['severity'],
                    'created_at': datetime.utcnow().isoformat()
                }
                
                self.db.supabase.table('notifications').insert(notification_data).execute()
                
        except Exception as e:
            logger.error(f"Error notifying emergency doctors: {str(e)}")
