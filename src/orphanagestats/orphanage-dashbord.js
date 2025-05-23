import '../App.css';
import React, { useState } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import {
  Box, CssBaseline, Typography, Grid, Card, CardContent,
  Button, TextField, Avatar
} from "@mui/material";
import { useUser } from '@clerk/clerk-react'; // Add this import

// Page components
const DashboardPage = () => {
  const { user } = useUser(); // Add this hook

  return (
    <>
      {/* Add Avatar Section at Top - similar to donor dashboard */}
      <Card sx={{ mb: 4, backgroundColor: '#DEA385', borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                backgroundColor: '#4A573A',
                border: '3px solid #C4B1CF'
              }}
            >
              {user?.firstName?.charAt(0)?.toUpperCase() || 'A'}
              {user?.lastName?.charAt(0)?.toUpperCase() || 'D'}
            </Avatar>
            <Box sx={{ ml: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#4A573A' }}>
                {user?.firstName || 'Admin'} {user?.lastName || 'User'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#4A573A' }}>
                Administrator Dashboard - Managing since January 2025
              </Typography>
              <Typography variant="body2" sx={{ color: '#4A573A', mt: 1 }}>
                Overseeing operations and making a difference
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h4">Welcome back 👋🏾 </Typography>
      <Typography variant="body1">Manage donations, sponsorships, and more.</Typography>
      
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {["Total Donations", "Total Sponsorships", "Messages Received", "Reports Generated"].map((title, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              backgroundColor: "#000000", 
              color: "#000000",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
            }}>
              <CardContent sx={{ backgroundColor: "#FFFFFF" }}>
                <Typography variant="h6" sx={{ color: "#000000" }}>{title}</Typography>
                <Typography variant="h4" sx={{ color: "#000000" }}>
                  {index === 0 ? "429" : index === 1 ? "852" : index === 2 ? "387" : "304"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Messaging System */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Send a Message</Typography>
        <TextField fullWidth label="Message" multiline rows={4} sx={{ my: 2 }} />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#9AA27D",
            '&:hover': { backgroundColor: "#8c9b6f" }
          }}
        >
          Send
        </Button>
      </Box>
    </>
  );
};

const DonationsPage = () => {
  return (
    <div>
      <Typography variant="h4">Donations</Typography>
      <Typography variant="body1">Manage all donations and financial contributions.</Typography>
      {/* Additional donations content would go here */}
    </div>
  );
};

const SponsorshipsPage = () => {
  return (
    <div>
      <Typography variant="h4">Sponsorships</Typography>
      <Typography variant="body1">Manage sponsor relationships and programs.</Typography>
      {/* Additional sponsorships content would go here */}
    </div>
  );
};

const EmailPage = () => {
  return (
    <div>
      <Typography variant="h4">Email Management</Typography>
      <Typography variant="body1">View and send emails to contacts.</Typography>
      {/* Additional email content would go here */}
    </div>
  );
};

const ReportsPage = () => {
  return (
    <div>
      <Typography variant="h4">Reports</Typography>
      <Typography variant="body1">Generate and view financial and activity reports.</Typography>
      {/* Additional reports content would go here */}
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div>
      <Typography variant="h4">Settings</Typography>
      <Typography variant="body1">Customize your dashboard experience.</Typography>
      {/* Additional settings content would go here */}
    </div>
  );
};

const OrphanageDashboard = () => {
  return (
    <Box sx={{ display: "flex", backgroundColor: "#E4AC80", minHeight: "100vh" }}>
      <CssBaseline />
    
      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
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