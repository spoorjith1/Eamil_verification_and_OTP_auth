from django.shortcuts import render
from .models import User, OTP
from .serializers import RegisterSerializer, UserProfileSerializer, OTPVerifyserializer, ResendOTPSerializer,  CustomTokenObtainPairSerializer, PasswordChangeOTPSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import secrets
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.views import TokenObtainPairView


class UserRegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            OTP.objects.filter(user=user, purpose='accountVerification', is_used=False).update(is_used=True)
            
            otp = str(secrets.randbelow(900000) + 100000)
            OTP.objects.create(user=user, otp=otp, purpose='accountVerification', is_used=False)
            
            send_mail(
                subject='Verify your Email',
                message=f'your OTP is {otp}. it expires in 10 minutes.',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False
            )
            
            return Response({'message': 'Registration successful. Please verify Email'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()
    
    def get_object(self):
        return self.request.user


class EmailVerifyView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = OTPVerifyserializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            try:
                user_otp = OTP.objects.filter(user=user, purpose='accountVerification', is_used=False).latest('created_at')
            except OTP.DoesNotExist:
                return Response({'error': 'OTP not found'}, status=status.HTTP_404_NOT_FOUND)
            
            if timezone.now() > user_otp.created_at + timedelta(minutes=10):
                return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if user_otp.otp != otp:
                return Response({'error': 'InValid OTP'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.is_verified = True
            user.save()
            
            user_otp.is_used = True
            user_otp.save()
            
            return Response({'message', 'Email verified successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            if user.is_verified:
                return Response({'message': 'Email is already verified'}, status=status.HTTP_400_BAD_REQUEST)
            
            OTP.objects.filter(user=user, purpose='accountVerification', is_used=False).update(is_used=True)
            
            otp = str(secrets.randbelow(900000) + 100000)
            
            OTP.objects.create(user=user, otp=otp, purpose='accountVerification')
            
            send_mail(
                subject='Verify your Email',
                message=f'Your new OTP is {otp}. expires in 10 minutes',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False
            )
            
            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class SendPasswordOTPView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        OTP.objects.filter(user=user, purpose='passwordReset', is_used=False).update(is_used=True)
        
        otp = str(secrets.randbelow(900000) + 100000)
        OTP.objects.create(user=user, otp=otp, purpose='passwordReset')
        
        send_mail(
            subject='Password Reset OTP',
            message=f'your password reset OTP is {otp} expires in 10 minutes',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False
        )
        return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)


class ChangePasswordOTPView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = PasswordChangeOTPSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            otp = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']
            
            try:
                otp_user = OTP.objects.filter(user=user, purpose='passwordReset', is_used=False).latest('created_at')
            except OTP.DoesNotExist:
                return Response({'error': 'OTP not found.'}, status=status.HTTP_404_NOT_FOUND)
            
            if timezone.now() > otp_user.created_at + timedelta(minutes=10):
                return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if otp_user.otp != otp:
                return Response({'error': 'InValid OTP'}, status=status.HTTP_400_BAD_REQUEST)
            
            if user.check_password(new_password):
                return Response({'error': 'New password cannot be same as old password'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.save()
            
            otp_user.is_used = True
            otp_user.save()
            
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)