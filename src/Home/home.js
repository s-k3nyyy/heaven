import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar,
  Toolbar, 
  CssBaseline,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SettingsIcon from '@mui/icons-material/Settings';
import ExploreIcon from '@mui/icons-material/Explore';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RefreshIcon from '@mui/icons-material/Refresh';

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
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [allDonations, setAllDonations] = useState([]); // Store all donations for calculation
  const [sponsorships, setSponsorships] = useState([]);
  const [userStats, setUserStats] = useState({
    totalDonated: 0,
    totalDonations: 0,
    kidsSponsoring: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://ideal-sniffle-1y3k.onrender.com/api';

  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log('Retrieved user data:', parsed); // Debug log
        return parsed;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    console.log('No user data found in localStorage'); // Debug log
    return null;
  };

  const getUserId = () => {
    const userData = getUserData();
    return userData ? userData.id : null;
  };

  const getUserEmail = () => {
    const userData = getUserData();
    return userData ? userData.email : null;
  };

  // Check if user is logged in
  const isUserLoggedIn = () => {
    const userData = getUserData();
    return userData && userData.id;
  };

  // Calculate total stats from both donations and sponsorships
  const calculateTotalStats = (donationsArray, sponsorshipsArray) => {
    // Calculate donation totals
    const donationTotal = donationsArray.reduce((sum, donation) => {
      return sum + (parseFloat(donation.amount) || 0);
    }, 0);

    // Calculate sponsorship totals
    const sponsorshipTotal = sponsorshipsArray.reduce((sum, sponsorship) => {
      return sum + (parseFloat(sponsorship.sponsorshipAmount) || 0);
    }, 0);

    return {
      totalDonated: donationTotal + sponsorshipTotal,
      totalDonations: donationsArray.length + sponsorshipsArray.length,
      donationAmount: donationTotal,
      sponsorshipAmount: sponsorshipTotal,
      donationCount: donationsArray.length,
      sponsorshipCount: sponsorshipsArray.length
    };
  };

  const fetchUserData = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        setError('No user ID found. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Fetching data for user ID:', userId); // Debug log

      // Try to fetch updated user data from server
      const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If server request fails, use cached user data
        console.log('Server request failed, using cached data');
        const cachedUser = getUserData();
        if (cachedUser) {
          setUser(cachedUser);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Fallback to cached data if server returns error
        const cachedUser = getUserData();
        if (cachedUser) {
          setUser(cachedUser);
        } else {
          setError(data.error || 'Failed to fetch user data');
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      // Try to use cached data as fallback
      const cachedUser = getUserData();
      if (cachedUser) {
        console.log('Using cached user data due to fetch error');
        setUser(cachedUser);
      } else {
        setError('Failed to connect to server and no cached data available.');
      }
    }
  };

  const fetchUserDonations = async () => {
    try {
      const userId = getUserId();
      if (!userId) return [];

      console.log('Fetching donations for user ID:', userId); // Debug log

      const response = await fetch(`${API_BASE_URL}/donations/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Store all donations for calculation
          setAllDonations(data.donations);
          // Store only first 3 for display in recent activities
          setDonations(data.donations.slice(0, 3));
          
          console.log('Donations fetched:', data.donations.length);
          return data.donations;
        }
      } else {
        console.log('Failed to fetch donations, continuing without them');
      }
      return [];
    } catch (err) {
      console.error('Error fetching donations:', err);
      return [];
    }
  };

  const fetchUserSponsorships = async () => {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        console.log('No user email found, skipping sponsorship fetch');
        return [];
      }

      console.log('Fetching sponsorships for user email:', userEmail); // Debug log

      const response = await fetch(`${API_BASE_URL}/sponsorshipsForm`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('All sponsorships:', data); // Debug log
        
        // Filter sponsorships by user email
        const userSponsorships = data.filter(sponsorship => 
          sponsorship.sponsorEmail === userEmail
        );
        
        console.log('User sponsorships:', userSponsorships); // Debug log
        
        setSponsorships(userSponsorships);
        return userSponsorships;
      } else {
        console.log('Failed to fetch sponsorships, continuing without them');
      }
      return [];
    } catch (err) {
      console.error('Error fetching sponsorships:', err);
      return [];
    }
  };

  // Update stats after both donations and sponsorships are fetched
  const updateUserStats = (donationsArray, sponsorshipsArray) => {
    const stats = calculateTotalStats(donationsArray, sponsorshipsArray);
    
    setUserStats({
      totalDonated: stats.totalDonated,
      totalDonations: stats.totalDonations,
      kidsSponsoring: sponsorshipsArray.length
    });
    
    console.log('Updated stats:', {
      totalDonated: stats.totalDonated,
      donationAmount: stats.donationAmount,
      sponsorshipAmount: stats.sponsorshipAmount,
      totalContributions: stats.totalDonations,
      donationCount: stats.donationCount,
      sponsorshipCount: stats.sponsorshipCount
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      // Check if user is logged in first
      if (!isUserLoggedIn()) {
        setError('Please log in to view your dashboard.');
        setLoading(false);
        return;
      }

      // Load user data first, then donations and sponsorships
      await fetchUserData();
      
      // Fetch both donations and sponsorships concurrently
      const [donationsData, sponsorshipsData] = await Promise.all([
        fetchUserDonations(),
        fetchUserSponsorships()
      ]);
      
      // Update stats with combined data
      updateUserStats(donationsData, sponsorshipsData);
      
      setLoading(false);
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    if (!isUserLoggedIn()) {
      setError('Please log in to view your dashboard.');
      setLoading(false);
      return;
    }

    await fetchUserData();
    
    // Fetch both donations and sponsorships concurrently
    const [donationsData, sponsorshipsData] = await Promise.all([
      fetchUserDonations(),
      fetchUserSponsorships()
    ]);
    
    // Update stats with combined data
    updateUserStats(donationsData, sponsorshipsData);
    
    setLoading(false);
  };

  const handleLogin = () => {
    // Redirect to login page or show login modal
    window.location.href = '/login'; // Adjust based on your routing
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.length > 1 
      ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      : name.charAt(0).toUpperCase();
  };

  // Combine donations and sponsorships for recent activities
  const getRecentActivities = () => {
    const activities = [];
    
    // Add donations
    donations.forEach(donation => {
      activities.push({
        type: 'donation',
        title: donation.description || 'General Donation',
        amount: donation.amount,
        date: donation.created_at,
        status: donation.status,
        icon: '💰'
      });
    });
    
    // Add sponsorships (recent 3)
    sponsorships.slice(0, 3).forEach(sponsorship => {
      activities.push({
        type: 'sponsorship',
        title: `Sponsoring ${sponsorship.childName}`,
        amount: sponsorship.sponsorshipAmount,
        date: sponsorship.created_at || new Date().toISOString(), // Use current date if not available
        status: 'active',
        sponsorshipType: sponsorship.sponsorshipType,
        reason: sponsorship.reasonForSponsorship,
        icon: '👶'
      });
    });
    
    // Sort by date (most recent first) and return top 5
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
        <CircularProgress />
        <Typography>Loading your dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        {error.includes('log in') ? (
          <Button variant="contained" onClick={handleLogin}>
            Go to Login
          </Button>
        ) : (
          <Button variant="contained" onClick={handleRefresh} startIcon={<RefreshIcon />}>
            Try Again
          </Button>
        )}
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          User data not found. Please log in again.
        </Alert>
        <Button variant="contained" onClick={handleLogin}>
          Go to Login
        </Button>
      </Box>
    );
  }

  const recentActivities = getRecentActivities();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <CssBaseline />
      <Box component="main" sx={{ maxWidth: 900, width: '100%', p: 3, backgroundColor: '#f5f5f5', mx: 'auto' }}>
        <Toolbar />
        <Card sx={{ mb: 4, backgroundColor: '#DEA385', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 80, height: 80, backgroundColor: '#4A573A', border: '3px solid #C4B1CF' }}>
                  {getUserInitials(user.name)}
                </Avatar>
                <Box sx={{ ml: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#4A573A' }}>
                    {user.name || 'User'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4A573A' }}>
                    Welcome back! You've been a donor since {formatDate(user.created_at)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4A573A', mt: 1 }}>
                    Your kindness has touched {userStats.totalDonations} lives through contributions
                    {userStats.kidsSponsoring > 0 && ` and you're sponsoring ${userStats.kidsSponsoring} ${userStats.kidsSponsoring === 1 ? 'child' : 'children'}`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6A6A6A', mt: 1, display: 'block' }}>
                    | Role: {user.role || 'donor'}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRefresh}
                startIcon={<RefreshIcon />}
                sx={{ color: '#4A573A', borderColor: '#4A573A' }}
              >
                Refresh
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: '#4A573A' }}>
          Dashboard Overview
        </Typography>

        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#DEA385', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#4A573A' }}>Total Contributed</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#4A573A' }}>
                  {formatCurrency(userStats.totalDonated)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6A6A6A' }}>
                  From {allDonations.length} donation{allDonations.length !== 1 ? 's' : ''} & {sponsorships.length} sponsorship{sponsorships.length !== 1 ? 's' : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#DEA385', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#4A573A' }}>Total Contributions</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#4A573A' }}>
                  {userStats.totalDonations}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6A6A6A' }}>
                  Donations + Sponsorships
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#DEA385', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#4A573A' }}>Kids Sponsoring</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#4A573A' }}>
                  {userStats.kidsSponsoring}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6A6A6A' }}>
                  Active sponsorships
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h6" fontWeight="bold" mb={1} sx={{ color: '#4A573A' }}>
          Recent Activities
        </Typography>
        
        {recentActivities.length > 0 ? (
          recentActivities.map((activity, i) => (
            <Card key={i} sx={{ mb: 2, backgroundColor: '#DEA385', borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography fontWeight="bold" sx={{ color: '#4A573A' }}>
                      {activity.icon} {activity.title}
                    </Typography>
                    <Chip 
                      label={activity.type === 'donation' ? 'Donation' : 'Sponsorship'} 
                      size="small" 
                      sx={{ 
                        backgroundColor: activity.type === 'donation' ? '#C4B1CF' : '#4A573A',
                        color: activity.type === 'donation' ? '#4A573A' : '#DEA385',
                        fontSize: '0.75rem'
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#4A573A' }}>
                    Amount: {formatCurrency(activity.amount)} 
                    {activity.sponsorshipType && ` (${activity.sponsorshipType})`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4A573A' }}>
                    Date: {formatDate(activity.date)}
                  </Typography>
                  {activity.reason && (
                    <Typography variant="body2" sx={{ color: '#4A573A', fontSize: '0.875rem', mt: 0.5 }}>
                      Reason: {activity.reason}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: '#4A573A', fontSize: '0.875rem' }}>
                    Status: {activity.status}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FavoriteIcon sx={{ color: '#C4B1CF', mr: 1 }} />
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card sx={{ mb: 2, backgroundColor: '#DEA385', borderRadius: 2 }}>
            <CardContent>
              <Typography sx={{ color: '#4A573A', textAlign: 'center' }}>
                No activities yet. Start making a difference today!
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Show all sponsorships if user has any */}
        {sponsorships.length > 0 && (
          <>
            <Typography variant="h6" fontWeight="bold" mb={1} mt={3} sx={{ color: '#4A573A' }}>
              Your Sponsored Children ({sponsorships.length})
            </Typography>
            {sponsorships.map((sponsorship, i) => (
              <Card key={i} sx={{ mb: 2, backgroundColor: '#C4B1CF', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography fontWeight="bold" sx={{ color: '#4A573A' }}>
                        👶 {sponsorship.childName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4A573A' }}>
                        {formatCurrency(sponsorship.sponsorshipAmount)} / {sponsorship.sponsorshipType}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4A573A', fontSize: '0.875rem' }}>
                        {sponsorship.reasonForSponsorship}
                      </Typography>
                    </Box>
                    <Chip 
                      label="Active" 
                      size="small" 
                      sx={{ backgroundColor: '#4A573A', color: '#DEA385' }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Home;