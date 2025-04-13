from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth.models import User
from .models import Category, Event, Attendance
from .serializers import CategorySerializer, EventSerializer, AttendanceSerializer, UserSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_date', 'created_at', 'title']
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)
    
    def get_queryset(self):
        queryset = Event.objects.all()
        category = self.request.query_params.get('category', None)
        status_param = self.request.query_params.get('status', None)
        featured = self.request.query_params.get('featured', None)
        
        if category:
            queryset = queryset.filter(category__id=category)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
            
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def register(self, request, pk=None):
        event = self.get_object()
        user = request.user
        
        # Check if user is already registered
        if Attendance.objects.filter(event=event, user=user).exists():
            return Response({'detail': 'You are already registered for this event.'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Check if event has reached max attendees
        if event.max_attendees and event.attendances.count() >= event.max_attendees:
            return Response({'detail': 'This event has reached maximum capacity.'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        attendance = Attendance.objects.create(event=event, user=user, status='registered')
        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def attendees(self, request, pk=None):
        event = self.get_object()
        attendances = event.attendances.all()
        serializer = AttendanceSerializer(attendances, many=True)
        return Response(serializer.data)

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Attendance.objects.all()
        return Attendance.objects.filter(user=user)
    
    @action(detail=False, methods=['get'])
    def my_events(self, request):
        user = request.user
        attendances = Attendance.objects.filter(user=user)
        serializer = AttendanceSerializer(attendances, many=True)
        return Response(serializer.data)
