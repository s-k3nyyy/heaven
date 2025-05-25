import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Container, Avatar,
  Switch, FormControlLabel, Stack, Divider
} from '@mui/material';

function Settings() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleTwoFAToggle = () => {
    setTwoFAEnabled(!twoFAEnabled);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleLogout = async () => {
    try {
      // Optional: Notify backend
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
  
      // Clear local data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
  
      // Redirect
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  

  return (
    <Box
      sx={{
        height: '100vh',
        overflowY: 'auto',
        padding: 4,
        backgroundColor: '#f5f5f5',
        marginLeft: '240px', // Adjust this to your sidebar width
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Admin Settings
        </Typography>

        {/* Profile Picture Upload */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar
            src={profileImage}
            sx={{ width: 100, height: 100, margin: '0 auto' }}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 1 }}
          >
            Upload Profile Picture
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Basic Info */}
        <Typography variant="h6" gutterBottom>
          Profile Details
        </Typography>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <TextField label="Full Name" fullWidth />
          <TextField label="Email Address" fullWidth />
          <TextField label="Phone Number" fullWidth />
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* 2FA Toggle */}
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <FormControlLabel
          control={<Switch checked={twoFAEnabled} onChange={handleTwoFAToggle} />}
          label="Enable Two-Factor Authentication"
        />

        <Divider sx={{ my: 4 }} />

        {/* Logout */}
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
        >
          Log Outttt
        </Button>
      </Container>
    </Box>
  );
}

export default Settings;




