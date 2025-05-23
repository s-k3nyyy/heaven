import React, { useState } from "react";
import '../App.css';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Radio,
  FormControlLabel,
  RadioGroup,
  TextField,
  Grid,
  Modal,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const Donationmodal = ({ open, setOpen }) => {
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("one-time");

  const handleClose = () => setOpen(false);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
  };

  const handleSubmit = () => {
    // Prepare data for the POST request
    const donationData = {
      donor_id: null, // For anonymous donation, no donor_id
      admin_id: 1, // Assuming admin_id is 1, you can modify it accordingly
      amount: amount,
      date: new Date().toISOString(), // Use current date
    };

    // Call the API to submit the donation
    axios.post('your-api-endpoint/donations', donationData)
      .then(response => {
        console.log("Donation successful:", response);
        // Optionally, close the modal or show success message
        handleClose();
      })
      .catch(error => {
        console.error("Error submitting donation:", error);
      });
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "1200px",
            height: "500px", // Reduced overall height here
            bgcolor: "#9AA27D",
            boxShadow: 24,
            p: 0,
            outline: "none",
            borderRadius: 2,
            overflow: "hidden"
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              zIndex: 1
            }}
          >
            <CloseIcon />
          </IconButton>

          <Grid container sx={{ height: "100%" }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                backgroundImage: "url('/donationimg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: "50px",
                color: "white",
              }}
            >
              <Typography
                variant="h6"
                align="center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#9AA27D",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "80%",
                  textAlign: "center",
                }}
              >
                Transforming Lives Through Compassion 💜
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#DEA385",
                padding: "16px",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                  color: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: 3,
                  overflowY: "auto",
                  maxHeight: "90%", // Keep form intact
                }}
              >
                <Typography variant="h5" align="center" gutterBottom>
                  Choose a Donation Amount
                </Typography>

                <RadioGroup value={amount} onChange={handleAmountChange}>
                  <FormControlLabel value="100" control={<Radio />} label="100 ksh" />
                  <FormControlLabel value="250" control={<Radio />} label="250 ksh" />
                  <FormControlLabel value="500" control={<Radio />} label="500 ksh" />
                </RadioGroup>

                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter custom amount"
                  value={amount}
                  onChange={handleAmountChange}
                  sx={{ backgroundColor: "white", borderRadius: 1, marginTop: 2 }}
                />

                <Typography variant="h6" sx={{ marginTop: 2 }}>
                  Choose a Donation Frequency
                </Typography>

                <RadioGroup row value={frequency} onChange={handleFrequencyChange}>
                  <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                  <FormControlLabel value="one-time" control={<Radio />} label="One-time" />
                </RadioGroup>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ marginTop: 2, backgroundColor: "#C4B1CF", color: "white" }}
                  onClick={handleSubmit}
                >
                  Go to Checkout
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default Donationmodal;
