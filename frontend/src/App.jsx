import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyBookings from './pages/MyBookings';
import Checkout from './pages/Checkout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateEvent from './pages/admin/CreateEvent';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;

    if (!user) return <Navigate to="/login" />;

    if (requireAdmin && user.role !== 'ADMIN') {
        return <Navigate to="/" />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetails />} />

                    <Route path="/my-bookings" element={
                        <ProtectedRoute>
                            <MyBookings />
                        </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/events/create" element={
                        <ProtectedRoute requireAdmin={true}>
                            <CreateEvent />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
            <footer className="footer">
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <span className="brand" style={{ fontSize: '1rem' }}>
                        <span style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 800, marginRight: 6 }}>E</span>
                        EventSphere
                    </span>
                    <p className="footer-text">© {new Date().getFullYear()} EventSphere. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: 16 }}>
                        {[['Events', '/events'], ['My Bookings', '/my-bookings'], ['Login', '/login']].map(([label, to]) => (
                            <Link key={to} to={to} style={{ fontSize: '0.825rem', color: 'var(--gray-500)', transition: 'color .2s', textDecoration: 'none' }}
                                onMouseEnter={e => e.target.style.color = 'var(--gray-900)'}
                                onMouseLeave={e => e.target.style.color = 'var(--gray-500)'}
                            >{label}</Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;
