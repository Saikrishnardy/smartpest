from django.urls import path
from .views import PestDetectionView, pest_info, save_report, ReportListView, register_user, login_user

urlpatterns = [
    path('predict/', PestDetectionView.as_view(), name='predict'),
    path('pest-info/<str:pest_name>/', pest_info, name='pest-info'),
    path('save-report/', save_report, name='save-report'),
    path('reports/', ReportListView.as_view(), name='report-list'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
]
