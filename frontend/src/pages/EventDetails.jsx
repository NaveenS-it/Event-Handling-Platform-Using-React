import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, DollarSign, Clock, Users, ArrowLeft, CalendarPlus, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [tickets, setTickets] = useState(1);
    const [tierSelections, setTierSelections] = useState({});
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, allEventsRes] = await Promise.all([
                    api.get(`/events/${id}`),
                    api.get(`/events`)
                ]);

                const currentEvent = eventRes.data;
                setEvent(currentEvent);

                // Initialize tierSelections if tiers exist
                if (currentEvent.ticketTiers && currentEvent.ticketTiers.length > 0) {
                    const initialTiers = {};
                    currentEvent.ticketTiers.forEach(t => initialTiers[t.id] = 0);
                    setTierSelections(initialTiers);
                }

                // Related events (exclude current, take 3 randomly or just slice 3)
                const others = allEventsRes.data.filter(e => e.id !== parseInt(id));
                setRelatedEvents(others.slice(0, 3));
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const calculateSelectedTiersTotal = () => {
        if (event?.ticketTiers && event.ticketTiers.length > 0) {
            return event.ticketTiers.reduce((total, tier) => {
                const qty = tierSelections[tier.id] || 0;
                return total + (qty * tier.price);
            }, 0);
        }
        return event?.price ? event.price * tickets : 0;
    };

    const handleBook = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setError('');

        const hasTiers = event.ticketTiers && event.ticketTiers.length > 0;
        let totalQty = hasTiers ? Object.values(tierSelections).reduce((a, b) => a + b, 0) : tickets;

        if (totalQty <= 0) {
            setError('Please select at least one ticket.');
            return;
        }

        const bookingData = {
            event_id: event.id,
            event_title: event.title,
            event_price: event.price,
            total_tickets: totalQty
        };

        if (hasTiers) {
            bookingData.tickets = event.ticketTiers
                .filter(t => tierSelections[t.id] > 0)
                .map(t => ({
                    tierId: t.id,
                    tierName: t.name,
                    price: t.price,
                    quantity: tierSelections[t.id]
                }));
        }

        sessionStorage.setItem('booking_tickets', JSON.stringify(bookingData));
        navigate('/checkout');
    };

    if (loading) return <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (!event) return <div className="text-center py-32 text-2xl text-danger font-bold">Event not found</div>;

    const eventDate = new Date(event.date);
    const dateStr = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
    };

    // Assuming events are 2 hours long for the calendar end date
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);
    const formatDateForCal = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDateForCal(eventDate)}/${formatDateForCal(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    return (
        <div className="min-h-screen py-16">
            <div className="container">
                <button onClick={() => navigate(-1)} className="flex-center hover:text-primary mb-8 font-medium transition group" style={{ color: 'var(--gray-500)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft className="h-5 w-5 mr-3 transform group-hover:-translate-x-1 transition-transform" /> Back to events
                </button>

                <div className="card shadow-sm rounded-xl overflow-hidden mb-8" style={{ background: 'var(--surface)' }}>
                    <div className="h-80 md:h-96 relative">
                        {event.imageUrl ? (
                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-80" />
                        ) : (
                            <div className="w-full h-full" style={{ background: 'var(--gray-100)' }} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-10">
                            <span className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full mb-4 inline-block shadow-lg">
                                Featured
                            </span>
                            <h1 className="text-balance shadow-sm text-white">{event.title}</h1>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 p-8 md:p-10">
                        <div className="flex-grow lg:w-2/3">
                            <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--gray-900)' }}>About this event</h2>
                            <p className="text-lg leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--gray-500)' }}>{event.description}</p>

                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex-start">
                                    <div className="p-4 rounded-2xl mr-6 border border-gray-200" style={{ background: 'var(--surface)' }}>
                                        <Calendar className="h-7 w-7 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--gray-900)' }}>Date</h4>
                                        <p style={{ color: 'var(--gray-500)' }}>{dateStr}</p>
                                    </div>
                                </div>
                                <div className="flex-start">
                                    <div className="p-4 rounded-2xl mr-6 border border-gray-200" style={{ background: 'var(--surface)' }}>
                                        <Clock className="h-7 w-7 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--gray-900)' }}>Time</h4>
                                        <p style={{ color: 'var(--gray-500)' }}>{timeStr}</p>
                                    </div>
                                </div>
                                <div className="flex-start">
                                    <div className="p-4 rounded-2xl mr-6 border border-gray-200" style={{ background: 'var(--surface)' }}>
                                        <MapPin className="h-7 w-7 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--gray-900)' }}>Location</h4>
                                        <p style={{ color: 'var(--gray-500)' }}>{event.location}</p>
                                    </div>
                                </div>
                                <div className="flex-start">
                                    <div className="p-4 rounded-2xl mr-6 border border-gray-200" style={{ background: 'var(--surface)' }}>
                                        <DollarSign className="h-7 w-7 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--gray-900)' }}>Price</h4>
                                        <p style={{ color: 'var(--gray-500)' }}>${event.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Share & Calendar Actions */}
                            <div className="mt-16 pt-8 border-t border-gray-200">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--gray-900)' }}>
                                    <Share2 className="h-5 w-5 text-primary" /> Share this Event
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    <button onClick={handleCopyLink} className="flex-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition font-medium" style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}>
                                        <LinkIcon className="h-4 w-4" /> Copy Link
                                    </button>
                                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this event: ' + event.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="flex-center gap-2 px-5 py-3 rounded-xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 transition text-sky-600 font-medium">
                                        <Twitter className="h-4 w-4" /> Twitter
                                    </a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="flex-center gap-2 px-5 py-3 rounded-xl bg-blue-600/10 border border-blue-600/30 hover:bg-blue-600/20 transition text-blue-700 font-medium">
                                        <Facebook className="h-4 w-4" /> Facebook
                                    </a>
                                    <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="flex-center gap-2 px-5 py-3 rounded-xl transition font-medium sm:ml-auto" style={{ background: 'var(--success-surface)', color: 'var(--success)', border: '1px solid var(--success)' }}>
                                        <CalendarPlus className="h-4 w-4" /> Add to Google Calendar
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/3 flex flex-col justify-start">
                            <div className="p-8 rounded-2xl border border-gray-200" style={{ background: 'var(--gray-50)' }}>
                                <h3 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-4" style={{ color: 'var(--gray-900)' }}>Book Tickets</h3>

                                {error && <div className="bg-danger/20 text-danger p-4 rounded-lg mb-6 text-sm font-medium border border-danger/30">{error}</div>}
                                {success && <div className="bg-success/20 text-success p-4 rounded-lg mb-6 text-sm font-medium border border-success/30">{success}</div>}

                                {event.ticketTiers && event.ticketTiers.length > 0 ? (
                                    <div className="space-y-6 mb-8">
                                        <p className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>Select your ticket tiers</p>
                                        {event.ticketTiers.map(tier => (
                                            <div key={tier.id} className="flex flex-col space-y-3 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                                                <div className="flex-between items-center">
                                                    <span className="font-bold text-lg" style={{ color: 'var(--gray-900)' }}>{tier.name}</span>
                                                    <span className="font-bold text-primary text-lg">${tier.price.toFixed(2)}</span>
                                                </div>
                                                <div className="flex-between mt-3">
                                                    <span className="text-sm" style={{ color: 'var(--gray-400)' }}>{tier.quantity} available</span>
                                                    <div className="flex-center">
                                                        <button
                                                            onClick={() => {
                                                                const currentQty = tierSelections[tier.id] || 0;
                                                                if (currentQty > 0) {
                                                                    setTierSelections({ ...tierSelections, [tier.id]: currentQty - 1 });
                                                                }
                                                            }}
                                                            className="w-10 h-10 rounded-l-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold text-lg"
                                                            style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                                        >-</button>
                                                        <div style={{
                                                            background: 'var(--surface)',
                                                            border: '1px solid var(--gray-200)',
                                                            borderRadius: 12,
                                                            padding: 8,
                                                            display: 'inline-block',
                                                            boxShadow: 'var(--shadow-xs)',
                                                        }}>
                                                            <input
                                                                value={tierSelections[tier.id] || 0}
                                                                readOnly
                                                                className="h-10 w-14 text-center bg-transparent focus:outline-none focus:ring-0 font-semibold text-lg"
                                                                style={{ color: 'var(--gray-900)', border: 'none' }}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const currentQty = tierSelections[tier.id] || 0;
                                                                if (currentQty < Math.min(10, tier.quantity)) {
                                                                    setTierSelections({ ...tierSelections, [tier.id]: currentQty + 1 });
                                                                }
                                                            }}
                                                            className="w-10 h-10 rounded-r-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold text-lg"
                                                            style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                                        >+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mb-8">
                                        <label className="block text-sm font-bold mb-3" style={{ color: 'var(--gray-900)' }}>Number of Tickets</label>
                                        <div className="flex-center">
                                            <button
                                                onClick={() => setTickets(Math.max(1, tickets - 1))}
                                                className="w-12 h-12 rounded-l-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold text-xl"
                                                style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                            >-</button>
                                            <input
                                                type="number"
                                                value={tickets}
                                                onChange={(e) => setTickets(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="h-12 w-full text-center border-t border-b border-gray-200 bg-transparent focus:outline-none focus:ring-0 font-semibold text-xl"
                                                style={{ color: 'var(--gray-900)' }}
                                                min="1" max="10"
                                            />
                                            <button
                                                onClick={() => setTickets(Math.min(10, tickets + 1))}
                                                className="w-12 h-12 rounded-r-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold text-xl"
                                                style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                            >+</button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex-between items-center mb-8 pt-6 border-t border-gray-200">
                                    <span className="font-medium text-lg" style={{ color: 'var(--gray-500)' }}>Total Price</span>
                                    <span className="text-3xl font-bold text-primary">
                                        ${calculateSelectedTiersTotal().toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={handleBook}
                                    disabled={bookingLoading}
                                    className="w-full btn btn-primary py-5 font-bold text-xl rounded-xl shadow-lg hover:shadow-xl disabled:opacity-70 flex-center"
                                >
                                    {bookingLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div> : null}
                                    {bookingLoading ? 'Processing...' : 'Proceed to Checkout'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Events Section */}
                {relatedEvents.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-gray-200">
                        <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--gray-900)' }}>More Events You Might Like</h2>
                        <div className="grid-3">
                            {relatedEvents.map(evt => (
                                <EventCard key={evt.id} event={evt} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
