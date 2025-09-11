from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import (
    AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
)

from .inference import predict_image
from .models import Report, User, Feedback, Pesticide, Pest
from .serializers import (
    ReportSerializer, UserSerializer, FeedbackSerializer,
    PesticideSerializer, PestSerializer
)
import tempfile
import json
import os

from rest_framework import generics


class PestDetectionView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [AllowAny]

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
            result = predict_image(temp_path)
            return Response(result)
        except Exception as e:
            return Response({"error": f"Prediction failed: {str(e)}"}, status=500)
        finally:
            if os.path.exists(temp_path):
                os.unlink(temp_path)


@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def pest_info(request, pest_name):
    """Get detailed information about a specific pest"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    desc_path = os.path.join(base_dir, 'pest_description.json')
    pest_path = os.path.join(base_dir, 'pesticides_info.json')

    try:
        with open(desc_path, 'r', encoding='utf-8') as f:
            desc_data = json.load(f)
        # Normalize keys to lowercase for case-insensitive matching
        desc_dict = {str(item.get('pest_name', '')).strip().lower(): item.get('description', '') for item in desc_data}
    except FileNotFoundError:
        desc_dict = {}

    try:
        with open(pest_path, 'r', encoding='utf-8') as f:
            pest_data = json.load(f)
        # Normalize keys to lowercase for case-insensitive matching
        pest_dict = {str(item.get('pest_name', '')).strip().lower(): item.get('pesticides', []) for item in pest_data}
    except FileNotFoundError:
        pest_dict = {}

    normalized_name = str(pest_name).strip().lower()
    description = desc_dict.get(normalized_name, 'No detailed description available.')
    pesticides = pest_dict.get(normalized_name, [])

    if not pesticides:
        pesticides = [{
            'name': 'No pesticide data available',
            'dosage': '',
            'safety_precautions': ''
        }]

    return JsonResponse({
        'pest_name': pest_name,
        'description': description,
        'pesticides': pesticides
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def save_report(request):
    """Save a pest detection report"""
    try:
        data = json.loads(request.body)
        serializer = ReportSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({
                "message": "Report saved successfully",
                "report_id": serializer.data['id']
            }, status=201)
        else:
            return JsonResponse(serializer.errors, status=400)
    except Exception as e:
        return JsonResponse({"error": f"Failed to save report: {str(e)}"}, status=500)


class ReportListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        reports = Report.objects.all().order_by('-timestamp')
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)


class UserListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        users = User.objects.all().order_by('first_name')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class FeedbackListView(generics.ListAPIView):
    queryset = Feedback.objects.all().select_related('user').order_by('-timestamp')
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class FeedbackCreateView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FeedbackDestroyView(generics.DestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAdminUser]


class FeedbackUpdateView(generics.UpdateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAdminUser]

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)


class PesticideListView(generics.ListCreateAPIView):
    queryset = Pesticide.objects.all().order_by('name')
    serializer_class = PesticideSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PesticideDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pesticide.objects.all()
    serializer_class = PesticideSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PestListView(generics.ListCreateAPIView):
    queryset = Pest.objects.all().order_by('name')
    serializer_class = PestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pest.objects.all()
    serializer_class = PestSerializer
    permission_classes = [IsAdminUser]


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
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
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"detail": "Email and password are required"}, status=400)

    user = authenticate(request, username=email, password=password)

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(user)
        return Response({
            'user': serializer.data,
            'token': token.key
        })
    else:
        return Response({"detail": "Invalid credentials"}, status=401)
