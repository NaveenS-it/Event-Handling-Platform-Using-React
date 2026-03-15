import { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { Search, Filter } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get(`/events${searchTerm ? `?search=${searchTerm}` : ''}`);
                setEvents(response.data);
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <div className="min-h-screen py-16" style={{ background: 'var(--bg)' }}>
            <div className="container">
                <div className="mb-16 text-center">
                    <h1 className="text-balance mb-6">Discover Events</h1>
                    <p className="text-xl max-w-2xl mx-auto text-balance" style={{ color: 'var(--gray-500)' }}>
                        Find the perfect experiences and memories waiting for you.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-16 max-w-4xl mx-auto">
                    <div className="card shadow-sm rounded-2xl flex overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--gray-200)' }}>
                        <div className="pl-6 py-5 flex items-center justify-center pointer-events-none">
                            <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by event title, location..."
                            className="flex-grow w-full px-6 py-5 bg-transparent focus:outline-none focus:ring-0 text-lg border-none"
                            style={{ color: 'var(--gray-900)' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-primary px-10 py-5 font-semibold transition flex items-center justify-center gap-2 mr-2 my-2 rounded-xl">
                            <Filter className="h-5 w-5" /> Filter
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-center my-24">
                        <div className="spinner"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="card text-center py-24 max-w-md mx-auto">
                        <Search className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--gray-900)' }}>No events found</h3>
                        <p style={{ color: 'var(--gray-500)' }} className="mb-8">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="grid-3">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
