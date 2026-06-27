from django.shortcuts import render
from .models import User
from .serializers import RegisterSerializer, UserProfileSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated


class UserRegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()
    

class ProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()
    
    def get_object(self):
        return self.request.user