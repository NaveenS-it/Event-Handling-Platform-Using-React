import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        price: '', // base price
        imageUrl: ''
    });
    const [ticketTiers, setTicketTiers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTierChange = (index, field, value) => {
        const newTiers = [...ticketTiers];
        newTiers[index][field] = value;
        setTicketTiers(newTiers);
    };

    const addTicketTier = () => {
        setTicketTiers([...ticketTiers, { name: '', price: '', quantity: '' }]);
    };

    const removeTicketTier = (index) => {
        const newTiers = ticketTiers.filter((_, i) => i !== index);
        setTicketTiers(newTiers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = { ...formData, ticketTiers };
            await api.post('/events', payload);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16">
            <div className="container max-w-4xl">
                <Link to="/admin" className="flex items-center hover:text-primary mb-10 font-medium transition group" style={{ color: 'var(--gray-500)', textDecoration: 'none' }}>
                    <ArrowLeft className="h-5 w-5 mr-3 transform group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>

                <div className="card shadow-sm rounded-xl p-10" style={{ background: 'var(--surface)' }}>
                    <h1 className="text-4xl font-extrabold mb-10 border-b border-gray-200 pb-6 text-center" style={{ color: 'var(--gray-900)' }}>Create New Event</h1>

                    {error && <div className="bg-danger/20 text-danger p-4 rounded-xl mb-8 text-sm font-medium border border-danger/30">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-bold mb-4" style={{ color: 'var(--gray-900)' }}>Event Title</label>
                                <input
                                    type="text" name="title" required
                                    className="w-full px-6 py-4 border border-gray-200 rounded-xl placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xl"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                    placeholder="e.g. Summer Music Festival"
                                    value={formData.title} onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-4" style={{ color: 'var(--gray-900)' }}>Date & Time</label>
                                <input
                                    type="datetime-local" name="date" required
                                    className="w-full px-6 py-4 border border-gray-200 rounded-xl placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                    value={formData.date} onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-4" style={{ color: 'var(--gray-900)' }}>Base Ticket Price ($)</label>
                                <input
                                    type="number" name="price" step="0.01" min="0" required={ticketTiers.length === 0}
                                    className="w-full px-6 py-4 border border-gray-200 rounded-xl placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                    placeholder="0.00"
                                    value={formData.price} onChange={handleChange}
                                />
                                <p className="text-sm mt-2" style={{ color: 'var(--gray-400)' }}>Used if no ticket tiers are defined.</p>
                            </div>

                            <div className="lg:col-span-2">
                                <label className="block text-sm font-bold mb-4" style={{ color: 'var(--gray-900)' }}>Location/Venue</label>
                                <input
                                    type="text" name="location" required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                    placeholder="e.g. Central Park, New York"
                                    value={formData.location} onChange={handleChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--gray-900)' }}>Image URL (Optional)</label>
                                <input
                                    type="url" name="imageUrl"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.imageUrl} onChange={handleChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--gray-900)' }}>Event Description</label>
                                <textarea
                                    name="description" required rows="5"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                    placeholder="Provide details about what attendees can expect..."
                                    value={formData.description} onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        {/* Ticket Tiers Section matching the logic of addTicketTier() */}
                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold" style={{ color: 'var(--gray-900)' }}>Ticket Tiers</h3>
                                <button type="button" onClick={addTicketTier} className="btn btn-outline py-2 px-4">
                                    + Add Tier
                                </button>
                            </div>

                            <div className="space-y-3" id="ticketTiersContainer">
                                {ticketTiers.map((tier, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-gray-200" style={{ background: 'var(--gray-50)' }}>
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-400)' }}>Tier Name</label>
                                            <input
                                                type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                                placeholder="e.g. VIP" required
                                                value={tier.name} onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="w-full sm:w-32">
                                            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-400)' }}>Price ($)</label>
                                            <input
                                                type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                                placeholder="50.00" required
                                                value={tier.price} onChange={(e) => handleTierChange(index, 'price', e.target.value)}
                                            />
                                        </div>
                                        <div className="w-full sm:w-32">
                                            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-400)' }}>Quantity</label>
                                            <input
                                                type="number" min="1" className="w-full px-3 py-2 border border-gray-200 rounded-lg placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                style={{ background: 'var(--surface)', color: 'var(--gray-900)' }}
                                                placeholder="100" required
                                                value={tier.quantity} onChange={(e) => handleTierChange(index, 'quantity', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                type="button" onClick={() => removeTicketTier(index)}
                                                className="h-[38px] px-3 border border-danger text-danger rounded-lg hover:bg-danger/10 transition"
                                                style={{ background: 'transparent' }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {ticketTiers.length === 0 && (
                                    <p className="text-sm text-center py-4 border border-dashed border-gray-200 rounded-xl" style={{ background: 'var(--surface)', color: 'var(--gray-400)' }}>No ticket tiers added. Base price will be used.</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200 mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary text-lg px-8 py-3 flex items-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div> : <Save className="h-5 w-5" />}
                                {loading ? 'Publishing...' : 'Publish Event'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
