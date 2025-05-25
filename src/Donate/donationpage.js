import React, { useState } from "react";
import '../App.css';
import { Box, Typography, Button, Grid } from "@mui/material";
import Donationmodal from "../Donate/donationmodal";

const DonationPage = () => {
  const [open, setOpen] = useState(false);

  document.body.style.margin = 0;
  document.body.style.padding = 0;
  document.body.style.overflow = "hidden";

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
              Click To Make A Donation
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{ marginTop: 2, backgroundColor: "#C4B1CF", color: "white" }}
              onClick={() => setOpen(true)}
            >
              Donate Here
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* PayPal Modal */}
      <Donationmodal open={open} setOpen={setOpen} />
    </Box>
  );
};

export default DonationPage;
