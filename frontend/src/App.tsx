import { useEffect, useState } from "react";

type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  created_at: string;
};

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/events/")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Event Finder</h1>
      {loading ? (
        <div className="text-center">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center">No events found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="mb-2 text-gray-700">{event.description}</p>
              <div className="mb-1 text-sm text-gray-500">
                <span className="font-medium">Location:</span> {event.location}
              </div>
              <div className="mb-1 text-sm text-gray-500">
                <span className="font-medium">Start:</span>{" "}
                {new Date(event.start_time).toLocaleString()}
              </div>
              <div className="mb-1 text-sm text-gray-500">
                <span className="font-medium">End:</span>{" "}
                {new Date(event.end_time).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
