import '../App.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  Button,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSignIn } from '@clerk/clerk-react';

function LogIn() {
  const { signIn, isLoaded } = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state.email) {
        setEmail(location.state.email);
      }
    }

    // Check localStorage for registration success
    const regSuccess = localStorage.getItem('registrationSuccess');
    if (regSuccess) {
      const data = JSON.parse(regSuccess);
      setSuccessMessage(data.message || 'Registration successful! Please log in.');
      if (data.email) {
        setEmail(data.email);
      }
      localStorage.removeItem('registrationSuccess');
    }
  }, [location]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Direct backend login - FIXED VERSION
  const handleBackendLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Please enter your email and password.");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('🔄 Attempting login for:', email);

      const response = await fetch('https://ideal-sniffle-1y3k.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();
      console.log('📦 Login response:', data);

      if (response.ok && data.success) {
        // Login successful
        console.log("✅ User logged in successfully:", data);

        // Clear any existing user data first
        localStorage.removeItem('user');
        localStorage.removeItem('user_data');
        localStorage.removeItem('userId');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Store user data in the format expected by Home component
        if (data.user) {
          // Store as 'user' (what Home component looks for)
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Also store user ID separately for quick access
          localStorage.setItem('userId', data.user.id.toString());
          
          // Store login timestamp
          localStorage.setItem('loginTime', new Date().toISOString());

          console.log('💾 User data stored:', {
            user: data.user,
            userId: data.user.id
          });
        }

        // Store tokens if they exist
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }

        // Navigate based on user role
        if (data.user.role === 'donor') {
          console.log("✅ Donor logged in, redirecting to /home");
          navigate('/home');
        } else if (data.user.role === 'admin') {
          console.log("✅ Admin logged in, redirecting to admin dashboard");
          navigate('/orphanageDashboard');
        } else {
          console.log("✅ User logged in, defaulting to /home");
          navigate('/home');
        }
      } else {
        // Login failed
        console.log("❌ Login failed:", data);
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hybrid login (Clerk + Backend) - UPDATED VERSION
  const handleHybridLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Please enter your email and password.");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('🔄 Attempting hybrid login for:', email);

      // Step 1: Login with backend first
      const backendResponse = await fetch('https://ideal-sniffle-1y3k.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const backendData = await backendResponse.json();

      if (!backendResponse.ok || !backendData.success) {
        throw new Error(backendData.error || "Invalid credentials");
      }

      // Step 2: Login with Clerk (optional)
      if (isLoaded && signIn) {
        try {
          const signInAttempt = await signIn.create({ identifier: email });
          const clerkResult = await signInAttempt.attemptFirstFactor({
            strategy: 'password',
            password,
          });

          if (clerkResult.status !== 'complete') {
            console.warn("Clerk login incomplete, but backend login successful");
          }
        } catch (clerkError) {
          console.warn("Clerk login failed, but backend login successful:", clerkError);
          // Continue with backend login even if Clerk fails
        }
      }

      // Step 3: Clear and store user data properly
      localStorage.removeItem('user');
      localStorage.removeItem('user_data');
      localStorage.removeItem('userId');

      if (backendData.user) {
        localStorage.setItem('user', JSON.stringify(backendData.user));
        localStorage.setItem('userId', backendData.user.id.toString());
        localStorage.setItem('loginTime', new Date().toISOString());
      }

      // Step 4: Store tokens if they exist
      if (backendData.access_token) {
        localStorage.setItem('access_token', backendData.access_token);
      }
      if (backendData.refresh_token) {
        localStorage.setItem('refresh_token', backendData.refresh_token);
      }

      // Step 5: Navigate based on role
      if (backendData.user.role === 'donor') {
        console.log("✅ Donor logged in");
        navigate('/home');
      } else if (backendData.user.role === 'admin') {
        console.log("✅ Admin logged in");
        navigate('/orphanageDashboard');
      } else {
        navigate('/home');
      }

    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!isLoaded || !signIn) {
      setError("Authentication service not ready. Please try again.");
      return;
    }

    try {
      signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: '/home' // Your backend should handle role-based redirect
      });
      setError("Redirecting to Google login...");
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    console.log('🔍 LocalStorage Debug:');
    console.log('user:', localStorage.getItem('user'));
    console.log('userId:', localStorage.getItem('userId'));
    console.log('user_data:', localStorage.getItem('user_data'));
    console.log('access_token:', localStorage.getItem('access_token'));
  };

  return (
    <div className="signup">
      <div className="signup-image">
        <img alt="Log in" src="/signupimage.jpg" />
      </div>

      <div className="signup-form">
        <h1>Welcome back! 👋</h1>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleBackendLogin} // Using direct backend login
          sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
          autoComplete="off"
        >
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          {error && (
            <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Alert>
          )}

          <Button 
            variant="contained" 
            type="submit" 
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </Button>

          <Button 
            variant="outlined" 
            onClick={handleGoogleLogin} 
            fullWidth
            disabled={isSubmitting}
          >
            Log in with Google
          </Button>

          {/* Debug button - remove in production */}
        
        </Box>

        <span style={{ display: 'block', marginTop: '10px' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#000000', textDecoration: 'none' }}>
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
}

export default LogIn;