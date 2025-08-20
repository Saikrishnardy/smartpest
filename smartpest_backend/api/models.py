from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager # Import BaseUserManager

# Create your managers here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'admin') # Assign admin role to superuser

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


# Create your models here.
class User(AbstractUser):
    # Override default username field since we are using email as USERNAME_FIELD
    username = None 
    email = models.EmailField(unique=True) # Make email field unique
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=50, default='user') # 'user' or 'admin'

    # Use email as the USERNAME_FIELD
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone'] # Fields required for creating a user via createsuperuser

    objects = CustomUserManager() # Assign the custom manager


class Report(models.Model):
    pest_name = models.CharField(max_length=255)
    confidence = models.FloatField()
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user_id = models.CharField(max_length=255, default='anonymous')

    def __str__(self):
        return f"{self.pest_name} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
