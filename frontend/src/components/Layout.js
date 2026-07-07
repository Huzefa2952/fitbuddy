// Main layout wrapper for FitBuddy with a top app bar and side drawer.
import React from 'react';
import { AppBar, Box, Button, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Exercise Library', path: '/exercises' },
  { label: 'Workout Routines', path: '/routines' },
  { label: 'AI Assistant', path: '/ai' },
];

function Layout() {
  const { user, logout } = useAuth();

  const drawerPaperStyles = {
    width: drawerWidth,
    boxSizing: 'border-box',
  };

  const navigationList = React.createElement(
    List,
    null,
    ...navItems.map((item) =>
      React.createElement(
        ListItem,
        { key: item.label, disablePadding: true },
        React.createElement(
          ListItemButton,
          { component: NavLink, to: item.path, end: true },
          React.createElement(ListItemText, { primary: item.label })
        )
      )
    )
  );

  return React.createElement(
    Box,
    { sx: { display: 'flex', minHeight: '100vh' } },
    React.createElement(CssBaseline, null),
    React.createElement(
      AppBar,
      { position: 'fixed', sx: { zIndex: (theme) => theme.zIndex.drawer + 1 } },
      React.createElement(
        Toolbar,
        { sx: { justifyContent: 'space-between' } },
        React.createElement(Typography, { variant: 'h6', noWrap: true, component: 'div' }, 'FitBuddy'),
        React.createElement(
          Box,
          { sx: { display: 'flex', alignItems: 'center', gap: 2 } },
          user ? React.createElement(Typography, { variant: 'body1' }, `Welcome ${user.name}`) : null,
          user ? React.createElement(Button, { color: 'inherit', onClick: logout }, 'Logout') : null
        )
      )
    ),
    React.createElement(
      Drawer,
      {
        variant: 'permanent',
        sx: {
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': drawerPaperStyles,
        },
      },
      React.createElement(Toolbar, null),
      React.createElement(Box, { sx: { overflow: 'auto' } }, navigationList)
    ),
    React.createElement(
      Box,
      { component: 'main', sx: { flexGrow: 1, p: 3, backgroundColor: '#f5f7fb' } },
      React.createElement(Toolbar, null),
      React.createElement(Outlet, null)
    )
  );
}

export default Layout;
