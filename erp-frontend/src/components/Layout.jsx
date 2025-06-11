import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
  AppBar,
  Typography,
} from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const navItems = [
  { label: 'Categories', path: '/categories' },
  { label: 'Models', path: '/models' },
  { label: 'Variants', path: '/variants' },
  { label: 'Custom Fields', path: '/custom-fields' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Sanjaqak ERP
            </Link>
          </Typography>
            {/* <img
              src="/logo.svg"
              alt="ERP Logo"
              style={{ width: 200, height: 80, marginleft: 16 }}
            /> */}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Spacer for AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
}
