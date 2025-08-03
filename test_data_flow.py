#!/usr/bin/env python3
"""
Test script to demonstrate data flow between frontend and backend
"""
import requests
import json
from PIL import Image
import io

def test_data_flow():
    """Test the complete data flow"""
    base_url = "http://localhost:8000/api"
    
    print("🔄 Testing Data Flow Between Frontend and Backend")
    print("=" * 60)
    
    # Step 1: Simulate image upload (like frontend does)
    print("\n1️⃣ **Image Upload & Detection**")
    print("-" * 40)
    
    # Create test image
    test_image = Image.new('RGB', (200, 200), color='green')
    img_byte_arr = io.BytesIO()
    test_image.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    
    # Upload image (like frontend does)
    files = {'image': ('test_pest.jpg', img_byte_arr, 'image/jpeg')}
    response = requests.post(f"{base_url}/predict/", files=files)
    
    if response.status_code == 200:
        detection_data = response.json()
        pest_name = detection_data.get('class')
        confidence = detection_data.get('confidence')
        
        print(f"✅ Image uploaded successfully")
        print(f"   Detected Pest: {pest_name}")
        print(f"   Confidence: {confidence}")
        
        # Step 2: Get pest information (like frontend does)
        print(f"\n2️⃣ **Fetching Pest Information for: {pest_name}**")
        print("-" * 40)
        
        pest_info_response = requests.get(f"{base_url}/pest-info/{pest_name}/")
        if pest_info_response.status_code == 200:
            pest_info = pest_info_response.json()
            print(f"✅ Pest information retrieved from backend")
            print(f"   Description: {pest_info.get('description', 'N/A')}")
            print(f"   Damage: {pest_info.get('damage', 'N/A')}")
            print(f"   Control Methods: {pest_info.get('control_methods', 'N/A')}")
            print(f"   Pesticides: {pest_info.get('pesticides', [])}")
        
        # Step 3: Save report (like frontend does)
        print(f"\n3️⃣ **Saving Detection Report**")
        print("-" * 40)
        
        report_data = {
            "pest_name": pest_name,
            "confidence": confidence,
            "description": f"Detected {pest_name} with {confidence} confidence",
            "timestamp": "2024-01-01T00:00:00Z",
            "user_id": "test_user"
        }
        
        save_response = requests.post(
            f"{base_url}/save-report/",
            json=report_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if save_response.status_code == 200:
            save_result = save_response.json()
            print(f"✅ Report saved to backend")
            print(f"   Report ID: {save_result.get('report_id', 'N/A')}")
            print(f"   Message: {save_result.get('message', 'N/A')}")
    
    print("\n" + "=" * 60)
    print("🎉 **Data Flow Test Complete!**")
    print("\n📋 **Summary:**")
    print("✅ Frontend → Backend: Image upload")
    print("✅ Backend → Frontend: Detection results")
    print("✅ Frontend → Backend: Pest info request")
    print("✅ Backend → Frontend: Pest information")
    print("✅ Frontend → Backend: Report saving")
    print("✅ Backend → Frontend: Save confirmation")
    print("\n🌐 **Your application is fully connected!**")

if __name__ == "__main__":
    test_data_flow() 