import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, Calendar, Users, ArrowLeft } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const data = sessionStorage.getItem('booking_tickets');
        if (!data) {
            navigate('/events');
            return;
        }
        setBookingData(JSON.parse(data));
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Mapping bookingData to what bookingController expects
            const payload = {
                eventId: bookingData.event_id,
                tickets: bookingData.total_tickets,
                selectedTiers: bookingData.tickets // array of { tierId, tierName, quantity, price }
            };

            await api.post('/bookings', payload);
            setSuccess('Payment successful! Redirecting to dashboard...');
            sessionStorage.removeItem('booking_tickets');

            setTimeout(() => {
                navigate('/my-bookings');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    if (!bookingData) return null;

    const totalAmount = bookingData.tickets
        ? bookingData.tickets.reduce((sum, t) => sum + (t.price * t.quantity), 0)
        : (bookingData.event_price * bookingData.total_tickets);

    return (
        <div className="min-h-screen py-16">
            <div className="container max-w-lg mx-auto px-6">
                <button onClick={() => navigate(-1)} className="flex items-center hover:text-primary mb-10 font-medium transition group" style={{ color: 'var(--gray-500)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft className="h-5 w-5 mr-3 transform group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="card shadow-sm rounded-xl p-10" style={{ background: 'var(--surface)' }}>
                    <div className="text-center mb-10">
                        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full mb-6 border border-gray-200" style={{ background: 'var(--surface)' }}>
                            <CreditCard className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--gray-900)' }}>Secure Checkout</h2>
                        <p style={{ color: 'var(--gray-500)' }} className="text-balance">Complete your booking payment</p>
                    </div>

                    {error && <div className="bg-danger/20 text-danger p-4 rounded-xl mb-8 text-sm font-medium border border-danger/30">{error}</div>}
                    {success && <div className="bg-success/20 text-success p-4 rounded-xl mb-8 text-sm font-medium border border-success/30">{success}</div>}

                    <div className="p-8 rounded-2xl border border-gray-200 mb-10 space-y-6" style={{ background: 'var(--gray-50)' }}>
                        <div className="flex justify-between items-center text-sm font-medium" style={{ color: 'var(--gray-500)' }}>
                            <span className="flex items-center"><Calendar className="h-5 w-5 mr-3 text-primary" /> Event</span>
                            <span className="font-semibold" style={{ color: 'var(--gray-900)' }}>{bookingData.event_title}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium" style={{ color: 'var(--gray-500)' }}>
                            <span className="flex items-center"><Users className="h-5 w-5 mr-3 text-primary" /> Tickets</span>
                            <span className="font-semibold" style={{ color: 'var(--gray-900)' }}>{bookingData.total_tickets}</span>
                        </div>
                        <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
                            <span className="font-bold text-lg" style={{ color: 'var(--gray-900)' }}>Total to Pay</span>
                            <span className="text-3xl font-extrabold text-primary">${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-3" style={{ color: 'var(--gray-900)' }}>Cardholder Name</label>
                            <input type="text" className="w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg" style={{ background: 'var(--surface)', color: 'var(--gray-900)', borderColor: 'var(--gray-200)' }} placeholder="John Doe" required />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-3" style={{ color: 'var(--gray-900)' }}>Card Number</label>
                            <input type="text" className="w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg" style={{ background: 'var(--surface)', color: 'var(--gray-900)', borderColor: 'var(--gray-200)' }} placeholder="0000 0000 0000 0000" maxLength="19" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-3" style={{ color: 'var(--gray-900)' }}>Expiry Date</label>
                                <input type="text" className="w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg" style={{ background: 'var(--surface)', color: 'var(--gray-900)', borderColor: 'var(--gray-200)' }} placeholder="MM/YY" maxLength="5" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-3" style={{ color: 'var(--gray-900)' }}>CVV</label>
                                <input type="text" className="w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg" style={{ background: 'var(--surface)', color: 'var(--gray-900)', borderColor: 'var(--gray-200)' }} placeholder="123" maxLength="4" required />
                            </div>
                        </div>

                        <button type="submit" disabled={loading || success} className="w-full btn btn-primary py-5 font-bold text-xl rounded-xl shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center mt-8">
                            {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div> : null}
                            {loading ? 'Processing Payment...' : `Pay $${totalAmount.toFixed(2)}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
