
"""
HealthAI Backend Server
Run this file to start the Flask backend server
"""

import os
import sys
from app import app

if __name__ == '__main__':
    # Set environment variables if not already set
    if not os.environ.get('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    if not os.environ.get('FLASK_DEBUG'):
        os.environ['FLASK_DEBUG'] = '1'
    
    # Create necessary directories
    os.makedirs('uploads', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    print("🏥 Starting HealthAI Backend Server...")
    print("📊 AI Models: Disease Prediction, Image Analysis, OCR Processing")
    print("🔗 Database: Supabase Integration")
    print("📱 Features: Emergency Services, Telemedicine, Health Monitoring")
    print("🌐 Server running on: http://localhost:3000")
    print("\n📋 Available API Endpoints:")
    print("   • POST /api/auth/wallet-login - Wallet authentication")
    print("   • POST /api/ai/symptom-analysis - AI symptom analysis")
    print("   • POST /api/ai/image-diagnosis - Medical image analysis")
    print("   • POST /api/medical-records - Upload medical records")
    print("   • POST /api/emergency/alert - Create emergency alert")
    print("   • GET /api/analytics/dashboard - Dashboard analytics")
    print("\n🔧 Make sure to set your environment variables:")
    print("   • SUPABASE_URL and SUPABASE_KEY")
    print("   • PINATA_API_KEY and PINATA_SECRET_KEY (for IPFS)")
    print("   • OPENAI_API_KEY (for AI features)")
    print("\n🚀 Ready to serve HealthAI requests!")
    
    app.run(
        host='0.0.0.0',
        port=3000,
        debug=True,
        threaded=True
    )
