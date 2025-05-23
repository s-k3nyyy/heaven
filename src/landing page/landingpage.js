import React, { useState } from 'react';
import '../App.css';
import { Button, Typography, Box, Container, Card, CardContent, AppBar, Toolbar } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Donationmodal from '../Donate/donationmodal';

const cardItems = [
  { text: "Fund an Orphanage", desc: 'Be the Foundation for a Child’s Tomorrow.', color: ' #C4B1CF' },
  { text: "Sponsor an Orphan", desc: 'Give a Child a Champion — You.', color: ' #DEA385' },
  { text: "General Donation", desc: 'Open Hands, Open Hearts.', color: ' #9AA27D' },
];

function Landingpage() {
  const [isVerified, setIsVerified] = useState(false); // Set to true for testing
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSponsorshipClick = () => {
    if (isVerified) {
      navigate('/sponsorship');
    } else {
      alert('Please log into your account before accessing sponsorship.');
      navigate('/login');
    }
  };

  const handledonateclick = () => {
    setOpen(true);
  };

  return (
    <div style={{ backgroundColor: ' #E4AC80' }}>
      {/* NAVIGATION BAR */}
      <AppBar position="static" sx={{ backgroundColor: '#111', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Heaven
          </Typography>
          <Box>
            <Button onClick={handledonateclick} color="inherit">Donate</Button>
            <Button onClick={handleSponsorshipClick} color="inherit">Sponsorship</Button>
            {/* Removed Explore Button */}
            <Button component={Link} to="/blogpage" color="inherit">Blog</Button>
            <Button component={Link} to="/aboutus" color="inherit">About Us</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* SECTION 1: Background Image & Main Message Split View */}
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {/* LEFT: Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/backgroundimage.jpg"
              alt="Hero"
              sx={{
                width: '100%',
                maxHeight: '80vh',
                borderRadius: 3,
                objectFit: 'cover',
                boxShadow: 3,
              }}
            />
          </Grid>

          {/* RIGHT: Text and Buttons */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight="bold">Heaven</Typography>
              <Typography variant="h5" sx={{ mt: 1, mb: 3 }}>
                Dedicated to little Hearts, Changing Lives Forever
              </Typography>

              {/* Donate Button - On top */}
              <Button
                onClick={handledonateclick}
                variant="contained"
                sx={{ backgroundColor: '#9AA27D', mb: 2 }}
                size="large"
              >
                Donate Today
              </Button>

              {/* Info Text */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Explore orphanages to help
              </Typography>

              {/* Explore Button - Below the Text */}
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{ backgroundColor: '#9AA27D' }}
                size="large"
              >
                Explore
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* SECTION 2: Learn More & 3 Boxes */}
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Grid container spacing={4}>
          {cardItems.map((cardItem, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ boxShadow: 3, backgroundColor: cardItem.color }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{cardItem.text}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cardItem.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button href='/login' variant="contained" sx={{ mb: 3, mt: '20px', backgroundColor: ' #9AA27D' }}>Log in</Button>
      </Container>

      {/* SECTION 3: Our Mission & Child Image */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">OUR MISSION</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Approximately 3.6 million Kenyan children are orphans or classified as vulnerable and are in need of food, shelter and clothing.
              We are dedicated to providing a loving home, education, and support to orphaned children.
              Through sponsorships and donations, we aim to give these children a brighter future.
              Join us in making a difference today.
            </Typography>
            <Button variant="contained" sx={{ mb: 3, mt: '20px', backgroundColor: ' #9AA27D' }} component={Link} to="/aboutus">
              Learn more
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <img src="2ndbckgrnd.jpg" alt="Child" width="100%" style={{ borderRadius: 8 }} />
          </Grid>
        </Grid>
      </Container>

      {/* SECTION 4: How You Can Help */}
      <Box sx={{ bgcolor: '#C4B1CF', py: 6 }}>
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold">How You Can Help</Typography>
          <Grid container spacing={4} sx={{ mt: 3 }}>
            {[
              { title: "PRAY", desc: "Keep the children in your prayers for a better future." },
              { title: "TELL", desc: "Share our mission with friends and family to spread awareness." },
              { title: "GIVE", desc: "Donate to support education, healthcare, and shelter." }
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
                <Typography variant="body2">{item.desc}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FOOTER: Contact & About Us */}
      <Box sx={{ bgcolor: '#222', color: 'white', py: 4, textAlign: 'center' }}>
        <Typography variant="body1">📍 Contact: orphanage@example.com | 📞 +254 1688 6150</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>© 2025 Orphanage Donation System</Typography>
      </Box>

      {/* Donation Modal */}
      <Donationmodal open={open} setOpen={setOpen} />
    </div>
  );
}

export default Landingpage;


