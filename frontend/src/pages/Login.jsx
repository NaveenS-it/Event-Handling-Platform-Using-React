import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-16 px-6" style={{ background: 'var(--bg)' }}>
            <div className="max-w-md w-full">
                <div className="card shadow-md rounded-xl p-10" style={{ background: 'var(--surface)', borderColor: 'var(--gray-200)' }}>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--gray-900)' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--gray-500)' }} className="text-balance">
                            Don't have an account? <Link to="/register" className="font-medium text-primary hover:text-secondary transition">Sign up</Link>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-danger/20 text-danger p-4 rounded-xl mb-8 text-sm text-center font-medium border border-danger/30">
                            {error}
                        </div>
                    )}

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-bold mb-3" style={{ color: 'var(--gray-900)' }}>Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                                    <Mail className="h-6 w-6 text-gray-400" />
                                </div>
                                <input
                                    type="email" required
                                    className="w-full px-5 py-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)', borderColor: 'var(--gray-200)' }}
                                    placeholder="you@example.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-3" style={{ color: 'var(--gray-900)' }}>Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                                    <Lock className="h-6 w-6 text-gray-400" />
                                </div>
                                <input
                                    type="password" required
                                    className="w-full px-5 py-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)', borderColor: 'var(--gray-200)' }}
                                    placeholder="••••••••"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full btn btn-primary py-4 font-bold text-lg shadow-lg hover:shadow-xl rounded-xl">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
