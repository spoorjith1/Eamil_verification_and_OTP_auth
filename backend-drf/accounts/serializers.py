from rest_framework import serializers
from .models import User, OTP
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('Username already exists')
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Email already exists')
        return value
    
    def validate_password(self, value):
        validate_password(value)
        return value
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username']


class OTPVerifyserializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(max_length=6, required=True)
    

class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        
        if not user.is_verified:
            raise serializers.ValidationError({'error': 'Please verify your email first'})
        return data


class PasswordChangeOTPSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, required=True)
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    def validate_new_password(self, value):
        validate_password(value)
        return value