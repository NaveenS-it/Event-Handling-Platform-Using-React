import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
    const dateStr = new Date(event.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    return (
        <div className="event-card">
            {event.imageUrl ? (
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="event-card-image"
                />
            ) : (
                <div className="event-card-image-placeholder">
                    <Calendar size={40} strokeWidth={1.5} />
                </div>
            )}

            <div className="event-card-body">
                <div className="event-card-meta">
                    <div className="event-card-meta-item">
                        <Calendar size={13} />
                        {dateStr}
                    </div>
                    <div className="event-card-meta-item">
                        <MapPin size={13} />
                        {event.location}
                    </div>
                </div>

                <h3 className="event-card-title">{event.title}</h3>

                <div className="event-card-footer">
                    <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray-400)', marginBottom: 2 }}>
                            From
                        </div>
                        <div className="event-card-price">${event.price.toFixed(2)}</div>
                    </div>
                    <Link
                        to={`/events/${event.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                        Book <ArrowRight size={13} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
