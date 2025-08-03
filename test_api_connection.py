#!/usr/bin/env python3
"""
Test script to verify API connection between frontend and backend
"""
import requests
import json
import os
from PIL import Image
import io

def test_api_endpoints():
    """Test the API endpoints"""
    base_url = "http://localhost:8000/api"
    
    print("🧪 Testing SmartPest API Connection...")
    print("=" * 50)
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/predict/")
        print(f"✅ Server is running (Status: {response.status_code})")
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running. Please start it first.")
        return False
    
    # Test 2: Test pest info endpoint
    try:
        response = requests.get(f"{base_url}/pest-info/Aphids/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Pest info endpoint working - Aphids info retrieved")
            print(f"   Description: {data.get('description', 'N/A')[:50]}...")
        else:
            print(f"❌ Pest info endpoint failed (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Pest info endpoint error: {e}")
    
    # Test 3: Test save report endpoint
    try:
        report_data = {
            "pest_name": "Test Pest",
            "confidence": 0.85,
            "description": "Test detection",
            "timestamp": "2024-01-01T00:00:00Z",
            "user_id": "test_user"
        }
        response = requests.post(
            f"{base_url}/save-report/",
            json=report_data,
            headers={'Content-Type': 'application/json'}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Save report endpoint working - Report saved")
            print(f"   Report ID: {data.get('report_id', 'N/A')}")
        else:
            print(f"❌ Save report endpoint failed (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Save report endpoint error: {e}")
    
    # Test 4: Test image upload (mock)
    try:
        # Create a simple test image
        test_image = Image.new('RGB', (100, 100), color='red')
        img_byte_arr = io.BytesIO()
        test_image.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)
        
        files = {'image': ('test.jpg', img_byte_arr, 'image/jpeg')}
        response = requests.post(f"{base_url}/predict/", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Image upload endpoint working")
            print(f"   Detected: {data.get('class', 'N/A')}")
            print(f"   Confidence: {data.get('confidence', 'N/A')}")
        else:
            print(f"❌ Image upload endpoint failed (Status: {response.status_code})")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Image upload endpoint error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 API Connection Test Complete!")
    print("\n📋 Next Steps:")
    print("1. Open http://localhost:5173 in your browser")
    print("2. Upload an image to test pest detection")
    print("3. Check the browser console for any errors")
    
    return True

if __name__ == "__main__":
    test_api_endpoints() 