import '../App.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  Button
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSignIn } from '@clerk/clerk-react';

function LogIn() {
  const { signIn, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      const signInAttempt = await signIn.create({ identifier: email });

      const result = await signInAttempt.attemptFirstFactor({
        strategy: 'password',
        password,
      });

      if (result.status === 'complete') {
        const res = await fetch('http://localhost:5000/api/userrole', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
          if (data.role === 'donor') {
            console.log("✅ Donor logged in");
            navigate('/home');
          } else if (data.role === 'admin') {
            console.log("✅ Admin logged in");
            navigate('/orphanageDashboard');
          } else {
            setError("Unknown user role.");
          }
        } else {
          setError(data.message || "Unable to determine user role.");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.errors?.[0]?.message || "Unexpected error. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: '/home' // Your backend should handle role-based redirect
    });
    setError("Redirecting to Google login...");
  };

  if (!isLoaded) return null;

  return (
    <div className="signup">
      <div className="signup-image">
        <img alt="Log in" src="/signupimage.jpg" />
      </div>

      <div className="signup-form">
        <h1>Welcome back! 👋</h1>

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
          autoComplete="off"
        >
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          {error && (
            <div style={{ color: 'red', marginLeft: 8, fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <Button variant="contained" type="submit" fullWidth>
            Log in
          </Button>

          <Button variant="outlined" onClick={handleGoogleLogin} fullWidth>
            Log in with Google
          </Button>
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
