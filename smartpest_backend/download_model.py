#!/usr/bin/env python3
"""
Script to download the SmartPest ML model weights
"""
import os
import requests
import zipfile
from pathlib import Path

def download_model():
    """Download the ML model weights"""
    print("🔄 SmartPest Model Downloader")
    print("=" * 50)
    
    # Model URLs (you would need to provide the actual URLs)
    model_urls = {
        "best_model_b5.pth": "YOUR_MODEL_URL_HERE",
        "best_efficientnet_b0.pth": "YOUR_MODEL_URL_HERE"
    }
    
    models_dir = Path(__file__).parent / "models"
    models_dir.mkdir(exist_ok=True)
    
    print("📋 Instructions to get the full ML model:")
    print("1. You need the actual model weights file (.pth)")
    print("2. The current files are Git LFS pointers (not actual models)")
    print("3. Contact your ML team or download from your model repository")
    print("4. Place the model file in: smartpest_backend/models/")
    print("5. Restart the Django server")
    
    print("\n🔧 Alternative: Use a pre-trained model")
    print("You can also use a pre-trained EfficientNet model:")
    
    # Create a simple pre-trained model option
    try:
        import timm
        import torch
        
        print("\n🔄 Creating a pre-trained model for testing...")
        
        # Create model with pre-trained weights
        model = timm.create_model("efficientnet_b0", pretrained=True, num_classes=131)
        
        # Save the model
        model_path = models_dir / "pretrained_efficientnet_b0.pth"
        torch.save(model.state_dict(), model_path)
        
        print(f"✅ Pre-trained model saved to: {model_path}")
        print("📝 Note: This is a pre-trained model, not trained on pest data")
        print("📝 For production, use the actual pest-trained model")
        
    except Exception as e:
        print(f"❌ Error creating pre-trained model: {e}")
    
    print("\n📋 Next Steps:")
    print("1. Get the actual model weights file")
    print("2. Place it in smartpest_backend/models/")
    print("3. Restart the Django server")
    print("4. The system will automatically load the full model")

if __name__ == "__main__":
    download_model() 