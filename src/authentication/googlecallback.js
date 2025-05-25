// Updated GoogleCallback.js
import { useEffect, useState } from 'react';
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const { user, isLoaded } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('Processing authentication...');
  const navigate = useNavigate();

  // Function to check user role in database
  const checkUserRole = async (email) => {
    try {
      const response = await fetch('/api/check-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User role from database:', data.role);
        return data.role; // 'donor' or 'admin'
      }
      console.log('User not found in database');
      return null;
    } catch (error) {
      console.error('Error checking user role:', error);
      return null;
    }
  };

  // Function to create user in database if they don't exist
  const createUserInDatabase = async (email, firstName, lastName, role) => {
    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          role,
          userId: user.id
        }),
      });
      
      if (response.ok) {
        console.log('User created successfully with role:', role);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Failed to create user:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  };

  useEffect(() => {
    const handleUserRedirect = async () => {
      if (!isLoaded || !user || isProcessing) return;
      
      setIsProcessing(true);
      setStatus('Checking user account...');

      try {
        const email = user.primaryEmailAddress?.emailAddress;
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';

        console.log('Processing user:', email);

        if (!email) {
          console.error('No email found');
          setStatus('Error: No email found');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Check if user exists in database
        let userRole = await checkUserRole(email);
        
        if (!userRole) {
          setStatus('Creating new account...');
          // User doesn't exist in database, get selected role from localStorage
          const selectedRole = localStorage.getItem('selectedRole') || 'donor';
          console.log('Creating new user with role:', selectedRole);
          
          // Create user in database with selected role
          const created = await createUserInDatabase(email, firstName, lastName, selectedRole);
          
          if (created) {
            userRole = selectedRole;
            setStatus('Account created successfully!');
          } else {
            console.error('Failed to create user in database');
            setStatus('Failed to create account. Please try again.');
            setTimeout(() => navigate('/login'), 2000);
            return;
          }
        } else {
          setStatus('Account found. Logging in...');
        }

        console.log('Final user role:', userRole);

        // Store user role for session
        localStorage.setItem('userRole', userRole);
        
        // Clean up temporary selected role
        localStorage.removeItem('selectedRole');

        // Small delay for better UX
        setTimeout(() => {
          // Redirect based on role
          if (userRole === 'donor') {
            console.log('Redirecting to /home');
            navigate('/home', { replace: true });
          } else if (userRole === 'admin') {
            console.log('Redirecting to /orphanageDashboard');
            navigate('/orphanageDashboard', { replace: true });
          } else {
            console.error('Unknown user role:', userRole);
            navigate('/login', { replace: true });
          }
        }, 1000);

      } catch (error) {
        console.error('Error in user redirect:', error);
        setStatus('Authentication failed. Redirecting...');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    };

    handleUserRedirect();
  }, [user, isLoaded, navigate, isProcessing]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '18px', marginBottom: '10px' }}>{status}</div>
      <div style={{ fontSize: '14px', color: '#666' }}>
        Please wait while we set up your account...
      </div>
      <div style={{ 
        marginTop: '20px', 
        width: '50px', 
        height: '50px', 
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <AuthenticateWithRedirectCallback
        afterSignInUrl="/google-callback"
        afterSignUpUrl="/google-callback"
        signInFallbackRedirectUrl="/login"
        signUpFallbackRedirectUrl="/login"
        handleError={(error) => {
          console.error("Authentication Error:", error);
          setStatus('Authentication error occurred');
          setTimeout(() => navigate('/login'), 2000);
        }}
      />
    </div>
  );
};

export default GoogleCallback;
