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
        const [isSubmitting, setIsSubmitting] = useState(false);

       
        const [error,setError] = useState(null);

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

        const handleSignUp = async (e) => {
            e.preventDefault();
          
            if (!isLoaded) {
              setError("Clerk is loading, please wait");
              return;
            }
          
            // Basic form validation
            if (!firstname.trim()) {
              setError("First Name is required.");
              return;
            }
            if (!lastname.trim()) {
              setError("Last Name is required.");
              return;
            }
            if (!email.includes("@")) {
              setError("Invalid email format.");
              return;
            }
            if (password.length < 8) {
              setError("Password must be at least 8 characters.");
              return;
            }
          
            try {
              // 1. Create Clerk user
              const result = await signUp.create({
                firstName: firstname,
                lastName: lastname,
                emailAddress: email,
                password,
              });

              // Then immediately update the metadata
                  await signUp.update({
                    publicMetadata: {
                      role: userRole
                    }
                  });
          
              // 3. Trigger email verification
              await signUp.prepareVerification({ strategy: "email_code" });
          
              // 4. Navigate to verification page
              window.location.href = "http://localhost:3000/verify";
            } catch (err) {
              console.error("Error during Signup:", err);
              setError(err.errors?.[0]?.message || "An error occurred during signup");
              setIsSubmitting(false);
            }
          };
          

        const handleGoogle = async () => {
            if (!isLoaded) {
                setError("Clerk is loading, please wait");
                return;
              }
        
            try {
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
                    onSubmit={handleSignUp}
                >
                    <TextField label="First Name" type='name' value={firstname} variant="outlined" onChange={(e) => setFirstname(e.target.value)} />
                    <TextField label="Last Name" type='name' value={lastname} variant="outlined" onChange={(e) => setLastname(e.target.value)}/>
                    <TextField label="Email" type= 'email' value={email} variant="outlined" onChange={(e) => setEmail(e.target.value)}/> 
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            label="Password" 
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <Button type='submit' variant="contained">Sign Up</Button>
                    <Button variant="contained" onClick={handleGoogle}>Sign Up with Google</Button>
                </Box>
                <span style={{ display: 'block', marginTop: '10px' }}>
                    Have an account? <Link to="/login" style={{ color: '#000000', textDecoration: 'none' }}>Log in</Link>
                </span>
            </div>
        </div>
    )
}

export default SignUp;