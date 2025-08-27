from rest_framework import serializers
from .models import Report, User, Feedback, Pesticide, Pest  # Import Pest model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'role', 'password')
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        # Use create_user from the custom manager, which handles email as username
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            phone=validated_data.get('phone'),
            role=validated_data.get('role', 'user')
        )
        return user

    def validate(self, data):
        # Ensure username is set to email if not explicitly provided
        if not data.get('username') and data.get('email'):
            data['username'] = data['email']
        return data


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'


# New serializer for nested user data in Feedback
class SmallUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

class FeedbackSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Feedback
        fields = ('id', 'user', 'subject', 'message', 'timestamp', 'is_important') # Added 'is_important'


class PesticideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pesticide
        fields = '__all__'

class PestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pest
        fields = '__all__'
