import '../App.css';
import { Box, Typography, Button, Radio, FormControlLabel, RadioGroup, TextField, Grid } from "@mui/material";

const DonationPage = () => {
  // Add this styling to remove any default margins/padding from the body
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  document.body.style.overflow = "hidden";
  return (
    <Box
      sx={{
        height: "100vh", // Fixed viewport height
        display: "flex",
        alignItems: "flex-start", // Changed from center to flex-start
        justifyContent: "center",
        backgroundColor: "#9AA27D",
        margin: 0,
        padding: 0,
        position: "fixed", // Fixed position
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
            alignItems: "flex-end", // Moves text down
            justifyContent: "center",
            color: "white",
            paddingBottom: "50px", // Moves text closer to the child's leg
            height: "100%", // Fixed height
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
              width: "80%", // Makes text more centered
              textAlign: "center"
            }}
          >
            Transforming Lives Through Compassion 💜
          </Typography>
        </Grid>

        {/* Right Side: Donation Form (EXACTLY Like Your First Code) */}
        <Grid
          item xs={12} md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#DEA385",
            padding: "20px",
            height: "100%", // Fixed height
          }}
        >
          <Box
            sx={{
              width: "400px",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: 3,
              overflowY: "auto", // Allow scrolling if needed
              maxHeight: "90%", // Prevent overflow
            }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Choose a Donation Amount
            </Typography>

            <RadioGroup>
              <FormControlLabel value="10" control={<Radio />} label="100 ksh" />
              <FormControlLabel value="25" control={<Radio />} label="250 ksh" />
              <FormControlLabel value="50" control={<Radio />} label="500 ksh" />
            </RadioGroup>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter custom amount"
              sx={{ backgroundColor: "white", borderRadius: 1, marginTop: 2 }}
            />

            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Choose a Donation Frequency
            </Typography>

            <RadioGroup row>
              <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
              <FormControlLabel value="one-time" control={<Radio />} label="One-time" />
            </RadioGroup>

            <Button
              variant="contained"
              fullWidth
              sx={{ marginTop: 2 , backgroundColor: "#C4B1CF", color: "white"}}
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