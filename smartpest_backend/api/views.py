from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .inference import predict_image
import tempfile
import json
import os

class PestDetectionView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error": "No image uploaded."}, status=400)

        # Save image temporarily
        with tempfile.NamedTemporaryFile(delete=False) as temp:
            for chunk in image_file.chunks():
                temp.write(chunk)
            temp_path = temp.name

        try:
            # Predict
            result = predict_image(temp_path)
            return Response(result)
        except Exception as e:
            return Response({"error": f"Prediction failed: {str(e)}"}, status=500)
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.unlink(temp_path)

@api_view(['GET'])
def pest_info(request, pest_name):
    """Get detailed information about a specific pest"""
    # Paths to the JSON files
    base_dir = os.path.dirname(os.path.abspath(__file__))
    desc_path = os.path.join(base_dir, 'pest_description.json')
    pest_path = os.path.join(base_dir, 'pesticides_info.json')

    # Load descriptions
    with open(desc_path, 'r', encoding='utf-8') as f:
        desc_data = json.load(f)
    desc_dict = {item['pest_name']: item['description'] for item in desc_data}

    # Load pesticides
    with open(pest_path, 'r', encoding='utf-8') as f:
        pest_data = json.load(f)
    pest_dict = {item['pest_name']: item['pesticides'] for item in pest_data}

    # Try to find the pest
    description = desc_dict.get(pest_name, 'No detailed description available.')
    pesticides = pest_dict.get(pest_name, [])

    if not pesticides:
        pesticides = [{'name': 'No pesticide data available', 'dosage': '', 'safety_precautions': ''}]

    return JsonResponse({
        'pest_name': pest_name,
        'description': description,
        'pesticides': pesticides
    })

@api_view(['POST'])
def save_report(request):
    """Save a pest detection report"""
    try:
        data = json.loads(request.body)
        # In a real application, you would save this to a database
        # For now, we'll just return a success response
        print(f"Saving report: {data}")
        return JsonResponse({
            "message": "Report saved successfully",
            "report_id": "demo_" + str(hash(str(data)))
        })
    except Exception as e:
        return JsonResponse({"error": f"Failed to save report: {str(e)}"}, status=400)
