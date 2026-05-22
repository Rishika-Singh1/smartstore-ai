import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import {
  AuthProvider,
  useAuth,
} from './context/AuthContext';

import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AIContent from './pages/AIContent';
import AIInsights from './pages/AIInsights';

// Protected Route
const PrivateRoute = ({ children }) => {

  const { user } = useAuth();

  return user

    ? children

    : <Navigate to="/login" />;

};

// Public Route
const PublicRoute = ({ children }) => {

  const { user } = useAuth();

  return !user

    ? children

    : <Navigate to="/" />;

};

export default function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <Toaster

          position="bottom-right"

          toastOptions={{

            style: {

              background: '#181c27',

              color: '#e8eaf0',

              border: '1px solid #2a2f45',

              fontSize: '13px',

            },

            success: {

              iconTheme: {

                primary: '#00d4aa',

                secondary: '#181c27',

              },

            },

            error: {

              iconTheme: {

                primary: '#ff5f6d',

                secondary: '#181c27',

              },

            },

          }}

        />

        <Routes>

          {/* Public Routes */}

          <Route

            path="/login"

            element={

              <PublicRoute>

                <Login />

              </PublicRoute>

            }

          />

          <Route

            path="/register"

            element={

              <PublicRoute>

                <Register />

              </PublicRoute>

            }

          />

          {/* Private Routes */}

          <Route

            path="/"

            element={

              <PrivateRoute>

                <Layout />

              </PrivateRoute>

            }

          >

            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="products"
              element={<Products />}
            />

            <Route
              path="ai-content"
              element={<AIContent />}
            />

            <Route
              path="ai-insights"
              element={<AIInsights />}
            />

          </Route>

        </Routes>

      </BrowserRouter>

    </AuthProvider>

  );

}