import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { UserButton } from '@clerk/clerk-react';
import Tooltip from '@mui/material/Tooltip';

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', paddingBottom: '0' }}>
        <Toolbar>
          {/* Logo and Title Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src="/heaventinylogo.png" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
            <Typography variant="h6" noWrap component="div" sx={{ color: 'black', fontWeight: 'bold' }}>
              Heaven
            </Typography>
          </Box>
          {/* Icons Section */}
          <IconButton size="large" aria-label="help" sx={{ color: '#C4B1CF' }}>
            <HelpOutlineIcon />
          </IconButton>

              <UserButton/>
          
        </Toolbar>
      </AppBar>
      </Box>

  );
}
