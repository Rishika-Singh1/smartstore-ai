import { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import toast from 'react-hot-toast';

export default function Login() {

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {

    event.preventDefault();

    setLoading(true);

    try {

      await login(
        form.email,
        form.password
      );

      toast.success('Welcome back!');

      navigate('/');

    } catch (error) {

      toast.error(

        error.response?.data?.message

        || 'Login failed'

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-bg flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="card">

          {/* Header */}

          <div className="mb-8">

            <h1 className="font-display text-2xl font-bold text-white">

              Smart
              <span className="text-accent">Store</span>
              {' '}
              AI

            </h1>

            <p className="text-gray-400 text-sm mt-1">

              Sign in to your store dashboard

            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Email */}

            <div>

              <label className="block text-xs text-gray-400 mb-1.5">

                Email

              </label>

              <input

                type="email"

                required

                value={form.email}

                onChange={(event) =>

                  setForm({

                    ...form,

                    email: event.target.value,

                  })

                }

                placeholder="you@store.com"

                className="w-full"

              />

            </div>

            {/* Password */}

            <div>

              <label className="block text-xs text-gray-400 mb-1.5">

                Password

              </label>

              <input

                type="password"

                required

                value={form.password}

                onChange={(event) =>

                  setForm({

                    ...form,

                    password: event.target.value,

                  })

                }

                placeholder="••••••••"

                className="w-full"

              />

            </div>

            {/* Submit */}

            <button

              type="submit"

              disabled={loading}

              className="btn-primary w-full mt-2"

            >

              {loading

                ? 'Signing in...'

                : 'Sign In'}

            </button>

          </form>

          {/* Footer */}

          <p className="text-center text-sm text-gray-500 mt-5">

            Don't have an account?

            {' '}

            <Link
              to="/register"
              className="text-accent hover:underline"
            >

              Sign up

            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}