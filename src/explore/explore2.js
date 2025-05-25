import '../App.css';
import React, { useState } from 'react';
import {
  Container, Grid, Card, CardContent, CardMedia, Typography,
  Button, Box, TextField, MenuItem, LinearProgress
} from '@mui/material';
import { Link } from 'react-router-dom';

const orphanages = [
  { id: 1, name: 'Hope Orphanage', location: 'Nairobi', image: '/hopeorp.jpeg', progress: 60 },
  { id: 2, name: 'Bright Future Home', location: 'Mombasa', image: '/brightorp.jpeg', progress: 30 },
  { id: 3, name: 'Smile Children’s Home', location: 'Kisumu', image: '/smileorp.jpg', progress: 80 },
  { id: 4, name: 'New Dawn Orphanage', location: 'Eldoret', image: '/newdawn.jpg', progress: 45 },
  { id: 5, name: 'Little Stars Home', location: 'Nakuru', image: '/littlestars.jpg', progress: 70 },
  { id: 6, name: 'Peace Haven Center', location: 'Thika', image: '/peacehaven.jpg', progress: 55 }
];

const kidsForSponsoring = [
  { id: 1, name: 'John Kamau', age: 14, image: '/child4.jpeg', urgent: true },
  { id: 2, name: 'Jane Collins', age: 10, image: '/child5.jpeg', urgent: false },
  { id: 3, name: 'Halima Hassan', age: 7, image: '/child6.jpeg', urgent: true }
];

const orphanageNeeds = [
  { id: 1, orphanage: 'Hope Orphanage', needs: { Education: ['School Supplies'], Health: ['Medical Support'], Basic: ['Food'] } },
  { id: 2, orphanage: 'Bright Future Home', needs: { Education: ['Books'], Health: ['Hygiene Items'], Basic: ['Toys'] } },
  { id: 3, orphanage: 'Smile Children’s Home', needs: { Education: ['Scholarships'], Health: ['Bedding'], Basic: ['Clothes'] } }
];

const ExplorePage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredOrphanages = orphanages.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredKids = kidsForSponsoring.filter(k =>
    filter === 'All' || (filter === 'Urgent' && k.urgent)
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 0, backgroundColor: '#C4B1CF', padding: 2, borderRadius: 2, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: '#4A573A', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        Explore and Support
      </Typography>

      {/* Search & Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <TextField
          label="Search Orphanages"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, backgroundColor: '#E7B197', borderRadius: 1 }}
        />
        <TextField
          select
          label="Filter Kids"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mb: 2, backgroundColor: '#E7B197', borderRadius: 1, width: '200px' }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Urgent">Urgent Cases</MenuItem>
        </TextField>
      </Box>

      {/* Orphanages Section */}
      <Typography variant="h5" sx={{ color: '#4A573A', fontWeight: 'bold', mt: 4, mb: 2 }}>
        Orphanage Profiles
      </Typography>
      <Grid container spacing={3}>
        {filteredOrphanages.map((orphanage) => (
          <Grid item xs={12} sm={6} md={4} key={orphanage.id}>
            <Card sx={{ backgroundColor: '#DEA385', borderRadius: 2, height: '100%' }}>
              <CardMedia component="img" height="140" image={orphanage.image} alt={orphanage.name} />
              <CardContent>
                <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>{orphanage.name}</Typography>
                <Typography color="textSecondary">{orphanage.location}</Typography>
                <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Donation Progress: {orphanage.progress}%</Typography>
                <LinearProgress variant="determinate" value={orphanage.progress} sx={{ backgroundColor: '#4A573A', mt: 1 }} />
                <Button
                  variant="contained"
                  sx={{ mt: 1, backgroundColor: '#E7B197', color: 'white', width: '100%' }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Kids Section */}
      <Typography variant="h5" sx={{ color: '#4A573A', fontWeight: 'bold', mt: 4, mb: 2 }}>
        Kids for Sponsoring
      </Typography>
      <Grid container spacing={3}>
        {filteredKids.map((kid) => (
          <Grid item xs={12} sm={6} md={4} key={kid.id}>
            <Card sx={{
              border: kid.urgent ? '3px solid red' : 'none',
              borderRadius: 2,
              backgroundColor: '#DEA385',
              height: '100%'
            }}>
              <CardMedia
                component="img"
                image={kid.image}
                alt={`Photo of ${kid.name}`}
                sx={{ height: 200, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                  {kid.name}, {kid.age} years old
                </Typography>
                {kid.urgent && <Typography color="error">Urgent Sponsorship Needed!</Typography>}
                <Button
                  variant="contained"
                  component={Link}
                  to="/sponsorshipform"
                  sx={{ mt: 1, backgroundColor: '#E7B197', color: 'white', width: '100%' }}
                >
                  Sponsor
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Needs Section */}
      <Typography variant="h5" sx={{ color: '#4A573A', fontWeight: 'bold', mt: 4, mb: 2 }}>
        Orphanage Needs
      </Typography>
      <Grid container spacing={3}>
        {orphanageNeeds.map((need) => (
          <Grid item xs={12} sm={6} md={4} key={need.id}>
            <Card sx={{ backgroundColor: '#DEA385', borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>{need.orphanage}</Typography>
                {Object.entries(need.needs).map(([category, items]) => (
                  <Typography key={category} sx={{ mt: 1 }}>
                    <strong>{category}:</strong> {items.join(', ')}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ExplorePage;
