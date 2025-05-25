import React, { useState, useEffect, useRef } from "react";
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
import axios from 'axios';

const DonationModal = ({ open, setOpen }) => {
  const [selectedAmount, setSelectedAmount] = useState(""); // From radio
  const [customAmount, setCustomAmount] = useState(""); // From input
  const [frequency, setFrequency] = useState("one-time");
  const [sdkReady, setSdkReady] = useState(false);
  const paypalRef = useRef(null);

  const resolvedAmount = customAmount || selectedAmount;

  const handleClose = () => {
    setOpen(false);
    setSelectedAmount("");
    setCustomAmount("");
    setFrequency("one-time");
  };

  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
  };

  const handleSubmit = () => {
    const donationData = {
      donor_id: null,
      admin_id: 1,
      amount: parseFloat(resolvedAmount),
      date: new Date().toISOString(),
    };

    axios.post("http://localhost:4000/api/donations", donationData)
      .then(() => {
        alert("Thank you for your donation!");
        handleClose();
      })
      .catch((error) => {
        console.error("Error submitting donation:", error);
      });
  };

  // Load PayPal SDK
  useEffect(() => {
    const addPayPalScript = () => {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=AdlNyL2ITeQZkWEyM8NwGh7YzFR9jS-R0dcd3d96NndoQTYJeQN7anOhltyBQHx2StCSZ4UE31BXLxmW&currency=USD";
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => setSdkReady(true);
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

 useEffect(() => {
  if (!sdkReady || !paypalRef.current || !parseFloat(resolvedAmount)) return;

  // Clear previous buttons before rendering
  paypalRef.current.innerHTML = "";

  const paypalButtons = window.paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'blue',
      shape: 'pill',
      label: 'paypal',
    },
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: { value: parseFloat(resolvedAmount).toFixed(2) }
        }]
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then((details) => {
        console.log("Transaction completed by", details.payer.name.given_name);
        handleSubmit();
      });
    },
    onError: (err) => {
      console.error("PayPal error:", err);
    }
  });

  paypalButtons.render(paypalRef.current).catch((err) => {
    console.error("PayPal button render error:", err);
  });

  // Optional cleanup if component is unmounted
  return () => {
    paypalRef.current && (paypalRef.current.innerHTML = "");
  };
}, [sdkReady, resolvedAmount]);


  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "1200px",
          height: "90vh",
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
                maxHeight: "90vh",
              }}
            >
              <Typography variant="h5" align="center" gutterBottom>
                Choose a Donation Amount
              </Typography>

              <RadioGroup value={selectedAmount} onChange={(e) => setSelectedAmount(e.target.value)}>
                <FormControlLabel value="100" control={<Radio />} label="100 ksh" />
                <FormControlLabel value="250" control={<Radio />} label="250 ksh" />
                <FormControlLabel value="500" control={<Radio />} label="500 ksh" />
              </RadioGroup>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="Or enter custom amount"
                value={customAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val)) setCustomAmount(val);
                }}
                sx={{ backgroundColor: "white", borderRadius: 1, mt: 2, mb: 2 }}
              />

              <Typography variant="h6" sx={{ mt: 2 }}>
                Choose a Donation Frequency
              </Typography>

              <RadioGroup row value={frequency} onChange={handleFrequencyChange}>
                <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                <FormControlLabel value="one-time" control={<Radio />} label="One-time" />
              </RadioGroup>

              {sdkReady && parseFloat(resolvedAmount) > 0 && (
                <Box ref={paypalRef} sx={{ mt: 3 }} />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default DonationModal;
