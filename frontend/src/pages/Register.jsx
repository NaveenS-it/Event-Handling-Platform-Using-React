import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Shield } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
            <div className="max-w-md w-full">
                <div className="card shadow-sm rounded-xl p-8" style={{ background: 'var(--surface)', borderColor: 'var(--gray-200)' }}>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold" style={{ color: 'var(--gray-900)' }}>Create Account</h2>
                        <p className="mt-2 text-sm" style={{ color: 'var(--gray-500)' }}>
                            Already have an account? <Link to="/login" className="font-medium text-primary hover:text-secondary">Sign in</Link>
                        </p>
                    </div>

                    {error && <div className="bg-danger/20 text-danger p-3 rounded-lg mb-6 text-sm text-center font-medium border border-danger/30">{error}</div>}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--gray-900)' }}>Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text" name="name" required
                                    className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)', borderColor: 'var(--gray-200)' }}
                                    placeholder="John Doe"
                                    value={formData.name} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--gray-900)' }}>Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email" name="email" required
                                    className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)', borderColor: 'var(--gray-200)' }}
                                    placeholder="you@example.com"
                                    value={formData.email} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--gray-900)' }}>Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password" name="password" required
                                    className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    style={{ background: 'var(--surface)', color: 'var(--gray-900)', borderColor: 'var(--gray-200)' }}
                                    placeholder="••••••••"
                                    value={formData.password} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-900)' }}>Account Type</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.role === 'USER' ? 'bg-primary/20 border-primary text-primary font-semibold' : 'border-gray-200 hover:bg-glass-border'}`} style={formData.role !== 'USER' ? { background: 'var(--surface)', color: 'var(--gray-500)' } : {}}>
                                    <input type="radio" name="role" value="USER" className="sr-only" checked={formData.role === 'USER'} onChange={handleChange} />
                                    User
                                </label>
                                <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.role === 'ADMIN' ? 'bg-primary/20 border-primary text-primary font-semibold' : 'border-gray-200 hover:bg-glass-border'}`} style={formData.role !== 'ADMIN' ? { background: 'var(--surface)', color: 'var(--gray-500)' } : {}}>
                                    <Shield className={`w-4 h-4 mr-2 ${formData.role === 'ADMIN' ? 'text-primary' : 'text-gray-400'}`} />
                                    <input type="radio" name="role" value="ADMIN" className="sr-only" checked={formData.role === 'ADMIN'} onChange={handleChange} />
                                    Admin
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="w-full btn btn-primary py-3 font-bold text-lg shadow-md hover:shadow-lg mt-4">
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
