import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import authService from '../api/authService';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [message, setMessage] = useState(''); // For messages like "Check your email to confirm registration"

  const navigate = useNavigate();
  const location = useLocation(); // To get query params

  useEffect(() => {
    // Check for session on component mount
    // If user is already logged in, redirect to dashboard
    const checkSession = async () => {
      const session = await authService.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkSession();

    // Display messages from query params (e.g., after session expiry redirect)
    const queryParams = new URLSearchParams(location.search);
    const msg = queryParams.get('message');
    if (msg) {
        setMessage(msg); // Display message
        // Optionally clear the message from URL
        // navigate(location.pathname, { replace: true });
    }

  }, [navigate, location]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        // Using email as username for simplicity, can add a username field if needed
        await authService.signUp(email, password, { username: email.split('@')[0] });
        setMessage('Registration successful! Please check your email to confirm your account if email confirmation is enabled.');
        // Optionally, redirect to login or show message to check email
        // For now, user can switch to login form
        setIsRegistering(false); // Switch to login form after registration attempt
      } else {
        const { data } = await authService.signInWithPassword(email, password);
        if (data.session && data.user) {
          navigate('/dashboard');
        } else {
          // This case should ideally be handled by the error in signInWithPassword
          setError('Login failed. Please check your credentials.');
        }
      }
    } catch (err) {
      setError(err.message || `An error occurred during ${isRegistering ? 'registration' : 'login'}.`);
      console.error(`${isRegistering ? 'Registration' : 'Login'} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h2>{isRegistering ? 'Register New Account' : 'Trainer Login'}</h2>
        {message && <p className="info-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (isRegistering ? 'Registering...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>
        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError(''); // Clear errors when switching forms
            setMessage('');
          }}
          className="toggle-form-button"
        >
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
