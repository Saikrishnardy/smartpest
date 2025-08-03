from django.urls import path
from .views import PestDetectionView, pest_info, save_report

urlpatterns = [
    path('predict/', PestDetectionView.as_view(), name='predict'),
    path('pest-info/<str:pest_name>/', pest_info, name='pest-info'),
    path('save-report/', save_report, name='save-report'),
]
