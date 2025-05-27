import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Grid, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddOrphanage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    donationGoal: '',
    description: '',
    imageUrl: '',
    contactInfo: '',
    numberOfChildren: '',
    established: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Map frontend keys to backend keys if needed (donationGoal -> donation_goal)
      const payload = {
        name: formData.name,
        location: formData.location,
        donation_goal: parseFloat(formData.donationGoal),
        description: formData.description,
        image_url: formData.imageUrl,
        contact_info: formData.contactInfo,
        number_of_children: formData.numberOfChildren ? parseInt(formData.numberOfChildren) : null,
        established: formData.established,
      };

      // Replace with your Flask backend URL
      const response = await axios.post('http://localhost:5000/api/orphanages', payload);

      if (response.status === 201) {
        // Success - maybe redirect to orphanage list or profile page
        navigate('/');  // or wherever you want to go after adding
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to submit orphanage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 700, margin: 'auto' }}>
        <Typography variant="h5" gutterBottom>Add New Orphanage</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{typeof error === 'string' ? error : JSON.stringify(error)}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Orphanage Name" name="name" value={formData.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Donation Goal (e.g. 50000)" type="number" name="donationGoal" value={formData.donationGoal} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Description / What the donation is about" name="description" value={formData.description} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Contact Info (Phone or Email)" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Number of Children" type="number" name="numberOfChildren" value={formData.numberOfChildren} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Established Year" name="established" value={formData.established} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#E4AC80', color: 'black' }}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Orphanage'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddOrphanage;
