import logging
from typing import Dict, List, Any
from datetime import datetime, timedelta
from database.supabase_client import SupabaseClient
import json

logger = logging.getLogger(__name__)

class AnalyticsService:
    def __init__(self):
        self.db = SupabaseClient()
    
    def get_dashboard_metrics(self, time_range: str = '7d') -> Dict[str, Any]:
        """Get comprehensive dashboard metrics"""
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            if time_range == '24h':
                start_date = end_date - timedelta(hours=24)
            elif time_range == '7d':
                start_date = end_date - timedelta(days=7)
            elif time_range == '30d':
                start_date = end_date - timedelta(days=30)
            else:
                start_date = end_date - timedelta(days=90)
            
            metrics = {
                'overview': self._get_overview_metrics(start_date, end_date),
                'consultations': self._get_consultation_metrics(start_date, end_date),
                'emergency': self._get_emergency_metrics(start_date, end_date),
                'ai_analysis': self._get_ai_analysis_metrics(start_date, end_date),
                'health_monitoring': self._get_health_monitoring_metrics(start_date, end_date)
            }
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error getting dashboard metrics: {str(e)}")
            return {}
    
    def _get_overview_metrics(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Get overview metrics"""
        try:
            # Total users
            users_result = self.db.supabase.table('users').select('id, role, created_at').execute()
            users = users_result.data
            
            total_patients = len([u for u in users if u['role'] == 'patient'])
            total_doctors = len([u for u in users if u['role'] == 'doctor'])
            
            # New users in time range
            new_users = len([u for u in users if 
                           datetime.fromisoformat(u['created_at'].replace('Z', '+00:00')) >= start_date])
            
            # Active consultations
            consultations_result = self.db.supabase.table('consultations').select('*').gte('created_at', start_date.isoformat()).execute()
            active_consultations = len(consultations_result.data)
            
            return {
                'total_patients': total_patients,
                'total_doctors': total_doctors,
                'new_users': new_users,
                'active_consultations': active_consultations
            }
            
        except Exception as e:
            logger.error(f"Error getting overview metrics: {str(e)}")
            return {}
    
    def _get_consultation_metrics(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Get consultation metrics"""
        try:
            consultations_result = self.db.supabase.table('consultations').select('*').gte('created_at', start_date.isoformat()).execute()
            consultations = consultations_result.data
            
            total_consultations = len(consultations)
            completed_consultations = len([c for c in consultations if c['status'] == 'completed'])
            emergency_consultations = len([c for c in consultations if c['consultation_type'] == 'emergency'])
            
            # Average consultation duration
            completed_with_duration = [c for c in consultations if c['status'] == 'completed' and c.get('duration')]
            avg_duration = sum(c['duration'] for c in completed_with_duration) / len(completed_with_duration) if completed_with_duration else 0
            
            # Consultation trends (daily breakdown)
            daily_consultations = {}
            for consultation in consultations:
                date = datetime.fromisoformat(consultation['created_at'].replace('Z', '+00:00')).date()
                daily_consultations[str(date)] = daily_consultations.get(str(date), 0) + 1
            
            return {
                'total_consultations': total_consultations,
                'completed_consultations': completed_consultations,
                'emergency_consultations': emergency_consultations,
                'completion_rate': (completed_consultations / total_consultations * 100) if total_consultations > 0 else 0,
                'average_duration_minutes': round(avg_duration, 1),
                'daily_trends': daily_consultations
            }
            
        except Exception as e:
            logger.error(f"Error getting consultation metrics: {str(e)}")
            return {}
    
    def _get_emergency_metrics(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Get emergency metrics"""
        try:
            # Emergency alerts
            alerts_result = self.db.supabase.table('emergency_alerts').select('*').gte('created_at', start_date.isoformat()).execute()
            alerts = alerts_result.data
            
            # Ambulance requests
            ambulance_result = self.db.supabase.table('ambulance_requests').select('*').gte('requested_at', start_date.isoformat()).execute()
            ambulance_requests = ambulance_result.data
            
            total_alerts = len(alerts)
            active_alerts = len([a for a in alerts if a['status'] == 'active'])
            resolved_alerts = len([a for a in alerts if a['status'] == 'resolved'])
            
            total_ambulance_requests = len(ambulance_requests)
            dispatched_ambulances = len([a for a in ambulance_requests if a['status'] == 'dispatched'])
            
            # Average response time for resolved alerts
            resolved_with_time = [a for a in alerts if a['status'] == 'resolved' and a.get('resolved_at')]
            avg_response_time = 0
            if resolved_with_time:
                response_times = []
                for alert in resolved_with_time:
                    created = datetime.fromisoformat(alert['created_at'].replace('Z', '+00:00'))
                    resolved = datetime.fromisoformat(alert['resolved_at'].replace('Z', '+00:00'))
                    response_times.append((resolved - created).total_seconds() / 60)  # in minutes
                avg_response_time = sum(response_times) / len(response_times)
            
            return {
                'total_emergency_alerts': total_alerts,
                'active_alerts': active_alerts,
                'resolved_alerts': resolved_alerts,
                'resolution_rate': (resolved_alerts / total_alerts * 100) if total_alerts > 0 else 0,
                'total_ambulance_requests': total_ambulance_requests,
                'dispatched_ambulances': dispatched_ambulances,
                'average_response_time_minutes': round(avg_response_time, 1)
            }
            
        except Exception as e:
            logger.error(f"Error getting emergency metrics: {str(e)}")
            return {}
    
    def _get_ai_analysis_metrics(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Get AI analysis metrics"""
        try:
            # Symptom analyses
            symptom_result = self.db.supabase.table('symptom_analyses').select('*').gte('created_at', start_date.isoformat()).execute()
            symptom_analyses = symptom_result.data
            
            # Image diagnoses
            image_result = self.db.supabase.table('image_diagnoses').select('*').gte('created_at', start_date.isoformat()).execute()
            image_diagnoses = image_result.data
            
            # OCR analyses
            ocr_result = self.db.supabase.table('ocr_analyses').select('*').gte('created_at', start_date.isoformat()).execute()
            ocr_analyses = ocr_result.data
            
            total_ai_analyses = len(symptom_analyses) + len(image_diagnoses) + len(ocr_analyses)
            
            # Average confidence scores
            symptom_confidences = [s['confidence'] for s in symptom_analyses if s.get('confidence')]
            image_confidences = [i['confidence'] for i in image_diagnoses if i.get('confidence')]
            
            avg_symptom_confidence = sum(symptom_confidences) / len(symptom_confidences) if symptom_confidences else 0
            avg_image_confidence = sum(image_confidences) / len(image_confidences) if image_confidences else 0
            
            # Analysis type breakdown
            image_types = {}
            for diagnosis in image_diagnoses:
                diagnosis_type = diagnosis.get('diagnosis_type', 'unknown')
                image_types[diagnosis_type] = image_types.get(diagnosis_type, 0) + 1
            
            return {
                'total_ai_analyses': total_ai_analyses,
                'symptom_analyses': len(symptom_analyses),
                'image_diagnoses': len(image_diagnoses),
                'ocr_analyses': len(ocr_analyses),
                'average_symptom_confidence': round(avg_symptom_confidence, 1),
                'average_image_confidence': round(avg_image_confidence, 1),
                'image_diagnosis_types': image_types
            }
            
        except Exception as e:
            logger.error(f"Error getting AI analysis metrics: {str(e)}")
            return {}
    
    def _get_health_monitoring_metrics(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Get health monitoring metrics"""
        try:
            # Health records
            health_result = self.db.supabase.table('health_records').select('*').gte('recorded_at', start_date.isoformat()).execute()
            health_records = health_result.data
            
            # Health alerts
            alerts_result = self.db.supabase.table('health_alerts').select('*').gte('created_at', start_date.isoformat()).execute()
            health_alerts = alerts_result.data
            
            total_health_records = len(health_records)
            total_health_alerts = len(health_alerts)
            active_health_alerts = len([a for a in health_alerts if a['status'] == 'active'])
            
            # Vital signs trends
            if health_records:
                avg_heart_rate = sum(r['heart_rate'] for r in health_records if r.get('heart_rate')) / len([r for r in health_records if r.get('heart_rate')])
                avg_systolic = sum(r['blood_pressure_systolic'] for r in health_records if r.get('blood_pressure_systolic')) / len([r for r in health_records if r.get('blood_pressure_systolic')])
                avg_temperature = sum(float(r['temperature']) for r in health_records if r.get('temperature')) / len([r for r in health_records if r.get('temperature')])
            else:
                avg_heart_rate = avg_systolic = avg_temperature = 0
            
            return {
                'total_health_records': total_health_records,
                'total_health_alerts': total_health_alerts,
                'active_health_alerts': active_health_alerts,
                'average_heart_rate': round(avg_heart_rate, 1),
                'average_systolic_bp': round(avg_systolic, 1),
                'average_temperature': round(avg_temperature, 1)
            }
            
        except Exception as e:
            logger.error(f"Error getting health monitoring metrics: {str(e)}")
            return {}
    
    def get_consultation_analytics(self, doctor_id: str = None, time_range: str = '30d') -> Dict[str, Any]:
        """Get detailed consultation analytics"""
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            if time_range == '7d':
                start_date = end_date - timedelta(days=7)
            elif time_range == '30d':
                start_date = end_date - timedelta(days=30)
            else:
                start_date = end_date - timedelta(days=90)
            
            # Build query
            query = self.db.supabase.table('consultations').select('*').gte('created_at', start_date.isoformat())
            
            if doctor_id:
                query = query.eq('doctor_id', doctor_id)
            
            consultations_result = query.execute()
            consultations = consultations_result.data
            
            # Calculate analytics
            total_consultations = len(consultations)
            completed = len([c for c in consultations if c['status'] == 'completed'])
            cancelled = len([c for c in consultations if c['status'] == 'cancelled'])
            scheduled = len([c for c in consultations if c['status'] == 'scheduled'])
            
            # Patient satisfaction (would need ratings table in real implementation)
            # For now, simulate based on completion rate
            satisfaction_score = (completed / total_consultations * 100) if total_consultations > 0 else 0
            
            # Consultation types breakdown
            type_breakdown = {}
            for consultation in consultations:
                cons_type = consultation.get('consultation_type', 'regular')
                type_breakdown[cons_type] = type_breakdown.get(cons_type, 0) + 1
            
            return {
                'total_consultations': total_consultations,
                'completed_consultations': completed,
                'cancelled_consultations': cancelled,
                'scheduled_consultations': scheduled,
                'completion_rate': (completed / total_consultations * 100) if total_consultations > 0 else 0,
                'satisfaction_score': round(satisfaction_score, 1),
                'consultation_types': type_breakdown,
                'time_range': time_range
            }
            
        except Exception as e:
            logger.error(f"Error getting consultation analytics: {str(e)}")
            return {}
    
    def get_patient_health_trends(self, patient_id: str, time_range: str = '90d') -> Dict[str, Any]:
        """Get patient health trends over time"""
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            if time_range == '30d':
                start_date = end_date - timedelta(days=30)
            elif time_range == '90d':
                start_date = end_date - timedelta(days=90)
            else:
                start_date = end_date - timedelta(days=180)
            
            # Get health records
            health_result = self.db.supabase.table('health_records').select('*').eq('patient_id', patient_id).gte('recorded_at', start_date.isoformat()).order('recorded_at').execute()
            health_records = health_result.data
            
            if not health_records:
                return {'error': 'No health records found for this patient'}
            
            # Process trends
            trends = {
                'heart_rate': [],
                'blood_pressure': [],
                'temperature': [],
                'weight': [],
                'dates': []
            }
            
            for record in health_records:
                date = datetime.fromisoformat(record['recorded_at'].replace('Z', '+00:00')).strftime('%Y-%m-%d')
                trends['dates'].append(date)
                
                trends['heart_rate'].append(record.get('heart_rate'))
                trends['blood_pressure'].append({
                    'systolic': record.get('blood_pressure_systolic'),
                    'diastolic': record.get('blood_pressure_diastolic')
                })
                trends['temperature'].append(float(record['temperature']) if record.get('temperature') else None)
                trends['weight'].append(float(record['weight']) if record.get('weight') else None)
            
            # Calculate statistics
            heart_rates = [hr for hr in trends['heart_rate'] if hr is not None]
            temperatures = [temp for temp in trends['temperature'] if temp is not None]
            weights = [w for w in trends['weight'] if w is not None]
            
            statistics = {
                'heart_rate': {
                    'average': sum(heart_rates) / len(heart_rates) if heart_rates else 0,
                    'min': min(heart_rates) if heart_rates else 0,
                    'max': max(heart_rates) if heart_rates else 0
                },
                'temperature': {
                    'average': sum(temperatures) / len(temperatures) if temperatures else 0,
                    'min': min(temperatures) if temperatures else 0,
                    'max': max(temperatures) if temperatures else 0
                },
                'weight': {
                    'current': weights[-1] if weights else 0,
                    'change': weights[-1] - weights[0] if len(weights) > 1 else 0
                }
            }
            
            return {
                'trends': trends,
                'statistics': statistics,
                'record_count': len(health_records),
                'time_range': time_range
            }
            
        except Exception as e:
            logger.error(f"Error getting patient health trends: {str(e)}")
            return {'error': str(e)}
