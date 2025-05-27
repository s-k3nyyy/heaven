import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Grid, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExplorePage = () => {
  const [orphanages, setOrphanages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrphanages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orphanages');
        setOrphanages(res.data);
      } catch (err) {
        setError('Failed to load orphanages');
      } finally {
        setLoading(false);
      }
    };

    fetchOrphanages();
  }, []);

  if (loading) return <Typography sx={{ mt: 4, textAlign: 'center' }}>Loading orphanages...</Typography>;
  if (error) return <Typography sx={{ mt: 4, textAlign: 'center' }} color="error">{error}</Typography>;

  const handleDonateClick = (orphanageId) => {
    navigate(`/donationpage`);
  };

  return (
    <Box p={4} sx={{ mt: 6, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" mb={4} fontWeight="bold" textAlign="center" color="primary.main">
        Explore Orphanages
      </Typography>
      <Grid container spacing={4}>
        {orphanages.map((orph) => (
          <Grid item xs={12} sm={6} md={4} key={orph.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                },
              }}
            >
              {orph.image_url ? (
                <CardMedia
                  component="img"
                  height="180"
                  image={orph.image_url}
                  alt={orph.name || 'Orphanage image'}
                  sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, objectFit: 'cover' }}
                />
              ) : (
                <Box
                  height={180}
                  bgcolor="#f0f0f0"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                >
                  <Typography color="text.secondary">No Image</Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" mb={1} fontWeight="600">
                  {orph.name || 'Unnamed Orphanage'}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1} sx={{ minHeight: 40 }}>
                  {orph.description || 'No description available.'}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  <strong>Location:</strong> {orph.location || 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  <strong>Donation Goal:</strong> ${orph.donation_goal?.toLocaleString() ?? 'N/A'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDonateClick(orph.id)}
                  fullWidth
                  sx={{
                    fontWeight: 'bold',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  Donate
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExplorePage;
