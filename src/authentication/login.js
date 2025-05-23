import '../App.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useSignIn } from '@clerk/clerk-react';

function LogIn() {
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState('donor'); // Default role
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => { event.preventDefault(); };
  const handleMouseUpPassword = (event) => { event.preventDefault(); };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setUserRole(newRole);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      const signInAttempt = await signIn.create({ identifier: email });

      const result = await signInAttempt.attemptFirstFactor({
        strategy: "password",
        password: password,
      });

      if (result.status === "complete") {
        // Redirect based on role
        /*   if (userRole === 'donor') { */
            window.location.href='/home';
        /*   } else {
            navigate('/OrphanageDashboard');
          }
         */
      } else {
        setError("Invalid credentials. Please try again.");
      }
   } catch (err) {
  console.error("Clerk error:", err);
  if (err.errors && err.errors.length > 0) {
    setError(err.errors[0].message); // Short message (like "Invalid password.")
  } else {
    setError("Unexpected error. Please try again.");
  }
}
  };

  if (!isLoaded) return null;

  return (
    <div className="signup">
      <div className="signup-image">
        <img alt="Log in pic" src="/signupimage.jpg" />
      </div>

      <div className="signup-form">
        <h1>Welcome back! 👋</h1>

        {/* Toggle Button for User Role Selection */}
        <ToggleButtonGroup
          color="primary"
          value={userRole}
          exclusive
          onChange={handleRoleChange}
          aria-label="User Role"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="donor">Donor</ToggleButton>
          <ToggleButton value="orphanage">Orphanage</ToggleButton>
        </ToggleButtonGroup>

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
          autoComplete="off"
        >
          <TextField
            label={userRole === 'donor' ? "Email" : "Orphanage Email"}
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
                    aria-label={showPassword ? 'hide password' : 'show password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          {error && <div style={{ color: 'red', marginLeft: 8 }}>{error}</div>}

          <Button variant="contained" type="submit">
            Log in as {userRole === 'donor' ? "Donor" : "Orphanage"}
          </Button>

          <Button variant="contained" onClick={() => {signIn.authenticateWithRedirect({ strategy: "oauth_google", redirectUrl: "/home", }); setError("Redirecting to Google login...");}}
            >Log in with Google</Button>
        </Box>

        <span style={{ display: 'block', marginTop: '10px' }}>
          Don’t have an account?{' '}
          <Link to="/signup" style={{ color: '#000000', textDecoration: 'none' }}>
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
}

export default LogIn;
