import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import { Dashboard, MonetizationOn, People, BarChart, Settings } from "@mui/icons-material";

const drawerWidth = 240;
const collapsedWidth=56;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#E4AC80',
  flexShrink: '0'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#E4AC80',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  flexShrink: '0'
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Adminsidenav = ({isSidebarOpen, setIsSidebarOpen}) => {

  const handleDrawerToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigationItems = [
    { text: "Dashboard", icon: <Dashboard sx={{ color: "black" }} />, path: "/orphanageDashboard" },
    { text: "Donations", icon: <MonetizationOn sx={{ color: "black" }} />, path: "/admin-donations" },
    { text: "Sponsorships", icon: <People sx={{ color: "black" }} />, path: "/sponsorshipspage" },
    { text: "Reports", icon: <BarChart sx={{ color: "black" }} />, path: "/reports" },
    { text: "Settings", icon: <Settings sx={{ color: "black" }} />, path: "/settings" }
  ];

  return (
    <Drawer variant="permanent" open={isSidebarOpen} sx={{
      width: isSidebarOpen ? drawerWidth : collapsedWidth,
      flexShrink: 0,
      transition: "width 0.3s ease",
      "& .MuiDrawer-paper": {
          width: isSidebarOpen ? drawerWidth : collapsedWidth,
          transition: "width 0.3s ease",
          position: "fixed",
        },
  }}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'black' }}>
          <ViewSidebarIcon />
          {isSidebarOpen && <ListItemText primary="Toggle Sidebar" sx={{ marginLeft: 1, color: 'black' }} />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton href={item.path}
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: isSidebarOpen ? 'initial' : 'center',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  color: 'black',
                  mr: isSidebarOpen ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: 'black',
                  opacity: isSidebarOpen ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default Adminsidenav;