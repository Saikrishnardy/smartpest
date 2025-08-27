from django.urls import path
from .views import PestDetectionView, pest_info, save_report, ReportListView, register_user, login_user, UserListView, FeedbackListView, FeedbackCreateView, PesticideListView, PesticideDetailView, FeedbackDestroyView, FeedbackUpdateView, PestListView, PestDetailView

urlpatterns = [
    path('predict/', PestDetectionView.as_view(), name='predict'),
    path('pest-info/<str:pest_name>/', pest_info, name='pest-info'),
    path('save-report/', save_report, name='save-report'),
    path('reports/', ReportListView.as_view(), name='report-list'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('feedback/', FeedbackListView.as_view(), name='feedback-list'),
    path('feedback/create/', FeedbackCreateView.as_view(), name='feedback-create'),
    path('pesticides/', PesticideListView.as_view(), name='pesticide-list'),
    path('pesticides/<int:pk>/', PesticideDetailView.as_view(), name='pesticide-detail'),
    path('feedback/<int:pk>/delete/', FeedbackDestroyView.as_view(), name='feedback-delete'),
    path('feedback/<int:pk>/update/', FeedbackUpdateView.as_view(), name='feedback-update'),
    path('pests/', PestListView.as_view(), name='pest-list'),
    path('pests/<int:pk>/', PestDetailView.as_view(), name='pest-detail'),
]
