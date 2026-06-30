from django.urls import path
from accounts import views as AccViews
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

urlpatterns = [
    #register
    path('register/', AccViews.UserRegisterView.as_view(), name='user_register'),
    
    #login
    path('token/', AccViews.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    
    #user profile view
    path('profile/me/', AccViews.ProfileView.as_view(), name='user_profile'),
    
    #verify email
    path('verify-email/', AccViews.EmailVerifyView.as_view(), name='verify_email'),
    #resend otp
    path('resend-otp/', AccViews.ResendOTPView.as_view(), name='resend_otp'),
    
    #password change OTP
    path('send-password-otp/', AccViews.SendPasswordOTPView.as_view(), name='password_otp'),
    #change password
    path('change-password/', AccViews.ChangePasswordOTPView.as_view(), name='change_password_otp'),
]