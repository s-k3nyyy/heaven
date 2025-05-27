import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  TextareaAutosize,
  Alert
} from '@mui/material';
import axios from 'axios';

const SponsorAChild = () => {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    goalAmount: '',
    shortDescription: '',
    fullContent: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/sponsor-child', formData);
      setSuccessMessage('Child profile submitted successfully! 🎉');

      // Optional: Reset form
      setFormData({
        name: '',
        imageUrl: '',
        goalAmount: '',
        shortDescription: '',
        fullContent: '',
      });

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting child profile:', error);
      setErrorMessage('Something went wrong while submitting the form. 😞');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Sponsor a Child Submission
        </Typography>

        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Child's Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Donation Goal (KES)"
            name="goalAmount"
            type="number"
            value={formData.goalAmount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Short Description"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            required
          />
          <Typography sx={{ mt: 2, mb: 1 }} variant="h6">More Content</Typography>
          <TextareaAutosize
            minRows={6}
            name="fullContent"
            placeholder="Full story or background info..."
            value={formData.fullContent}
            onChange={handleChange}
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            required
          />
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary">
              Submit Child Profile
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default SponsorAChild;
