import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Alert,
  Button,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SponsorChildList = () => {
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [sponsorForm, setSponsorForm] = useState({
    sponsorName: '',
    sponsorEmail: '',
    sponsorPhone: '',
    sponsorshipAmount: '',
    sponsorshipType: 'monthly',
    reasonForSponsorship: '',
    additionalMessage: ''
  });

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sponsor-child');
        if (Array.isArray(response.data)) {
          setChildren(response.data);
        } else {
          setChildren([]);
          console.warn('API response is not an array:', response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching child profiles:', err);
        if (err.response) {
          setError(`Failed to load child profiles: ${err.response.data?.message || err.response.statusText}`);
        } else if (err.request) {
          setError('No response from server. Please check if the backend is running.');
        } else {
          setError(`Error: ${err.message}`);
        }
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return '/placeholder-child.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://localhost:5000/${url}`;
  };

  const handleSponsorClick = (child) => {
    setSelectedChild(child);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedChild(null);
    setSponsorForm({
      sponsorName: '',
      sponsorEmail: '',
      sponsorPhone: '',
      sponsorshipAmount: '',
      sponsorshipType: 'monthly',
      reasonForSponsorship: '',
      additionalMessage: ''
    });
  };

  const handleFormChange = (field, value) => {
    setSponsorForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitSponsorship = async () => {
    if (!selectedChild) return;

    if (!sponsorForm.sponsorName || !sponsorForm.sponsorEmail || !sponsorForm.sponsorshipAmount || !sponsorForm.reasonForSponsorship) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    setSubmitting(true);

    try {
      const sponsorshipData = {
        childId: selectedChild.id,
        ...sponsorForm,
        sponsorshipAmount: parseFloat(sponsorForm.sponsorshipAmount)
      };

      await axios.post('http://localhost:5000/api/sponsorshipsForm', sponsorshipData);

      setSnackbar({
        open: true,
        message: 'Sponsorship application submitted successfully!',
        severity: 'success'
      });

      handleCloseDialog();

      navigate('/donationpage');

    } catch (err) {
      console.error('Error submitting sponsorship:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to submit sponsorship application',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 12, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={36} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 12 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 15, mb: 10 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 700, letterSpacing: 1, mb: 5, textAlign: 'center', color: 'primary.main' }}
      >
        Children in Need of Sponsorship
      </Typography>

      {children.length === 0 ? (
        <Alert severity="info" sx={{ fontSize: '1.1rem', py: 3 }}>
          No children profiles found. Please add some children to display here.
        </Alert>
      ) : (
        <Grid container spacing={5}>
          {children.map((child) => (
            <Grid item xs={12} sm={6} md={4} key={child.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={getImageUrl(child.imageUrl)}
                  alt={child.name}
                  onError={(e) => { e.target.src = '/placeholder-child.jpg'; }}
                  sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, px: 3, pt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {child.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 60 }}>
                    {child.shortDescription}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ mt: 1, fontWeight: 600 }}>
                    Goal: KES {parseFloat(child.goalAmount || 0).toLocaleString()}
                  </Typography>
                  {child.fullContent && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.primary' }}>
                      {child.fullContent.length > 100
                        ? `${child.fullContent.substring(0, 100)}...`
                        : child.fullContent}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ px: 3, pb: 3 }}>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => handleSponsorClick(child)}
                    fullWidth
                    sx={{ fontWeight: 'bold', borderRadius: 2, textTransform: 'none' }}
                  >
                    Sponsor Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Sponsorship Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Sponsor {selectedChild?.name}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Child Info Summary */}
              <Grid item xs={12}>
                <Card sx={{ mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Child Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Name:</strong> {selectedChild?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Goal Amount:</strong> KES {parseFloat(selectedChild?.goalAmount || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      {selectedChild?.shortDescription}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Sponsor Information */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Full Name *"
                  value={sponsorForm.sponsorName}
                  onChange={(e) => handleFormChange('sponsorName', e.target.value)}
                  variant="outlined"
                  autoComplete="name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address *"
                  type="email"
                  value={sponsorForm.sponsorEmail}
                  onChange={(e) => handleFormChange('sponsorEmail', e.target.value)}
                  variant="outlined"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={sponsorForm.sponsorPhone}
                  onChange={(e) => handleFormChange('sponsorPhone', e.target.value)}
                  variant="outlined"
                  autoComplete="tel"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sponsorship Amount (KES) *"
                  type="number"
                  value={sponsorForm.sponsorshipAmount}
                  onChange={(e) => handleFormChange('sponsorshipAmount', e.target.value)}
                  variant="outlined"
                  inputProps={{ min: 0, step: 100 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Sponsorship Type</InputLabel>
                  <Select
                    value={sponsorForm.sponsorshipType}
                    label="Sponsorship Type"
                    onChange={(e) => handleFormChange('sponsorshipType', e.target.value)}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="annually">Annually</MenuItem>
                    <MenuItem value="one-time">One-time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Why do you want to sponsor this child? *"
                  multiline
                  rows={4}
                  value={sponsorForm.reasonForSponsorship}
                  onChange={(e) => handleFormChange('reasonForSponsorship', e.target.value)}
                  variant="outlined"
                  placeholder="Please share your motivation for sponsoring this child..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Message (Optional)"
                  multiline
                  rows={3}
                  value={sponsorForm.additionalMessage}
                  onChange={(e) => handleFormChange('additionalMessage', e.target.value)}
                  variant="outlined"
                  placeholder="Any additional message or special requests..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="secondary" variant="outlined" disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitSponsorship}
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 'bold' }}
          >
            {submitting ? 'Submitting...' : 'Submit Sponsorship'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SponsorChildList;
