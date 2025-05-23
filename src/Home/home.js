import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar,
  Toolbar, 
  CssBaseline,
} from '@mui/material';
// Import Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SettingsIcon from '@mui/icons-material/Settings';
import ExploreIcon from '@mui/icons-material/Explore';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useUser } from '@clerk/clerk-react';

import FavoriteIcon from '@mui/icons-material/Favorite';

const navLinks = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { text: 'Donation Page', path: '/donationpage', icon: <CardGiftcardIcon /> },
  { text: 'Sponsor a Kid', path: '/sponsorakid', icon: <ChildCareIcon /> },
  { text: 'Explore', path: '/explore2', icon: <ExploreIcon /> },
  { text: 'Reports', path: '/reports', icon: <AssessmentIcon /> },
  { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const Home = () => {
  const [activeItem, setActiveItem] = useState('/');
  const { user } = useUser();

  const handleNavClick = (path) => {
    setActiveItem(path);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Main Content */}
      <Box component="main" sx={{ 
        maxWidth: '900px', 
        width: '100%', 
        p: 3, 
        backgroundColor: '#f5f5f5',
        mx: 'auto' // margin auto for horizontal centering
      }}>
        <Toolbar />
        
        {/* Avatar Section at Top */}
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
                {user.firstName.charAt(0).toUpperCase()}
                {user.lastName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ ml: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#4A573A' }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#4A573A' }}>
                  Welcome back! You've been a donor since January 2025
                </Typography>
                <Typography variant="body2" sx={{ color: '#4A573A', mt: 1 }}>
                  Your kindness has touched 3 lives so far
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: '#4A573A' }}>Dashboard Overview</Typography>

        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#DEA385', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#4A573A' }}>Total Donated</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#4A573A' }}>KSh 10,000.00</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#DEA385', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#4A573A' }}>Total Donations</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#4A573A' }}>3</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#DEA385', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#4A573A' }}>Kids Sponsoring</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#4A573A' }}>1</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Donations */}
        <Typography variant="h6" fontWeight="bold" mb={1} sx={{ color: '#4A573A' }}>Recent Donations</Typography>
        {[3000, 900, 6100].map((amount, i) => (
          <Card key={i} sx={{ mb: 2, backgroundColor: '#DEA385', borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography fontWeight="bold" sx={{ color: '#4A573A' }}>💰 Food for Hope orphanage</Typography>
                <Typography variant="body2" sx={{ color: '#4A573A' }}>
                  Donated KSh {amount.toLocaleString()}.00 on May 05, 2025
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FavoriteIcon sx={{ color: '#C4B1CF', mr: 1 }} />
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Heartfelt Message */}
        <Card sx={{ mt: 4, backgroundColor: '#C4B1CF', borderRadius: 2, p: 1 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#4A573A', textAlign: 'center' }}>
              Your Impact Matters
            </Typography>
            <Typography variant="body1" sx={{ color: '#4A573A', textAlign: 'center', mt: 1 }}>
              Thank you for your generous contributions! Every donation brings hope, every act of kindness transforms lives. 
              The children you're supporting are gaining not just material support, but the priceless gift of knowing someone cares.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <FavoriteIcon sx={{ color: '#4A573A' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Home;
