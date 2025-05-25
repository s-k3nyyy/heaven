import React, { useEffect, useState } from 'react';
import '../App.css';
import { Box, Typography, Button, Radio, FormControlLabel, RadioGroup, TextField, Grid } from "@mui/material";

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('one-time');
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Add this styling to remove any default margins/padding from the body
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  document.body.style.overflow = "hidden";

  // Function to get the final donation amount
  const getDonationAmount = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      return parseFloat(customAmount).toFixed(2);
    }
    if (selectedAmount) {
      return parseFloat(selectedAmount).toFixed(2);
    }
    return "10.00"; 
  };


  const renderPayPalButtons = () => {
    if (window.paypal && document.getElementById('paypal-button-container')) {

      document.getElementById('paypal-button-container').innerHTML = '';
      
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          const amount = getDonationAmount();
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert(`Transaction completed by ${details.payer.name.given_name}! Amount: $${getDonationAmount()}`);
          });
        },
        onError: (err) => {
          console.error('PayPal error:', err);
          alert('An error occurred with PayPal. Please try again.');
        }
      }).render('#paypal-button-container');
    }
  };

  useEffect(() => {
    // Load PayPal script
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AdlNyL2ITeQZkWEyM8NwGh7YzFR9jS-R0dcd3d96NndoQTYJeQN7anOhltyBQHx2StCSZ4UE31BXLxmW";
    script.async = true;
    script.onload = () => {
      setPaypalLoaded(true);
      renderPayPalButtons();
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Re-render PayPal buttons when amount changes
  useEffect(() => {
    if (paypalLoaded) {
      renderPayPalButtons();
    }
  }, [selectedAmount, customAmount, paypalLoaded]);

  const handleAmountChange = (event) => {
    setSelectedAmount(event.target.value);
    setCustomAmount(''); // Clear custom amount when preset is selected
  };

  const handleCustomAmountChange = (event) => {
    const value = event.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(''); 
    }
  };

  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#9AA27D",
        margin: 0,
        padding: 0,
        position: "fixed",
        width: "100%",
        top: 0,
        left: 0,
      }}
    >
      <Grid container sx={{ width: "80%", maxWidth: "1200px", height: "600px", boxShadow: 3, borderRadius: 2, overflow: "hidden", marginTop: "0" }}>
        {/* Left Side: Image & Text */}
        <Grid
          item xs={12} md={6}
          sx={{
            backgroundImage: "url('/donationimg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            color: "white",
            paddingBottom: "50px",
            height: "100%",
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
              textAlign: "center"
            }}
          >
            Transforming Lives Through Compassion 💜
          </Typography>
        </Grid>

        {/* Right Side: Donation Form */}
        <Grid
          item xs={12} md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#DEA385",
            padding: "20px",
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: "400px",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: 3,
              overflowY: "auto",
              maxHeight: "90%",
            }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Choose a Donation Amount
            </Typography>
            
            <RadioGroup value={selectedAmount} onChange={handleAmountChange}>
              <FormControlLabel value="10" control={<Radio />} label="100 ksh ($10)" />
              <FormControlLabel value="25" control={<Radio />} label="250 ksh ($25)" />
              <FormControlLabel value="50" control={<Radio />} label="500 ksh ($50)" />
            </RadioGroup>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter custom amount (USD)"
              value={customAmount}
              onChange={handleCustomAmountChange}
              sx={{ backgroundColor: "white", borderRadius: 1, marginTop: 2 }}
              type="text"
              inputProps={{
                pattern: "[0-9]*\\.?[0-9]*"
              }}
            />

            {(selectedAmount || customAmount) && (
              <Typography variant="body2" sx={{ marginTop: 1, textAlign: 'center', fontWeight: 'bold' }}>
                Donation Amount: ${getDonationAmount()}
              </Typography>
            )}

            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Choose a Donation Frequency
            </Typography>
            
            <RadioGroup row value={frequency} onChange={handleFrequencyChange}>
              <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
              <FormControlLabel value="one-time" control={<Radio />} label="One-time" />
            </RadioGroup>

            <div id="paypal-button-container" style={{ marginTop: '20px' }}></div>

            <Button
              variant="contained"
              fullWidth
              sx={{ marginTop: 2, backgroundColor: "#C4B1CF", color: "white" }}
              onClick={() => {
                const amount = getDonationAmount();
                if (parseFloat(amount) <= 0) {
                  alert('Please enter a valid donation amount');
                  return;
                }
                // This button can be used for alternative checkout methods
                alert(`Proceeding to checkout with amount: $${amount} (${frequency})`);
              }}
            >
              Go to Checkout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DonationPage;
