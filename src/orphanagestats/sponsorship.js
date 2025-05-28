import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Grid, Box } from '@mui/material';
import axios from 'axios';

const SponsorshipsPage = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        const res = await axios.get('https://ideal-sniffle-1y3k.onrender.com/api/sponsorshipsForm');
        setSponsorships(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load sponsorships');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorships();
  }, []);

  if (loading)
    return (
      <Container sx={{ mt: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress color="primary" size={60} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary', fontWeight: 500 }}>
          Loading all sponsorships...
        </Typography>
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="error" fontWeight="bold">
          {error}
        </Typography>
      </Container>
    );

  return (
    <Container sx={{ mt: 8, mb: 8, maxWidth: 'md' }}>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{ fontWeight: 'bold', color: 'primary.main', mb: 6 }}
      >
        All Sponsorship Intents
      </Typography>

      {sponsorships.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 4 }}>
          No sponsorship intents found.
        </Typography>
      ) : (
        <Grid container spacing={5}>
          {sponsorships.map((item, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card
                variant="outlined"
                sx={{
                  boxShadow: 4,
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.04)',
                    boxShadow: 8,
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: 'primary.dark' }}
                  >
                    Sponsor: {item.sponsorName}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <Box component="span" fontWeight="medium" color="text.primary">
                      Child Name:
                    </Box>{' '}
                    {item.childName}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <Box component="span" fontWeight="medium" color="text.primary">
                      Email:
                    </Box>{' '}
                    {item.sponsorEmail}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <Box component="span" fontWeight="medium" color="text.primary">
                      Phone:
                    </Box>{' '}
                    {item.sponsorPhone || 'N/A'}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <Box component="span" fontWeight="medium" color="text.primary">
                      Amount:
                    </Box>{' '}
                    <Box component="span" color="success.main" fontWeight="bold">
                      KES {parseFloat(item.sponsorshipAmount).toLocaleString()}
                    </Box>
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <Box component="span" fontWeight="medium" color="text.primary">
                      Type:
                    </Box>{' '}
                    {item.sponsorshipType}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    <Box component="span" fontWeight="medium" color="text.primary">
                      Reason:
                    </Box>{' '}
                    {item.reasonForSponsorship}
                  </Typography>

                  {item.additionalMessage && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        fontStyle: 'italic',
                        color: 'text.secondary',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box component="span" fontWeight="medium" color="text.primary">
                        Additional Message:
                      </Box>{' '}
                      {item.additionalMessage}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SponsorshipsPage;
