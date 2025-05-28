import '../App.css'
import { useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Alert from "@mui/material/Alert";

function SignUp () {
    const { signUp, isLoaded } = useSignUp();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); 
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState('donor'); // default role

    const handleRoleChange = (event, newRole) => {
         if (newRole !== null) {
             setUserRole(newRole);
         }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

    // Direct backend registration (alternative to Clerk)
    const handleBackendSignUp = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Validation
        if (!firstname.trim()) {
            setError("First Name is required.");
            setIsSubmitting(false);
            return;
        }
        if (!lastname.trim()) {
            setError("Last Name is required.");
            setIsSubmitting(false);
            return;
        }
        if (!email.includes("@")) {
            setError("Invalid email format.");
            setIsSubmitting(false);
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Register user directly with your Flask backend
            const response = await fetch('https://ideal-sniffle-1y3k.onrender.com/api/auth/register ', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${firstname} ${lastname}`,
                    email: email,
                    password: password,
                    phone: phone || null,
                    role: userRole
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful
                console.log("✅ User registered successfully:", data);
                
                // Store user data if needed
                localStorage.setItem('registrationSuccess', JSON.stringify({
                    email: email,
                    role: userRole,
                    message: data.message
                }));

                // Navigate based on role
                if (userRole === 'donor') {
                    navigate('/login', { 
                        state: { 
                            message: 'Account created successfully! Please log in.',
                            email: email 
                        } 
                    });
                } else {
                    navigate('/login', { 
                        state: { 
                            message: 'Admin account created successfully! Please log in.',
                            email: email 
                        } 
                    });
                }
            } else {
                // Registration failed
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error("❌ Registration error:", err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hybrid approach: Clerk + Backend
    const handleClerkWithBackendSignUp = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!isLoaded) {
            setError("Clerk is loading, please wait");
            setIsSubmitting(false);
            return;
        }

        // Validation
        if (!firstname.trim()) {
            setError("First Name is required.");
            setIsSubmitting(false);
            return;
        }
        if (!lastname.trim()) {
            setError("Last Name is required.");
            setIsSubmitting(false);
            return;
        }
        if (!email.includes("@")) {
            setError("Invalid email format.");
            setIsSubmitting(false);
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Step 1: Register with your Flask backend first
            const backendResponse = await fetch('https://ideal-sniffle-1y3k.onrender.com/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${firstname} ${lastname}`,
                    email: email,
                    password: password,
                    phone: phone || null,
                    role: userRole
                })
            });

            const backendData = await backendResponse.json();

            if (!backendResponse.ok) {
                throw new Error(backendData.error || 'Backend registration failed');
            }

            // Step 2: Sign up with Clerk (optional, for additional features)
            const clerkResult = await signUp.create({
                firstName: firstname,
                lastName: lastname,
                emailAddress: email,
                password,
            });

            // Step 3: Attach metadata to Clerk
            await signUp.update({
                publicMetadata: { 
                    role: userRole,
                    backendUserId: backendData.user?.id 
                },
            });

            // Step 4: Save signup data
            localStorage.setItem('signupData', JSON.stringify({
                firstName: firstname,
                lastName: lastname,
                email,
                role: userRole,
                userId: clerkResult.id,
                backendUserId: backendData.user?.id
            }));

            // Step 5: Trigger email verification (if using Clerk verification)
            await signUp.prepareVerification({ strategy: "email_code" });

            // Step 6: Navigate to verify page or directly to login
            navigate("/verify");

        } catch (err) {
            console.error("❌ Signup error:", err);
            setError(err.message || "An unexpected error occurred during signup");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogle = async () => {
        if (!isLoaded) {
            setError("Clerk is loading, please wait");
            return;
        }

        try {
            // Store the selected role for Google signup
            localStorage.setItem('googleSignupRole', userRole);
            
            await signUp.authenticateWithRedirect({ 
                strategy: 'oauth_google',
                redirectUrl: "http://localhost:3000/googlecallback",
                redirectUrlComplete: "http://localhost:3000/home"
            });
        }
        catch (error){
            setError(error.message);
            console.error("Error during Google sign up:", error);
        }
    }

    return (
        <div className="signup">
            <div className="signup-image">
                <img alt='Log in pic' src="/signupimage.jpg"/>
            </div>
            <div className="signup-form">
                <h1>Create an account </h1> 
                <ToggleButtonGroup
                    color="primary"
                    value={userRole}
                    exclusive
                    onChange={handleRoleChange}
                    aria-label="User Role"
                    sx={{ mb: 2 }}
                >
                    <ToggleButton value="donor">Donor</ToggleButton>
                    <ToggleButton value="admin">Orphanage</ToggleButton>
                </ToggleButtonGroup>

                {error && <Alert severity="error">{error}</Alert>}

                <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleBackendSignUp} // Using direct backend registration
                >
                    <TextField 
                        label="First Name" 
                        type='text' 
                        value={firstname} 
                        variant="outlined" 
                        onChange={(e) => setFirstname(e.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                    <TextField 
                        label="Last Name" 
                        type='text' 
                        value={lastname} 
                        variant="outlined" 
                        onChange={(e) => setLastname(e.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                    <TextField 
                        label="Email" 
                        type='email' 
                        value={email} 
                        variant="outlined" 
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        required
                    /> 
                    <TextField 
                        label="Phone (Optional)" 
                        type='tel' 
                        value={phone} 
                        variant="outlined" 
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            label="Password" 
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                            required
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                        disabled={isSubmitting}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <Button 
                        type='submit' 
                        variant="contained"
                        disabled={isSubmitting}
                        fullWidth
                    >
                        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={handleGoogle}
                        disabled={isSubmitting}
                        fullWidth
                    >
                        Sign Up with Google
                    </Button>
                </Box>
                <span style={{ display: 'block', marginTop: '10px' }}>
                    Have an account? <Link to="/login" style={{ color: '#000000', textDecoration: 'none' }}>Log in</Link>
                </span>
            </div>
        </div>
    )
}

export default SignUp;