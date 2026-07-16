// Main layout wrapper for FitBuddy with a polished app shell.
import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const navItems = [
  { label: 'Dashboard', path: '/', description: 'Overview' },
  { label: 'Exercise Library', path: '/exercises', description: 'Browse movements' },
  { label: 'Workout Routines', path: '/routines', description: 'Plan sessions' },
  { label: 'AI Assistant', path: '/ai', description: 'Get suggestions' },
];

function Layout() {
  const { user, logout } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'F';

  const navigationList = React.createElement(
    List,
    { sx: { px: 2, py: 1.5 } },
    ...navItems.map((item) =>
      React.createElement(
        ListItem,
        { key: item.label, disablePadding: true, sx: { mb: 0.75 } },
        React.createElement(
          ListItemButton,
          {
            component: NavLink,
            to: item.path,
            end: item.path === '/',
            sx: {
              borderRadius: 2,
              px: 2,
              py: 1.25,
              color: 'text.secondary',
              '&.active': {
                backgroundColor: 'primary.light',
                color: 'primary.dark',
                '& .MuiListItemText-primary': { fontWeight: 800 },
              },
              '&:hover': {
                backgroundColor: '#F1F5F9',
              },
            },
          },
          React.createElement(ListItemText, {
            primary: item.label,
            secondary: item.description,
            primaryTypographyProps: { fontSize: 14, fontWeight: 700 },
            secondaryTypographyProps: { fontSize: 12 },
          })
        )
      )
    )
  );

  return React.createElement(
    Box,
    { sx: { display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' } },
    React.createElement(CssBaseline, null),
    React.createElement(
      AppBar,
      {
        position: 'fixed',
        elevation: 0,
        sx: {
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        },
      },
      React.createElement(
        Toolbar,
        { sx: { minHeight: 72, justifyContent: 'space-between', px: { xs: 2, md: 3 } } },
        React.createElement(
          Box,
          { sx: { display: 'flex', alignItems: 'center', gap: 1.5 } },
          React.createElement(
            Box,
            {
              sx: {
                width: 38,
                height: 38,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                backgroundColor: 'primary.main',
                color: '#FFFFFF',
                fontWeight: 900,
              },
            },
            'FB'
          ),
          React.createElement(
            Box,
            null,
            React.createElement(Typography, { variant: 'h6', noWrap: true }, 'FitBuddy'),
            React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, 'Fitness planning dashboard')
          )
        ),
        React.createElement(
          Box,
          { sx: { display: 'flex', alignItems: 'center', gap: 1.5 } },
          user
            ? React.createElement(
                Box,
                { sx: { display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 } },
                React.createElement(Avatar, { sx: { width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14, fontWeight: 800 } }, initial),
                React.createElement(
                  Box,
                  null,
                  React.createElement(Typography, { variant: 'body2', fontWeight: 800 }, user.name),
                  React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, 'Member')
                )
              )
            : null,
          user ? React.createElement(Button, { variant: 'outlined', color: 'primary', onClick: logout }, 'Logout') : null
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
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#FFFFFF',
          },
        },
      },
      React.createElement(Toolbar, { sx: { minHeight: 72 } }),
      React.createElement(
        Box,
        { sx: { px: 2, pt: 2, pb: 1 } },
        React.createElement(Typography, { variant: 'overline', color: 'text.secondary', fontWeight: 800 }, 'Workspace')
      ),
      navigationList,
      React.createElement(
        Box,
        { sx: { mt: 'auto', mx: 2, mb: 2, p: 2, borderRadius: 2, backgroundColor: '#F8FAFC', border: '1px solid', borderColor: 'divider' } },
        React.createElement(Typography, { variant: 'subtitle2', fontWeight: 800 }, "Today's Focus"),
        React.createElement(Typography, { variant: 'body2', color: 'text.secondary', mt: 0.5 }, 'Build a routine you can repeat consistently.')
      )
    ),
    React.createElement(
      Box,
      {
        component: 'main',
        sx: {
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 2, sm: 3, lg: 4 },
          py: 3,
          ml: { xs: 0, md: 0 },
          backgroundColor: 'background.default',
        },
      },
      React.createElement(Toolbar, { sx: { minHeight: 72 } }),
      React.createElement(Box, { sx: { maxWidth: 1180, mx: 'auto' } }, React.createElement(Outlet, null))
    )
  );
}

export default Layout;
