import { Box, Typography, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";


const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box sx={{ paddingTop: '20px', paddingLeft: '10px', paddingRight: '10px' }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ marginBottom: "20px", fontSize: "24px", fontWeight: "normal" }}
      >
        Support. Uplift. Inspire.
      </Typography>

      {/* Video Section */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
      <video 
  controls 
  style={{ 
    width: "100%", 
    maxWidth: "300px", 
    height: "200", 
    borderRadius: "10px" 
  }}
>
  <source src="/heavenaboutus.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>


      </Box>

      {/* Content Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <img src="/3rdbackgrnd.jpeg" alt="Heaven" style={{ width: '70%', height: 'auto', borderRadius: '10px' }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: "17px", lineHeight: 1.9 }}>
            Heaven is an innovative platform designed to bring together compassionate donors and orphanages in need. Our goal is to create a community of support, where orphanages can easily access resources and donors can make a direct impact. By facilitating these connections, we help provide essential care, education, and opportunities for orphaned and vulnerable children, paving the way for a brighter, sustainable future. Through collaboration, we are fostering positive change, one donation at a time.
          </Typography>

          <Link to="/signup">
            <Button variant="text" sx={{ marginTop: "20px", fontSize: "14px" }}>
              Join Us Today
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutPage;