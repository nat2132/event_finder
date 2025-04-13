import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await eventService.getEvent(id);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    try {
      setRegistering(true);
      await eventService.registerForEvent(id);
      setRegistrationStatus({ success: true, message: 'You have successfully registered for this event!' });
      
      // Refresh event data to update attendees count
      const response = await eventService.getEvent(id);
      setEvent(response.data);
    } catch (err) {
      console.error('Error registering for event:', err);
      setRegistrationStatus({ 
        success: false, 
        message: err.response?.data?.detail || 'Failed to register for this event. Please try again.'
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate('/events')} 
          className="mt-4 btn-primary"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/events')} 
            className="btn-primary"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="relative h-64 md:h-96 bg-gray-200">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-300">
              <span className="text-gray-500 text-xl">No image available</span>
            </div>
          )}
          <div className="absolute top-0 right-0 bg-primary-600 text-white px-4 py-2 m-4 rounded-full">
            {event.status}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
            <h1 className="text-3xl font-bold mb-2 md:mb-0">{event.title}</h1>
            <span className="inline-block bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm font-semibold">
              {event.category_name}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center text-gray-600 mb-3">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div><strong>Starts:</strong> {format(new Date(event.start_date), 'EEEE, MMMM d, yyyy - h:mm a')}</div>
                  <div><strong>Ends:</strong> {format(new Date(event.end_date), 'EEEE, MMMM d, yyyy - h:mm a')}</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-gray-600 mb-3">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Organized by {event.organizer?.username || 'Unknown'}</span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>
                  {event.attendees_count} {event.attendees_count === 1 ? 'person' : 'people'} attending
                  {event.max_attendees && ` (${event.max_attendees - event.attendees_count} spots left)`}
                </span>
              </div>
            </div>
          </div>
          
          {/* Registration Status Message */}
          {registrationStatus && (
            <div className={`mb-6 p-4 rounded ${registrationStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {registrationStatus.message}
            </div>
          )}
          
          {/* Register Button */}
          {event.status === 'upcoming' && (
            <button
              onClick={handleRegister}
              disabled={registering || (event.max_attendees && event.attendees_count >= event.max_attendees)}
              className={`btn-primary w-full md:w-auto px-8 py-3 ${(registering || (event.max_attendees && event.attendees_count >= event.max_attendees)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {registering ? 'Registering...' : 'Register for this Event'}
            </button>
          )}
          
          {event.status !== 'upcoming' && (
            <div className="bg-gray-100 text-gray-700 p-4 rounded">
              {event.status === 'ongoing' && 'This event is currently ongoing.'}
              {event.status === 'completed' && 'This event has already taken place.'}
              {event.status === 'cancelled' && 'This event has been cancelled.'}
            </div>
          )}
        </div>
      </div>
      
      {/* Event Description */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">About this Event</h2>
          <div className="prose max-w-none">
            {event.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;