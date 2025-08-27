from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework import status # Import status
from rest_framework.authtoken.models import Token # Import Token
from django.contrib.auth import authenticate # Import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser # Import IsAdminUser
from rest_framework.decorators import permission_classes # Import permission_classes decorator

from .inference import predict_image
from .models import Report, User, Feedback, Pesticide, Pest  # Import the User, Feedback, Pesticide, and Pest model
from .serializers import ReportSerializer, UserSerializer, FeedbackSerializer, PesticideSerializer, PestSerializer # Import PestSerializer
import tempfile
import json
import os

from rest_framework import generics # Import generics for CreateAPIView and ListAPIView

class PestDetectionView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticatedOrReadOnly] # Apply permission here

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
@permission_classes([IsAuthenticatedOrReadOnly]) # Apply permission here
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
@permission_classes([IsAuthenticated]) # Apply permission here
def save_report(request):
    """Save a pest detection report"""
    try:
        data = json.loads(request.body)
        serializer = ReportSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({
                "message": "Report saved successfully",
                "report_id": serializer.data['id']  # Return the ID from the saved object
            }, status=201) # 201 Created
        else:
            return JsonResponse(serializer.errors, status=400)
    except Exception as e:
        return JsonResponse({"error": f"Failed to save report: {str(e)}"}, status=500)


class ReportListView(APIView):
    """List all pest detection reports"""
    permission_classes = [IsAuthenticatedOrReadOnly] # Apply permission here
    def get(self, request, format=None):
        reports = Report.objects.all().order_by('-timestamp') # Order by most recent
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)


class UserListView(APIView):
    """List all registered users"""
    permission_classes = [IsAuthenticatedOrReadOnly] # Apply permission here
    def get(self, request, format=None):
        users = User.objects.all().order_by('first_name')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class FeedbackListView(generics.ListAPIView):
    queryset = Feedback.objects.all().select_related('user').order_by('-timestamp')
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Apply permission here

class FeedbackCreateView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated] # Apply permission here

    def perform_create(self, serializer):
        print(f"FeedbackCreateView - User authenticated: {self.request.user.is_authenticated}")
        print(f"FeedbackCreateView - Request user: {self.request.user}")
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

class FeedbackDestroyView(generics.DestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAdminUser]

class FeedbackUpdateView(generics.UpdateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAdminUser]
    # Allow partial updates for fields like is_important
    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)


class PesticideListView(generics.ListCreateAPIView):
    queryset = Pesticide.objects.all().order_by('name')
    serializer_class = PesticideSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Apply permission here

class PesticideDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pesticide.objects.all()
    serializer_class = PesticideSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Apply permission here


class PestListView(generics.ListCreateAPIView):
    queryset = Pest.objects.all().order_by('name')
    serializer_class = PestSerializer
    permission_classes = [IsAdminUser]

class PestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pest.objects.all()
    serializer_class = PestSerializer
    permission_classes = [IsAdminUser]

@api_view(['POST'])
@permission_classes([AllowAny]) # Allow unauthenticated access for registration
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Set username to email if it's not provided or required by AbstractUser
        if not user.username:
            user.username = user.email
            user.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': serializer.data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny]) # Allow unauthenticated access for login
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Use authenticate with the email as username for custom user model
    user = authenticate(request, username=email, password=password)

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        # Using UserSerializer to get user data consistent with registration
        serializer = UserSerializer(user)
        return Response({
            'user': serializer.data,
            'token': token.key
        })
    else:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
