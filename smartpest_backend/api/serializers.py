from rest_framework import serializers
from .models import Report, User  # Import User model

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
