import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import BookingCard from '../components/BookingCard';
import { Ticket, AlertCircle, X, Download, Printer, Calendar, MapPin, Hash, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/* ─── Single Ticket Slide (inside modal) ─────────────────────── */
const TicketSlide = ({ ticket, event, bookingRef, index, total }) => (
    <div
        id={`ticket-slide-${ticket.id}`}
        style={{
            background: 'var(--surface)',
            border: '1px solid var(--gray-200)',
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: index < total - 1 ? 16 : 0,
            boxShadow: 'var(--shadow-sm)',
        }}
    >
        {/* Colored top bar */}
        <div style={{
            background: 'linear-gradient(135deg, var(--brand) 0%, #6366f1 100%)',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        }}>
            <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,.7)', marginBottom: 4 }}>
                    EventSphere · Ticket {index + 1} of {total}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                    {event.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.8)', marginTop: 4 }}>
                    {ticket.tierName && `${ticket.tierName} · `}
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
            <CheckCircle size={28} color="rgba(255,255,255,.9)" style={{ flexShrink: 0, marginTop: 2 }} />
        </div>

        {/* Dashed separator */}
        <div style={{
            borderTop: '2px dashed var(--gray-200)',
            margin: '0 20px',
            position: 'relative',
        }}>
            {/* Left notch */}
            <div style={{ position: 'absolute', left: -30, top: -10, width: 20, height: 20, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--gray-200)' }} />
            {/* Right notch */}
            <div style={{ position: 'absolute', right: -30, top: -10, width: 20, height: 20, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--gray-200)' }} />
        </div>

        {/* Ticket body */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
            {/* Left: details */}
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--gray-400)', marginBottom: 2 }}>Location</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <MapPin size={12} color="var(--brand)" />{event.location}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--gray-400)', marginBottom: 2 }}>Booking Reference</div>
                        <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--gray-700)', fontFamily: 'monospace', letterSpacing: '.04em' }}>
                            {bookingRef}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--gray-400)', marginBottom: 2 }}>Ticket Code</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gray-600)', fontFamily: 'monospace', letterSpacing: '.04em' }}>
                            {ticket.ticketCode}
                        </div>
                    </div>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 999,
                        background: 'var(--success-surface)', color: 'var(--success)',
                        fontSize: '0.72rem', fontWeight: 700
                    }}>
                        <CheckCircle size={11} /> VALID
                    </div>
                </div>
            </div>

            {/* Right: QR code */}
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 12,
                    padding: 8,
                    display: 'inline-block',
                    boxShadow: 'var(--shadow-xs)',
                }}>
                    <img
                        src={ticket.qrCodeData}
                        alt="QR Code"
                        width={110}
                        height={110}
                        style={{ display: 'block' }}
                    />
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', marginTop: 6, fontWeight: 500 }}>
                    Scan to verify
                </div>
            </div>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════ */
