from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, EventViewSet, AttendanceViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'events', EventViewSet)
router.register(r'attendances', AttendanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]