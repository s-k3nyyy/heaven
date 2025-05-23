import '../App.css';
import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Container,
  Typography,
  Paper,
} from "@mui/material";


const SponsorshipForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    childName: "",
    sponsorshipType: "",
    duration: "",
    amount: "",
    updates: false,
    gifts: false,
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sponsorship Form Data:", formData);
    alert("Sponsorship form submitted successfully!");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Sponsor a Child
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Full Name" name="fullName" fullWidth required onChange={handleChange} />
          <TextField label="Email Address" name="email" type="email" fullWidth required onChange={handleChange} />
          <TextField label="Phone Number" name="phone" type="tel" fullWidth required onChange={handleChange} />

          <TextField
            label="Child Name"
            name="childName"
            fullWidth
            required
            select
            onChange={handleChange}
          >
            <MenuItem value="Child 1">Child 1</MenuItem>
            <MenuItem value="Child 2">Child 2</MenuItem>
          </TextField>

          <TextField
            label="Sponsorship Type"
            name="sponsorshipType"
            fullWidth
            required
            select
            onChange={handleChange}
          >
            <MenuItem value="Education">Education</MenuItem>
            <MenuItem value="Healthcare">Healthcare</MenuItem>
            <MenuItem value="Basic Needs">Basic Needs</MenuItem>
          </TextField>

          <TextField
            label="Sponsorship Duration"
            name="duration"
            fullWidth
            required
            select
            onChange={handleChange}
          >
            <MenuItem value="One-time">One-time</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Yearly">Yearly</MenuItem>
          </TextField>

          <TextField label="Donation Amount (USD)" name="amount" type="number" fullWidth required onChange={handleChange} />

          <FormControlLabel
            control={<Checkbox name="updates" onChange={handleChange} />}
            label="Receive updates about the child's progress"
          />
          <FormControlLabel
            control={<Checkbox name="gifts" onChange={handleChange} />}
            label="Send personal messages or gifts"
          />
          <FormControlLabel
            control={<Checkbox name="terms" required onChange={handleChange} />}
            label="I agree to the terms and conditions"
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Submit Sponsorship
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SponsorshipForm;
