from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Event, Attendance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    organizer = UserSerializer(read_only=True)
    organizer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='organizer'
    )
    category_name = serializers.ReadOnlyField(source='category.name')
    attendees_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'start_date', 'end_date',
                 'created_at', 'updated_at', 'image', 'organizer', 'organizer_id',
                 'category', 'category_name', 'status', 'is_featured', 'max_attendees',
                 'attendees_count']
    
    def get_attendees_count(self, obj):
        return obj.attendances.count()

class AttendanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='user'
    )
    event = EventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(),
        write_only=True,
        source='event'
    )
    
    class Meta:
        model = Attendance
        fields = ['id', 'event', 'event_id', 'user', 'user_id', 'status', 'registered_at']
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=Attendance.objects.all(),
                fields=['event', 'user'],
                message="You have already registered for this event."
            )
        ]