const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const ticketAreaRef = useRef(null);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const r = await api.get('/bookings/my');
            setBookings(r.data);
        } catch (e) {
            console.error('Failed to fetch bookings', e);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Cancel this booking? This cannot be undone.')) return;
        try {
            await api.delete(`/bookings/${bookingId}`);
            fetchBookings();
        } catch (e) {
            alert(e.response?.data?.message || 'Failed to cancel booking');
        }
    };

    /* ── Download as PDF ── */
    const handleDownloadPDF = async () => {
        if (!ticketAreaRef.current || !selectedBooking) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(ticketAreaRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: getComputedStyle(document.documentElement)
                    .getPropertyValue('--surface').trim() || '#ffffff',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const margin = 12;
            const availW = pageW - margin * 2;
            const imgH = (canvas.height / canvas.width) * availW;

            // Header
            pdf.setFillColor(79, 70, 229);
            pdf.rect(0, 0, pageW, 18, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.text('EventSphere — Your Tickets', margin, 12);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Downloaded: ${new Date().toLocaleString()}`, pageW - margin, 12, { align: 'right' });

            // Ticket image
            const startY = 24;
            if (imgH + startY > pageH - 20) {
                // Multi-page if very long
                let yOffset = 0;
                while (yOffset < imgH) {
                    const sliceH = Math.min(pageH - startY - 10, imgH - yOffset);
                    pdf.addImage(imgData, 'PNG', margin, startY, availW, sliceH, '', 'FAST', 0, yOffset / imgH);
                    yOffset += sliceH;
                    if (yOffset < imgH) pdf.addPage();
                }
            } else {
                pdf.addImage(imgData, 'PNG', margin, startY, availW, imgH);
            }

            // Footer
            const lastPage = pdf.internal.getCurrentPageInfo().pageNumber;
            for (let i = 1; i <= lastPage; i++) {
                pdf.setPage(i);
                pdf.setFontSize(7);
                pdf.setTextColor(150);
                pdf.text(
                    `Booking Ref: ${selectedBooking.bookingReference}   ·   Page ${i} of ${lastPage}`,
                    pageW / 2, pageH - 6, { align: 'center' }
                );
            }

            const safeName = selectedBooking.event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            pdf.save(`eventsphere_ticket_${safeName}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
            alert('Could not generate PDF. Try printing instead.');
        } finally {
            setDownloading(false);
        }
    };

    /* ── Print handler ── */
    const handlePrint = () => window.print();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 24px' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <>
            {/* ── Print stylesheet injected inline ── */}
            <style>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #ticket-print-zone, #ticket-print-zone * { visibility: visible !important; }
                    #ticket-print-zone { position: fixed; inset: 0; background: white; padding: 24px; }
                }
            `}</style>

            <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 0' }}>
                <div className="container" style={{ maxWidth: 760 }}>

                    {/* Page header */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: 'var(--brand-surface)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Ticket size={20} color="var(--brand)" />
                            </div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-900)', margin: 0 }}>
                                My Bookings
                            </h1>
                        </div>
                        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginLeft: 50 }}>
                            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <AlertCircle size={28} color="var(--gray-400)" />
                            </div>
                            <h3 style={{ marginBottom: 8 }}>No bookings yet</h3>
                            <p style={{ marginBottom: 24 }}>Time to find your next event!</p>
                            <Link to="/events" className="btn btn-primary">Explore Events</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {bookings.map(booking => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onCancel={handleCancelBooking}
                                    onViewTickets={setSelectedBooking}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════ TICKET MODAL ══════════════ */}
            {selectedBooking && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px',
                    background: 'rgba(0,0,0,.55)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                }}>
                    <div style={{
                        background: 'var(--bg)',
                        borderRadius: 20,
                        width: '100%',
                        maxWidth: 560,
                        maxHeight: '92vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-xl)',
                        border: '1px solid var(--gray-200)',
                    }}>
                        {/* Modal header */}
                        <div style={{
                            padding: '18px 24px',
                            borderBottom: '1px solid var(--gray-200)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--surface)',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Ticket size={18} color="var(--brand)" />
                                <span style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '1rem' }}>
                                    Your Tickets
                                </span>
                                <span style={{
                                    background: 'var(--brand-surface)', color: 'var(--brand)',
                                    fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999
                                }}>
                                    {selectedBooking.ticketsList?.length || 0} ticket{(selectedBooking.ticketsList?.length || 0) !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                style={{
                                    width: 32, height: 32, borderRadius: 8, border: '1px solid var(--gray-200)',
                                    background: 'transparent', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)',
                                }}
                                title="Close"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Scrollable ticket area — this gets captured for PDF */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                            <div ref={ticketAreaRef} id="ticket-print-zone">
                                {/* Event title row */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    marginBottom: 16,
                                    padding: '12px 16px',
                                    background: 'var(--surface)',
                                    border: '1px solid var(--gray-200)',
                                    borderRadius: 12,
                                }}>
                                    <Calendar size={15} color="var(--brand)" />
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.9rem' }}>
                                            {selectedBooking.event.title}
                                        </div>
                                        <div style={{ fontSize: '0.775rem', color: 'var(--gray-500)' }}>
                                            {selectedBooking.event.location} &nbsp;·&nbsp;
                                            {new Date(selectedBooking.event.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--gray-500)' }}>
                                        <Hash size={11} />{selectedBooking.bookingReference}
                                    </div>
                                </div>

                                {/* Ticket slides */}
                                {selectedBooking.ticketsList?.map((t, i) => (
                                    <TicketSlide
                                        key={t.id}
                                        ticket={t}
                                        event={selectedBooking.event}
                                        bookingRef={selectedBooking.bookingReference}
                                        index={i}
                                        total={selectedBooking.ticketsList.length}
                                    />
                                ))}

                                {(!selectedBooking.ticketsList || selectedBooking.ticketsList.length === 0) && (
                                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>
                                        <Ticket size={32} style={{ margin: '0 auto 12px', opacity: .5 }} />
                                        <p style={{ fontSize: '0.875rem' }}>No ticket details available.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action footer */}
                        <div style={{
                            padding: '16px 20px',
                            borderTop: '1px solid var(--gray-200)',
                            background: 'var(--surface)',
                            display: 'flex',
                            gap: 10,
                            flexShrink: 0,
                        }}>
                            {/* Download PDF — primary action */}
                            <button
                                onClick={handleDownloadPDF}
                                disabled={downloading || !selectedBooking.ticketsList?.length}
                                className="btn btn-primary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                            >
                                {downloading ? (
                                    <>
                                        <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                                        Generating PDF…
                                    </>
                                ) : (
                                    <>
                                        <Download size={15} /> Download PDF
                                    </>
                                )}
                            </button>

                            {/* Print */}
                            <button
                                onClick={handlePrint}
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                                title="Print tickets"
                            >
                                <Printer size={15} /> Print
                            </button>

                            {/* Close */}
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="btn btn-ghost"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyBookings;
