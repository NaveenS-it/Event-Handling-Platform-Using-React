import { Calendar, MapPin, Ticket, Download } from 'lucide-react';

const BookingCard = ({ booking, onCancel, onViewTickets }) => {
    const { event, tickets, status, id } = booking;
    const isCancelled = status === 'CANCELLED';

    const dateStr = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });

    const hasTickets = booking.ticketsList?.length > 0;

    return (
        <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--gray-200)',
            borderRadius: 14,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            opacity: isCancelled ? 0.65 : 1,
            boxShadow: 'var(--shadow-xs)',
            transition: 'box-shadow .2s',
        }}>
            {/* Left color strip / image */}
            <div style={{ width: 6, background: isCancelled ? 'var(--danger)' : 'var(--brand)', flexShrink: 0 }} />

            {/* Image */}
            <div style={{ width: 120, flexShrink: 0, display: 'flex' }}>
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: isCancelled ? 'grayscale(60%)' : 'none' }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%', minHeight: 100,
                        background: 'var(--brand-surface)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Calendar size={28} color="var(--brand)" strokeWidth={1.5} />
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.3, margin: 0 }}>
                        {event.title}
                    </h3>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '3px 10px', borderRadius: 999, flexShrink: 0,
                        fontSize: '0.72rem', fontWeight: 700,
                        background: isCancelled ? 'var(--danger-surface)' : 'var(--success-surface)',
                        color: isCancelled ? 'var(--danger)' : 'var(--success)',
                    }}>
                        {status}
                    </span>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        <Calendar size={12} color="var(--brand)" /> {dateStr}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        <MapPin size={12} color="var(--brand)" /> {event.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        <Ticket size={12} color="var(--brand)" /> {tickets} ticket{tickets !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Footer: price + actions */}
                <div style={{
                    marginTop: 'auto',
                    paddingTop: 12,
                    borderTop: '1px solid var(--gray-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        Total:&nbsp;
                        <span style={{ fontWeight: 800, color: 'var(--gray-900)', fontSize: '1rem' }}>
                            ${(event.price * tickets).toFixed(2)}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {!isCancelled && hasTickets && onViewTickets && (
                            <button
                                onClick={() => onViewTickets(booking)}
                                className="btn btn-primary btn-sm"
                                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                <Download size={13} /> View & Download Tickets
                            </button>
                        )}
                        {!isCancelled && onCancel && (
                            <button
                                onClick={() => onCancel(id)}
                                className="btn btn-outline btn-sm"
                                style={{ color: 'var(--danger)', borderColor: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 5 }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-surface)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
