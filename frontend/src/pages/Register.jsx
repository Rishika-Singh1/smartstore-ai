import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-white">
              Smart<span className="text-accent">Store</span> AI
            </h1>
            <p className="text-gray-400 text-sm mt-1">Create your store account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Store Name</label>
              <input
                type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="My Awesome Store" className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email</label>
              <input
                type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@store.com" className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Password</label>
              <input
                type="password" required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters" className="w-full"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}