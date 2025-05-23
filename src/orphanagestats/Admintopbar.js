import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const drawerWidth = 240;
const collapsedWidth=56;

export default function Admintopbar({ isSidebarOpen}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${isSidebarOpen ? drawerWidth : collapsedWidth}px)`,
          ml: `${isSidebarOpen ? drawerWidth : collapsedWidth}px`,
          backgroundColor: "#C4B1CF",
          zIndex: (theme) => theme.zIndex.drawer + 1  // ensures it's above the drawer
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Orphanage Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
