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
    # This would typically come from a database
    pest_database = {
        'Aphids': {
            'description': 'Small, soft-bodied insects that feed on plant sap',
            'damage': 'Cause yellowing leaves, stunted growth, and honeydew secretion',
            'control_methods': 'Use insecticidal soap, neem oil, or introduce ladybugs',
            'pesticides': ['Insecticidal Soap', 'Neem Oil', 'Pyrethrin']
        },
        'Spider Mites': {
            'description': 'Tiny arachnids that create fine webbing on plants',
            'damage': 'Cause stippling on leaves, webbing, and leaf drop',
            'control_methods': 'Increase humidity, use miticides, or predatory mites',
            'pesticides': ['Miticide', 'Horticultural Oil', 'Insecticidal Soap']
        },
        'Whiteflies': {
            'description': 'Small, white, winged insects that cluster on leaf undersides',
            'damage': 'Cause yellowing, wilting, and transmit plant viruses',
            'control_methods': 'Use yellow sticky traps, insecticidal soap, or systemic insecticides',
            'pesticides': ['Insecticidal Soap', 'Neem Oil', 'Systemic Insecticide']
        },
        'Mealybugs': {
            'description': 'Small, white, cottony insects that feed on plant sap',
            'damage': 'Cause stunted growth, yellowing leaves, and honeydew secretion',
            'control_methods': 'Remove manually, apply alcohol solution, or use systemic insecticide',
            'pesticides': ['Systemic Insecticide', 'Horticultural Oil', 'Neem Oil']
        },
        'Scale Insects': {
            'description': 'Small, immobile insects that attach to plant surfaces',
            'damage': 'Cause yellowing leaves, stunted growth, and plant decline',
            'control_methods': 'Scrape off manually, use horticultural oil, or systemic treatment',
            'pesticides': ['Horticultural Oil', 'Systemic Insecticide', 'Neem Oil']
        },
        'Thrips': {
            'description': 'Tiny, slender insects that feed on plant tissues',
            'damage': 'Cause silvering of leaves, distorted growth, and flower damage',
            'control_methods': 'Use blue sticky traps, insecticidal soap, or predatory mites',
            'pesticides': ['Insecticidal Soap', 'Neem Oil', 'Spinosad']
        },
        'Leaf Miners': {
            'description': 'Larvae that tunnel inside leaves creating visible trails',
            'damage': 'Create winding trails in leaves, reducing photosynthesis',
            'control_methods': 'Remove affected leaves, use systemic insecticides, or beneficial nematodes',
            'pesticides': ['Systemic Insecticide', 'Spinosad', 'Neem Oil']
        },
        'Caterpillars': {
            'description': 'Larvae of moths and butterflies that feed on plant foliage',
            'damage': 'Create holes in leaves, defoliate plants, and bore into fruits',
            'control_methods': 'Handpick, use Bacillus thuringiensis, or introduce parasitic wasps',
            'pesticides': ['Bacillus thuringiensis', 'Spinosad', 'Neem Oil']
        },
        'Termite': {
            'description': 'Social insects that feed on wood and plant materials',
            'damage': 'Destroy wooden structures, damage plant roots and stems',
            'control_methods': 'Use soil treatments, bait systems, or professional pest control',
            'pesticides': ['Termite Bait', 'Soil Treatment', 'Professional Treatment']
        },
        'Grasshopper': {
            'description': 'Large jumping insects that feed on plant foliage',
            'damage': 'Defoliate plants, create large holes in leaves',
            'control_methods': 'Use barriers, introduce predators, or apply insecticides',
            'pesticides': ['Carbaryl', 'Malathion', 'Neem Oil']
        },
        'Whitefly': {
            'description': 'Small, white, winged insects that cluster on leaf undersides',
            'damage': 'Cause yellowing, wilting, and transmit plant viruses',
            'control_methods': 'Use yellow sticky traps, insecticidal soap, or systemic insecticides',
            'pesticides': ['Insecticidal Soap', 'Neem Oil', 'Systemic Insecticide']
        }
    }
    
    pest_info = pest_database.get(pest_name, {
        'description': 'Pest information not available in database',
        'damage': 'Damage assessment requires further analysis',
        'control_methods': 'General pest control methods recommended',
        'pesticides': ['Consult local pest control expert']
    })
    
    return JsonResponse(pest_info)

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
