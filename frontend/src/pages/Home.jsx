import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { ArrowRight, Zap, ShieldCheck, Globe, Star } from 'lucide-react';

const features = [
    { icon: Zap, title: 'Instant Booking', desc: 'Reserve tickets in under 30 seconds with our streamlined checkout flow.' },
    { icon: ShieldCheck, title: 'Secure Payments', desc: 'All transactions are protected with industry-standard encryption.' },
    { icon: Globe, title: 'Discover Locally', desc: 'Find concerts, conferences, and sports events happening near you.' },
];

const Home = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/events')
            .then(r => setFeaturedEvents(r.data.slice(0, 3)))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="hero">
                <div className="container">
                    <div style={{ maxWidth: 640 }}>
                        <div className="hero-label">
                            <Star size={12} fill="currentColor" /> #1 Event Booking Platform
                        </div>
                        <h1 className="hero-title text-balance">
                            Discover &amp; Book<br />
                            <span style={{ color: 'var(--brand)' }}>Unforgettable Events</span>
                        </h1>
                        <p className="hero-sub">
                            From sold-out concerts to exclusive conferences — find every event in one place and book your spot in seconds.
                        </p>
                        <div className="hero-actions">
                            <Link to="/events" className="btn btn-primary btn-xl">
                                Browse Events <ArrowRight size={16} />
                            </Link>
                            <Link to="/register" className="btn btn-outline btn-xl">
                                Create Account
                            </Link>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                        {['No hidden fees', 'Instant confirmation', 'Free cancellation'].map(t => (
                            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <ShieldCheck size={14} color="var(--success)" />
                                <span style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--gray-600)' }}>{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Events ────────────────────────────────── */}
            <section className="section" style={{ background: 'var(--bg)' }}>
                <div className="container">
                    <div className="flex-between section-header">
                        <div>
                            <p className="section-label">Handpicked for you</p>
                            <h2 className="section-title">Featured Events</h2>
                            <p className="section-sub">Don't miss the most anticipated experiences this season.</p>
                        </div>
                        <Link to="/events" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex-center" style={{ height: 240 }}>
                            <div className="spinner" />
                        </div>
                    ) : featuredEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--gray-400)' }}>
                            <p>No events found. Check back soon!</p>
                            <Link to="/admin/events/create" className="btn btn-primary" style={{ marginTop: 20 }}>Create First Event</Link>
                        </div>
                    ) : (
                        <div className="grid-3">
                            {featuredEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Feature Strip ──────────────────────────────────── */}
            <section className="section-sm" style={{ background: 'var(--surface)', borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} style={{ display: 'flex', gap: 16 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                    background: 'var(--brand-surface)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Icon size={18} color="var(--brand)" />
                                </div>
                                <div>
                                    <h5 style={{ marginBottom: 4 }}>{title}</h5>
                                    <p style={{ fontSize: '0.85rem' }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────── */}
            <section className="section">
                <div className="container">
                    <div style={{
                        background: 'linear-gradient(135deg, var(--brand) 0%, #6366f1 100%)',
                        borderRadius: 20, padding: '56px 48px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 24, flexWrap: 'wrap'
                    }}>
                        <div>
                            <h2 style={{ color: 'white', marginBottom: 8 }}>Ready to find your next adventure?</h2>
                            <p style={{ color: 'rgba(255,255,255,.75)', margin: 0 }}>
                                Join thousands of event-goers who book with EventSphere every day.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                            <Link to="/register" style={{
                                background: 'var(--surface)', color: 'var(--brand)',
                                padding: '12px 28px', borderRadius: 10,
                                fontWeight: 700, fontSize: '0.95rem',
                                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6
                            }}>
                                Get started free <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
