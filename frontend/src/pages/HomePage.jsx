import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService, categoryService } from '../services/api';
import { format } from 'date-fns';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch featured events
        const eventsResponse = await eventService.getEvents({ featured: true, limit: 6 });
        setFeaturedEvents(eventsResponse.data);
        
        // Fetch categories
        const categoriesResponse = await categoryService.getCategories();
        setCategories(categoriesResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Next Event</h1>
          <p className="text-xl mb-8">Discover and attend amazing events in your area</p>
          <Link to="/events" className="btn bg-white text-primary-700 hover:bg-gray-100 font-semibold text-lg px-6 py-3">
            Browse Events
          </Link>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Events</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center text-gray-600">No featured events available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <div key={event.id} className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-300">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                    <div className="absolute top-0 right-0 bg-primary-600 text-white px-3 py-1 m-2 rounded-full text-sm">
                      {event.status}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <span className="text-sm bg-secondary-100 text-secondary-800 px-2 py-1 rounded">
                        {event.category_name}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center text-gray-500 mb-4">
                      <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500 mb-4">
                      <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{format(new Date(event.start_date), 'MMM dd, yyyy - h:mm a')}</span>
                    </div>
                    <Link 
                      to={`/events/${event.id}`} 
                      className="btn-primary w-full text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/events" className="btn-outline">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-600">No categories available.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  to={`/events?category=${category.id}`}
                  className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{category.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your next event?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of people discovering events every day</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/events" className="btn-primary text-center px-8 py-3">
              Browse Events
            </Link>
            <Link to="/register" className="btn-outline text-center px-8 py-3">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;