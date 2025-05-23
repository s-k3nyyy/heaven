import '../App.css';
import { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Badge, Button, Card, CardContent, CardMedia, TextField, Select, MenuItem as MuiMenuItem, LinearProgress, Grid, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

//  Child Data
const children = [
  { id: 1, name: 'Alvin Waweru', age: 6, location: 'Nairobi', needs: 'School Fees, health bills', image: '/child1.jpeg', progress: 60 },
  { id: 2, name: 'John Juma', age: 9, location: 'Mombasa', needs: 'Uniform, Meals', image: '/child2.jpeg', progress: 40 },
  { id: 3, name: 'Emily Obiero', age: 14, location: 'Kisumu', needs: 'School Supplies ,fees', image: '/child3.jpeg', progress: 80 },
];
  
export default function SponsorChildPage() {
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const navigate = useNavigate(); // ✅ Define navigate
  
  const filteredChildren = children.filter(
    (child) =>
      child.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterLocation ? child.location === filterLocation : true)
  );

  return (
    <Box sx={{ flexGrow: 1, paddingBottom: '50px' }}>
      {/* Navigation Bar */}
      <AppBar position="fixed" sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'black', fontWeight: 'bold' }}>
            Sponsor a Child
          </Typography>
          <IconButton size="large" sx={{ color: '#C4B1CF' }}>
            <HelpOutlineIcon />
          </IconButton>
          <IconButton size="large" sx={{ color: '#C4B1CF' }}>
            <Badge badgeContent={5} color="error">
              <CircleNotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton size="large" sx={{ color: '#C4B1CF' }}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Filters */}
      <Box sx={{ paddingTop: '80px', padding: 2, textAlign: 'center' }}>
        <TextField label="Search by Name" variant="outlined" size="small" sx={{ marginRight: 2 }} onChange={(e) => setSearch(e.target.value)} />
        <Select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} displayEmpty size="small">
        <MuiMenuItem value="">Locations</MuiMenuItem>
        <MuiMenuItem value="Nairobi">Nairobi</MuiMenuItem>
        <MuiMenuItem value="Mombasa">Mombasa</MuiMenuItem>
        <MuiMenuItem value="Kisumu">Kisumu</MuiMenuItem>
        <MuiMenuItem value="Baringo">Baringo</MuiMenuItem>
        <MuiMenuItem value="Bomet">Bomet</MuiMenuItem>
        <MuiMenuItem value="Bungoma">Bungoma</MuiMenuItem>
        <MuiMenuItem value="Busia">Busia</MuiMenuItem>
        <MuiMenuItem value="Elgeyo Marakwet">Elgeyo Marakwet</MuiMenuItem>
        <MuiMenuItem value="Embu">Embu</MuiMenuItem>
        <MuiMenuItem value="Garissa">Garissa</MuiMenuItem>
        <MuiMenuItem value="Homa Bay">Homa Bay</MuiMenuItem>
        <MuiMenuItem value="Isiolo">Isiolo</MuiMenuItem>
        <MuiMenuItem value="Kajiado">Kajiado</MuiMenuItem>
        <MuiMenuItem value="Kakamega">Kakamega</MuiMenuItem>
        <MuiMenuItem value="Kericho">Kericho</MuiMenuItem>
        <MuiMenuItem value="Kiambu">Kiambu</MuiMenuItem>
        <MuiMenuItem value="Kilifi">Kilifi</MuiMenuItem>
        <MuiMenuItem value="Kirinyaga">Kirinyaga</MuiMenuItem>
        <MuiMenuItem value="Kisii">Kisii</MuiMenuItem>
        <MuiMenuItem value="Kisumu">Kisumu</MuiMenuItem>
        <MuiMenuItem value="Kitui">Kitui</MuiMenuItem>
        <MuiMenuItem value="Kwale">Kwale</MuiMenuItem>
        <MuiMenuItem value="Laikipia">Laikipia</MuiMenuItem>
        <MuiMenuItem value="Lamu">Lamu</MuiMenuItem>
        <MuiMenuItem value="Machakos">Machakos</MuiMenuItem>
        <MuiMenuItem value="Makueni">Makueni</MuiMenuItem>
        <MuiMenuItem value="Mandera">Mandera</MuiMenuItem>
        <MuiMenuItem value="Marsabit">Marsabit</MuiMenuItem>
        <MuiMenuItem value="Meru">Meru</MuiMenuItem>
        <MuiMenuItem value="Migori">Migori</MuiMenuItem>
        <MuiMenuItem value="Mombasa">Mombasa</MuiMenuItem>
        <MuiMenuItem value="Murang'a">Murang'a</MuiMenuItem>
        <MuiMenuItem value="Nairobi">Nairobi</MuiMenuItem>
        <MuiMenuItem value="Nakuru">Nakuru</MuiMenuItem>
        <MuiMenuItem value="Nandi">Nandi</MuiMenuItem>
        <MuiMenuItem value="Narok">Narok</MuiMenuItem>
        <MuiMenuItem value="Nyamira">Nyamira</MuiMenuItem>
        <MuiMenuItem value="Nyandarua">Nyandarua</MuiMenuItem>
        <MuiMenuItem value="Nyeri">Nyeri</MuiMenuItem>
        <MuiMenuItem value="Samburu">Samburu</MuiMenuItem>
        <MuiMenuItem value="Siaya">Siaya</MuiMenuItem>
        <MuiMenuItem value="Taita Taveta">Taita Taveta</MuiMenuItem>
        <MuiMenuItem value="Tana River">Tana River</MuiMenuItem>
        <MuiMenuItem value="Tharaka Nithi">Tharaka Nithi</MuiMenuItem>
        <MuiMenuItem value="Trans Nzoia">Trans Nzoia</MuiMenuItem>
        <MuiMenuItem value="Turkana">Turkana</MuiMenuItem>
        <MuiMenuItem value="Uasin Gishu">Uasin Gishu</MuiMenuItem>
        <MuiMenuItem value="Vihiga">Vihiga</MuiMenuItem>
        <MuiMenuItem value="Wajir">Wajir</MuiMenuItem>
        <MuiMenuItem value="West Pokot">West Pokot</MuiMenuItem>
      </Select>
      </Box>

      {/* Child Cards (Square Design) */}
      <Grid container spacing={2} justifyContent="center">
        {filteredChildren.map((child) => (
          <Grid item key={child.id}>
            <Card sx={{ 
              width: 250,
              height: 320,
              textAlign: 'center', 
              backgroundColor: '#DEA385', 
              padding: 1,
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center' }
              }>
              <CardMedia
               component="img" 
               image={child.image} 
               alt={child.name} 
               sx={{
                 width: 150, 
                 height: 150,
                 borderRadius: '10px',
                 objectFit: 'cover', 
                 marginTop: 1 }} />
              <CardContent 
              sx={{
                 padding: 1,
                  width: '100%',
                  gap: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '16px' }}>{child.name}</Typography>
                <Typography variant="body2">{child.location}</Typography>
                <Typography variant="body2">{child.needs}</Typography>
                <LinearProgress variant="determinate" value={child.progress} sx={{ marginY: 1, height: 6, borderRadius: 3 }} />
                <Button
                 variant="contained"
                  sx={{ backgroundColor: '#C4B1CF', color: 'black', fontSize: '12px' }}
                   onClick={() => navigate('/SponsorshipForm')}>
                  Sponsor Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sponsorship Stats (Square Cards) */}
      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 4 }}>
        <Grid item>
          <Paper sx={{ width: 250, height: 150, textAlign: 'center', padding: 2, backgroundColor: '#C4B1CF' }}>
            <Typography variant="h6">Total Kids Sponsored</Typography>
            <Typography variant="h4">50</Typography>
          </Paper>
        </Grid>
        <Grid item>
          <Paper sx={{ width: 250, height: 150, textAlign: 'center', padding: 2, backgroundColor: '#DEA385' }}>
            <Typography variant="h6">Pending Sponsorships</Typography>
            <Typography variant="h4">20</Typography>
          </Paper>
        </Grid>
        <Grid item>
          <Paper sx={{ width: 250, height: 150, textAlign: 'center', padding: 2, backgroundColor: '#9AA27D' }}>
            <Typography variant="h6">Urgent Cases</Typography>
            <Typography variant="h4" sx={{ color: 'red' }}>5</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
