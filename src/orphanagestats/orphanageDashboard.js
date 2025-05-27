import '../App.css';
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Box, CssBaseline, Typography, Grid, Card, CardContent,
  Avatar
} from "@mui/material";

const DashboardPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const getUserInitials = () => {
    if (!user || !user.name) return 'AD';
    const nameParts = user.name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    } else {
      return (
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      );
    }
  };

  const getUserFullName = () => user?.name || 'Admin User';
  const getUserFirstName = () => (user?.name ? user.name.trim().split(' ')[0] : 'Admin');

  const getJoinDate = () => {
    if (!user?.created_at) return 'January 2025';
    try {
      const date = new Date(user.created_at);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch {
      return 'January 2025';
    }
  };

  return (
    <>
      {/* Avatar & Info Section */}
      <Card
        sx={{
          mb: 5,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          boxShadow: '0 8px 20px rgba(252, 182, 159, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        <Avatar
          sx={{
            width: 90,
            height: 90,
            bgcolor: '#7f5539',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            boxShadow: '0 0 12px rgba(127, 85, 57, 0.7)',
            border: '3px solid #fff',
          }}
        >
          {getUserInitials()}
        </Avatar>

        <Box>
          <Typography variant="h5" fontWeight="700" sx={{ color: '#7f5539' }}>
            {getUserFullName()}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#7f5539', mb: 0.5 }}>
            Admin — Managing since {getJoinDate()}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#6b4a2a', fontStyle: 'italic', mb: 1 }}
          >
            Overseeing operations and making a difference
          </Typography>
          {user?.email && (
            <Typography variant="body2" sx={{ color: '#7f5539', fontWeight: '500' }}>
              {user.email}
            </Typography>
          )}
        </Box>
      </Card>

      {/* Greeting Section */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ color: '#4a342e' }}>
          Welcome back, {getUserFirstName()}! 👋🏾
        </Typography>
        <Typography variant="h6" sx={{ color: '#7f5539', mt: 1 }}>
          Manage donations, sponsorships, and more.
        </Typography>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={4} justifyContent="center" sx={{ px: 2 }}>
        {[ 'Donations', 'Sponsorships' , 'Reports' ].map((title, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                backgroundColor: '#fff',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                },
                height: 150,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" fontWeight="600" color="#7f5539">
                {title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const DonationsPage = () => (
  <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
    <Typography variant="h4" gutterBottom>Donations</Typography>
    <Typography>Manage all donations and financial contributions.</Typography>
  </Box>
);

const SponsorshipsPage = () => (
  <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
    <Typography variant="h4" gutterBottom>Sponsorships</Typography>
    <Typography>Manage sponsor relationships and programs.</Typography>
  </Box>
);

const EmailPage = () => (
  <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
    <Typography variant="h4" gutterBottom>Email Management</Typography>
    <Typography>View and send emails to contacts.</Typography>
  </Box>
);

const ReportsPage = () => (
  <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
    <Typography variant="h4" gutterBottom>Reports</Typography>
    <Typography>Generate and view financial and activity reports.</Typography>
  </Box>
);

const SettingsPage = () => (
  <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
    <Typography variant="h4" gutterBottom>Settings</Typography>
    <Typography>Customize your dashboard experience.</Typography>
  </Box>
);

const OrphanageDashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFF7F0",
        minHeight: "100vh",
        pb: 5,
      }}
    >
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: 10 }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sponsorshipspage" element={<SponsorshipsPage />} />
          <Route path="/email" element={<EmailPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default OrphanageDashboard;
