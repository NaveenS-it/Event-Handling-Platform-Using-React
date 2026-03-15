import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Calendar, Ticket, LogOut, LayoutDashboard,
    ChevronDown, Sun, Moon, Monitor
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { theme, toggle } = useTheme();
    const [dropOpen, setDropOpen] = useState(false);

    const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
    const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System';

    const handleLogout = () => {
        logout();
        navigate('/login');
        setDropOpen(false);
    };

    return (
        <header className="header">
            <div className="container">
                <nav className="navbar">

                    {/* ── Brand ── */}
                    <Link to="/" className="brand">
                        <span style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: 'var(--brand)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: '0.85rem', fontWeight: 800,
                            flexShrink: 0
                        }}>E</span>
                        EventSphere
                    </Link>

                    {/* ── Center Nav Links ── */}
                    <div className="nav-links">
                        <NavLink to="/events" className={({ isActive }) => isActive ? 'active' : ''}>
                            <Calendar size={14} /> Browse Events
                        </NavLink>

                        {user?.role === 'ADMIN' && (
                            <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
                                <LayoutDashboard size={14} /> Dashboard
                            </NavLink>
                        )}

                        {user && (
                            <NavLink to="/my-bookings" className={({ isActive }) => isActive ? 'active' : ''}>
                                <Ticket size={14} /> My Bookings
                            </NavLink>
                        )}
                    </div>

                    {/* ── Right Actions ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                        {/* Theme Toggle */}
                        <button
                            className="theme-toggle"
                            onClick={toggle}
                            title={`Theme: ${themeLabel} — click to cycle`}
                            aria-label="Toggle colour theme"
                        >
                            <ThemeIcon size={16} />
                        </button>

                        {user ? (
                            <div style={{ position: 'relative' }}>
                                {/* User button */}
                                <button
                                    className="nav-user-btn"
                                    onClick={() => setDropOpen(o => !o)}
                                    aria-haspopup="true"
                                    aria-expanded={dropOpen}
                                >
                                    <span className="nav-avatar">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                    <span style={{
                                        maxWidth: 110,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {user.name}
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        style={{
                                            color: 'var(--gray-400)',
                                            transform: dropOpen ? 'rotate(180deg)' : 'none',
                                            transition: 'transform .2s'
                                        }}
                                    />
                                </button>

                                {/* Dropdown */}
                                {dropOpen && (
                                    <div className="nav-dropdown">
                                        <div className="nav-dropdown-header">
                                            <div className="nav-dropdown-name">{user.name}</div>
                                            <div className="nav-dropdown-role">{user.role}</div>
                                        </div>

                                        <Link
                                            to="/my-bookings"
                                            className="nav-dropdown-item"
                                            onClick={() => setDropOpen(false)}
                                        >
                                            <Ticket size={14} /> My Bookings
                                        </Link>

                                        {user.role === 'ADMIN' && (
                                            <Link
                                                to="/admin"
                                                className="nav-dropdown-item"
                                                onClick={() => setDropOpen(false)}
                                            >
                                                <LayoutDashboard size={14} /> Admin Dashboard
                                            </Link>
                                        )}

                                        {/* Theme toggle inside dropdown too */}
                                        <button
                                            className="nav-dropdown-item"
                                            onClick={() => { toggle(); }}
                                        >
                                            <ThemeIcon size={14} />
                                            {themeLabel} mode
                                        </button>

                                        <div style={{ height: 1, background: 'var(--gray-100)', margin: '4px 0' }} />

                                        <button
                                            className="nav-dropdown-item danger"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={14} /> Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Sign up free</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>

            {/* Backdrop to close dropdown */}
            {dropOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 200 }}
                    onClick={() => setDropOpen(false)}
                    aria-hidden="true"
                />
            )}
        </header>
    );
};

export default Navbar;
