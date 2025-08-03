#!/usr/bin/env python
"""
Startup script for the SmartPest Django backend server
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

def main():
    """Start the Django development server"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartpest_backend.settings')
    
    try:
        django.setup()
        print("🚀 Starting SmartPest Backend Server...")
        print("📍 Server will be available at: http://localhost:8000")
        print("🔗 API endpoints:")
        print("   - POST /api/predict/ - Pest detection")
        print("   - GET  /api/pest-info/<pest_name>/ - Pest information")
        print("   - POST /api/save-report/ - Save detection report")
        print("")
        print("Press Ctrl+C to stop the server")
        print("-" * 50)
        
        # Start the development server
        execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main() 