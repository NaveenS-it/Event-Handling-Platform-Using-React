import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
    LayoutDashboard, Users, Ticket, CalendarPlus,
    Trash2, TrendingUp, ArrowUpRight, Search,
    ChevronRight, MoreHorizontal, AlertCircle
} from 'lucide-react';

/* ─── Stat Card ───────────────────────────────────────────── */
const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, sub }) => (
    <div className="stat-card">
        <div className="flex-between">
            <div>
                <p className="stat-label">{label}</p>
                <p className="stat-value">{value}</p>
                {sub && <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 6 }}>{sub}</p>}
            </div>
            <div className="stat-icon" style={{ background: iconBg }}>
                <Icon size={20} color={iconColor} />
            </div>
        </div>
    </div>
);

/* ─── Status Badge ────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        CONFIRMED: ['badge-success', 'Confirmed'],
        CANCELLED: ['badge-danger', 'Cancelled'],
        ADMIN: ['badge-brand', 'Admin'],
        USER: ['badge-gray', 'User'],
    };
    const [cls, label] = map[status] || ['badge-gray', status];
    return <span className={`badge ${cls}`}>{label}</span>;
};

/* ─── Empty State ─────────────────────────────────────────── */
const Empty = ({ msg }) => (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--gray-400)' }}>
        <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: .5 }} />
        <p style={{ fontSize: '0.875rem' }}>{msg}</p>
    </div>
);

/* ─── Loading Spinner ─────────────────────────────────────── */
const Loading = () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
        <div className="spinner" />
    </div>
);

