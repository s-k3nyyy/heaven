import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Container, 
  Card, 
  CardContent, 
  CardMedia, 
  Avatar, 
  Rating,
  useMediaQuery,
  IconButton
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTheme } from '@mui/material/styles';

// Custom styled components
const HeroText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
}));

const SubText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
}));

const TestimonialCard = styled(Card)(({ theme, active }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  transition: 'all 0.3s ease',
  transform: active ? 'scale(1.05)' : 'scale(1)',
  backgroundColor: active ? '#E4AC80' : theme.palette.background.paper, // Changed from theme.palette.primary.main to #E4AC80
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    boxShadow: theme.shadows[10],
  },
}));

const TestimonialAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginBottom: theme.spacing(2),
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

const QuoteText = styled(Typography)(({ theme, active }) => ({
  fontStyle: 'italic',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'relative',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#E4AC80', // Changed from theme.palette.primary.main to #E4AC80
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: '#D39B6F', // Slightly darker shade for hover
  },
}));

const BlogPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const testimonials = [
    {
      name: "Mary Atieno",
      title: "Director, Bright Future Home",
      quote: "Thanks to this platform, we received funding for new school supplies in just a few days. The support has been overwhelming and life-changing.",
      avatar: "/path-to-avatar-1.jpg" // Replace with actual path
    },
    {
      name: "James Kariuki",
      title: "Donor from Nairobi",
      quote: "Sponsoring a child was incredibly easy. I received updates, and seeing the child smile made it all worthwhile. This platform truly bridges hearts.",
      avatar: "/path-to-avatar-2.jpg" // Replace with actual path
    },
    {
      name: "Esther Mumo",
      title: "Hope Orphanage Manager",
      quote: "Before joining, our orphanage struggled with visibility. Now, we're getting help from kind donors across Kenya and beyond.",
      avatar: "/path-to-avatar-3.jpg" // Replace with actual path
    },
    {
      name: "Amina Shah",
      title: "Monthly Donor",
      quote: "I love that I can choose specific needs to support—whether it's health, food, or school fees. It's personal and impactful.",
      avatar: "/path-to-avatar-4.jpg" // Replace with actual path
    },
    {
      name: "Peter Onyango",
      title: "Volunteer at Smile Children's Home",
      quote: "This system made it easy to reach sponsors for our kids. It's a blessing to finally have a central place to tell our story.",
      avatar: "/path-to-avatar-5.jpg" // Replace with actual path
    },
    {
      name: "Kevin (Age 9)",
      title: "Beneficiary at Hope Orphanage",
      quote: "I now have new shoes and books because someone cared. Thank you for helping me go back to school.",
      avatar: "/path-to-avatar-6.jpg" // Replace with actual path
    }
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = isMobile ? 1 : 3;
  const pageCount = Math.ceil(testimonials.length / testimonialsPerPage);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % pageCount);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
  };

  const currentTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage * testimonialsPerPage) + testimonialsPerPage
  );

  return (
    <Container maxWidth="lg">
      {/* Testimonials Section Header - Moved to the top */}
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          User Testimonials
        </Typography>
        
        {/* Slogan - Moved under the header */}
        <SubText variant="h5">
          Connected compassionate hearts with children in need
        </SubText>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ mb: 10 }}>
        <Box sx={{ position: 'relative', px: { xs: 0, md: 6 } }}>
          {/* Navigation Buttons */}
          {pageCount > 1 && (
            <>
              <Box sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
                <NavButton onClick={handlePrev} aria-label="previous testimonials">
                  <ArrowBackIosNewIcon />
                </NavButton>
              </Box>
              <Box sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
                <NavButton onClick={handleNext} aria-label="next testimonials">
                  <ArrowForwardIosIcon />
                </NavButton>
              </Box>
            </>
          )}
          
          <Grid container spacing={3}>
            {currentTestimonials.map((testimonial, index) => {
              const isMiddle = !isMobile && index === 1;
              return (
                <Grid item xs={12} md={4} key={`${currentPage}-${index}`}>
                  <TestimonialCard elevation={isMiddle ? 8 : 3} active={isMiddle}>
                    <TestimonialAvatar src={testimonial.avatar} alt={testimonial.name} />
                    <Rating 
                      value={5} 
                      readOnly 
                      sx={{ mb: 1, color: isMiddle ? 'white' : '#E4AC80' }} // Changed color here too
                    />
                    <Typography variant="h6" component="h3" align="center" sx={{ fontWeight: 'bold' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      align="center" 
                      sx={{ mb: 2, color: isMiddle ? 'rgba(255,255,255,0.8)' : theme.palette.text.secondary }}
                    >
                      {testimonial.title}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                      <Typography variant="h3" sx={{ fontFamily: 'serif' }}>
                        "
                      </Typography>
                    </Box>
                    <QuoteText variant="body1" align="center" active={isMiddle}>
                      {testimonial.quote}
                    </QuoteText>
                  </TestimonialCard>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        
        {/* Pagination Dots */}
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {[...Array(pageCount)].map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentPage(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  mx: 0.5,
                  backgroundColor: currentPage === index ? '#E4AC80' : theme.palette.grey[300], // Changed color
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: currentPage === index ? '#E4AC80' : theme.palette.grey[400], // Changed color
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>
      
      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', py: 6, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Make a Difference Today
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Join our community and help change lives through compassion and support.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            px: 5, 
            py: 1.5, 
            borderRadius: 2,
            backgroundColor: '#E4AC80', // Changed color
            '&:hover': {
              backgroundColor: '#D39B6F', // Slightly darker shade for hover
            }
          }}
          size="large"
          component={Link}
          to="/donate"
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default BlogPage;