/* ═══════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchData(); }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const [re, rb, ru] = await Promise.all([
                    api.get('/events'),
                    api.get('/admin/bookings'),
                    api.get('/admin/users'),
                ]);
                setEvents(re.data); setBookings(rb.data); setUsers(ru.data);
            } else if (activeTab === 'events') {
                const r = await api.get('/events'); setEvents(r.data);
            } else if (activeTab === 'bookings') {
                const r = await api.get('/admin/bookings'); setBookings(r.data);
            } else if (activeTab === 'users') {
                const r = await api.get('/admin/users'); setUsers(r.data);
            }
        } catch (e) {
            console.error('Fetch failed', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Delete this event? This cannot be undone.')) return;
        try {
            await api.delete(`/events/${id}`);
            fetchData();
        } catch (e) {
            alert(e.response?.data?.message || 'Failed to delete event');
        }
    };

    /* Derived stats */
    const totalRevenue = bookings.reduce((sum, b) => sum + ((b.event?.price || 0) * b.tickets), 0);
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase())
    );
    const filteredBookings = bookings.filter(b =>
        b.user?.name.toLowerCase().includes(search.toLowerCase()) ||
        b.event?.title.toLowerCase().includes(search.toLowerCase())
    );
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    /* Sidebar items */
    const navItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'events', icon: CalendarPlus, label: 'Manage Events' },
        { id: 'bookings', icon: Ticket, label: 'Bookings' },
        { id: 'users', icon: Users, label: 'Users' },
    ];

    return (
        <div className="admin-layout">
            {/* ── Sidebar ── */}
            <aside className="sidebar">
                <p className="sidebar-section-label">Main</p>
                {navItems.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        className={`sidebar-item ${activeTab === id ? 'active' : ''}`}
                        onClick={() => { setActiveTab(id); setSearch(''); }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                            <Icon size={16} />
                            {label}
                        </span>
                    </button>
                ))}

                <div style={{ borderTop: '1px solid var(--gray-200)', margin: '16px 0 12px', paddingTop: 16 }}>
                    <p className="sidebar-section-label">Quick Actions</p>
                    <Link
                        to="/admin/events/create"
                        className="sidebar-item"
                        style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--brand)', fontWeight: 600 }}
                    >
                        <CalendarPlus size={16} /> Create Event
                    </Link>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="admin-content">

                {/* ══ OVERVIEW ══════════════════════════════════════ */}
                {activeTab === 'overview' && (
                    <>
                        <div className="admin-page-header">
                            <h2 className="admin-page-title">Dashboard</h2>
                            <p className="admin-page-sub">Welcome back — here's what's happening with EventSphere today.</p>
                        </div>

                        {loading ? <Loading /> : (
                            <>
                                {/* Stat row */}
                                <div className="grid-4" style={{ marginBottom: 28 }}>
                                    <StatCard icon={CalendarPlus} iconBg="var(--brand-surface)" iconColor="var(--brand)"
                                        label="Total Events" value={events.length} sub="All time" />
                                    <StatCard icon={Ticket} iconBg="var(--success-surface)" iconColor="var(--success)"
                                        label="Confirmed Bookings" value={confirmedBookings}
                                        sub={`${bookings.length} total`} />
                                    <StatCard icon={Users} iconBg="var(--brand-surface)" iconColor="var(--brand)"
                                        label="Registered Users" value={users.length} sub="All time" />
                                    <StatCard icon={TrendingUp} iconBg="var(--warning-surface)" iconColor="var(--warning)"
                                        label="Total Revenue" value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                        sub="Estimated" />
                                </div>

                                {/* Recent events + recent bookings */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                    {/* Recent Events */}
                                    <div className="card">
                                        <div className="card-header">
                                            <span className="card-title">Recent Events</span>
                                            <button className="btn btn-ghost btn-sm"
                                                onClick={() => setActiveTab('events')}
                                                style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                View all <ChevronRight size={14} />
                                            </button>
                                        </div>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Event</th>
                                                        <th>Date</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {events.slice(0, 5).map(ev => (
                                                        <tr key={ev.id}>
                                                            <td style={{ fontWeight: 600, color: 'var(--gray-900)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</td>
                                                            <td>{new Date(ev.date).toLocaleDateString()}</td>
                                                            <td style={{ fontWeight: 600 }}>${ev.price}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {events.length === 0 && <Empty msg="No events yet." />}
                                        </div>
                                    </div>

                                    {/* Recent Bookings */}
                                    <div className="card">
                                        <div className="card-header">
                                            <span className="card-title">Recent Bookings</span>
                                            <button className="btn btn-ghost btn-sm"
                                                onClick={() => setActiveTab('bookings')}
                                                style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                View all <ChevronRight size={14} />
                                            </button>
                                        </div>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>User</th>
                                                        <th>Event</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bookings.slice(0, 5).map(b => (
                                                        <tr key={b.id}>
                                                            <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{b.user?.name}</td>
                                                            <td style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray-500)' }}>{b.event?.title}</td>
                                                            <td><StatusBadge status={b.status} /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {bookings.length === 0 && <Empty msg="No bookings yet." />}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* ══ EVENTS ════════════════════════════════════════ */}
                {activeTab === 'events' && (
                    <>
                        <div className="flex-between admin-page-header">
                            <div>
                                <h2 className="admin-page-title">Events</h2>
                                <p className="admin-page-sub">{events.length} total events</p>
                            </div>
                            <Link to="/admin/events/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <CalendarPlus size={16} /> Create Event
                            </Link>
                        </div>

                        {/* Search */}
                        <div style={{ marginBottom: 16, position: 'relative', maxWidth: 360 }}>
                            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                            <input
                                className="form-input"
                                placeholder="Search events…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ paddingLeft: 34 }}
                            />
                        </div>

                        <div className="card">
                            {loading ? <Loading /> : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Event</th>
                                                <th>Location</th>
                                                <th>Date</th>
                                                <th>Price</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredEvents.map((ev, i) => (
                                                <tr key={ev.id}>
                                                    <td style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{i + 1}</td>
                                                    <td>
                                                        <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{ev.title}</span>
                                                    </td>
                                                    <td style={{ color: 'var(--gray-500)' }}>{ev.location}</td>
                                                    <td style={{ color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>{new Date(ev.date).toLocaleDateString()}</td>
                                                    <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>${ev.price}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: 6 }}>
                                                            <Link
                                                                to={`/events/${ev.id}`}
                                                                className="btn btn-ghost btn-sm"
                                                                style={{ fontSize: '0.78rem' }}
                                                            >View</Link>
                                                            <button
                                                                onClick={() => handleDeleteEvent(ev.id)}
                                                                className="btn btn-danger btn-sm"
                                                                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                                                            >
                                                                <Trash2 size={13} /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredEvents.length === 0 && <Empty msg="No events match your search." />}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ══ BOOKINGS ══════════════════════════════════════ */}
                {activeTab === 'bookings' && (
                    <>
                        <div className="admin-page-header">
                            <h2 className="admin-page-title">Bookings</h2>
                            <p className="admin-page-sub">{bookings.length} total bookings</p>
                        </div>

                        <div style={{ marginBottom: 16, position: 'relative', maxWidth: 360 }}>
                            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                            <input className="form-input" placeholder="Search by user or event…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
                        </div>

                        <div className="card">
                            {loading ? <Loading /> : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Event</th>
                                                <th>Tickets</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBookings.map(b => (
                                                <tr key={b.id}>
                                                    <td>
                                                        <div style={{ fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.3 }}>{b.user?.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{b.user?.email}</div>
                                                    </td>
                                                    <td style={{ color: 'var(--gray-600)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.event?.title}</td>
                                                    <td>
                                                        <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{b.tickets}</span>
                                                    </td>
                                                    <td><StatusBadge status={b.status} /></td>
                                                    <td style={{ color: 'var(--gray-500)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                                                        {new Date(b.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredBookings.length === 0 && <Empty msg="No bookings match your search." />}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ══ USERS ═════════════════════════════════════════ */}
                {activeTab === 'users' && (
                    <>
                        <div className="admin-page-header">
                            <h2 className="admin-page-title">Users</h2>
                            <p className="admin-page-sub">{users.length} registered users</p>
                        </div>

                        <div style={{ marginBottom: 16, position: 'relative', maxWidth: 360 }}>
                            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                            <input className="form-input" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
                        </div>

                        <div className="card">
                            {loading ? <Loading /> : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(u => (
                                                <tr key={u.id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <div style={{
                                                                width: 32, height: 32, borderRadius: '50%',
                                                                background: 'var(--brand-surface)', color: 'var(--brand)',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontWeight: 700, fontSize: '0.8rem', flexShrink: 0
                                                            }}>
                                                                {u.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ color: 'var(--gray-500)' }}>{u.email}</td>
                                                    <td><StatusBadge status={u.role} /></td>
                                                    <td style={{ color: 'var(--gray-500)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredUsers.length === 0 && <Empty msg="No users match your search." />}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
