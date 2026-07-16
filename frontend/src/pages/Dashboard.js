// Dashboard page for the FitBuddy app.
import React from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
  { label: 'Exercise Library', value: '30+', caption: 'Seeded movements' },
  { label: 'Routine Builder', value: 'Custom', caption: 'Create plans your way' },
  { label: 'AI Suggestions', value: 'Ready', caption: 'Beginner-friendly guidance' },
];

const quickActions = [
  { label: 'Browse Exercises', path: '/exercises' },
  { label: 'Build a Routine', path: '/routines' },
  { label: 'Ask AI Assistant', path: '/ai' },
];

function Dashboard() {
  const { user } = useAuth();

  return React.createElement(
    Box,
    { sx: { display: 'flex', flexDirection: 'column', gap: 3 } },
    React.createElement(
      Box,
      {
        sx: {
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          color: '#FFFFFF',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 56%, #14B8A6 100%)',
          overflow: 'hidden',
          position: 'relative',
        },
      },
      React.createElement(
        Box,
        { sx: { maxWidth: 720, position: 'relative', zIndex: 1 } },
        React.createElement(Typography, { variant: 'overline', sx: { opacity: 0.86, fontWeight: 800 } }, 'FitBuddy Dashboard'),
        React.createElement(
          Typography,
          { variant: 'h3', sx: { mt: 1, mb: 1, fontSize: { xs: 32, md: 44 } } },
          `Welcome${user?.name ? `, ${user.name}` : ''}`
        ),
        React.createElement(
          Typography,
          { variant: 'body1', sx: { color: 'rgba(255,255,255,0.88)', maxWidth: 620 } },
          'Plan simple workouts, organize exercises into routines, and use the assistant when you need a practical starting point.'
        ),
        React.createElement(
          Stack,
          { direction: { xs: 'column', sm: 'row' }, spacing: 1.5, sx: { mt: 3 } },
          React.createElement(Button, { component: Link, to: '/routines', variant: 'contained', color: 'secondary' }, 'Create Routine'),
          React.createElement(Button, { component: Link, to: '/exercises', variant: 'outlined', sx: { color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.7)' } }, 'Explore Library')
        )
      )
    ),
    React.createElement(
      Grid,
      { container: true, spacing: 2 },
      ...stats.map((stat) =>
        React.createElement(
          Grid,
          { item: true, xs: 12, md: 4, key: stat.label },
          React.createElement(
            Card,
            { sx: { height: '100%' } },
            React.createElement(
              CardContent,
              { sx: { p: 3 } },
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary', fontWeight: 700 }, stat.label),
              React.createElement(Typography, { variant: 'h4', sx: { mt: 1, mb: 0.5 } }, stat.value),
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, stat.caption)
            )
          )
        )
      )
    ),
    React.createElement(
      Grid,
      { container: true, spacing: 2 },
      React.createElement(
        Grid,
        { item: true, xs: 12, md: 7 },
        React.createElement(
          Card,
          { sx: { height: '100%' } },
          React.createElement(
            CardContent,
            { sx: { p: 3 } },
            React.createElement(Typography, { variant: 'h5', mb: 1 }, 'How to use FitBuddy'),
            React.createElement(Typography, { color: 'text.secondary', mb: 2 }, 'A simple workflow for building a workout plan you can follow.'),
            React.createElement(
              Stack,
              { spacing: 1.5 },
              ['Pick exercises that match your goal and current level.', 'Create a routine and add the movements you want to train.', 'Ask the AI assistant for a beginner-friendly suggestion when you need help choosing.'].map((item, index) =>
                React.createElement(
                  Box,
                  { key: item, sx: { display: 'flex', gap: 1.5, alignItems: 'flex-start' } },
                  React.createElement(
                    Box,
                    {
                      sx: {
                        width: 28,
                        height: 28,
                        borderRadius: 1.5,
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'primary.light',
                        color: 'primary.dark',
                        fontWeight: 900,
                      },
                    },
                    index + 1
                  ),
                  React.createElement(Typography, { color: 'text.secondary' }, item)
                )
              )
            )
          )
        )
      ),
      React.createElement(
        Grid,
        { item: true, xs: 12, md: 5 },
        React.createElement(
          Card,
          { sx: { height: '100%' } },
          React.createElement(
            CardContent,
            { sx: { p: 3 } },
            React.createElement(Typography, { variant: 'h5', mb: 2 }, 'Quick Actions'),
            React.createElement(
              Stack,
              { spacing: 1.25 },
              ...quickActions.map((action) =>
                React.createElement(
                  Button,
                  {
                    key: action.label,
                    component: Link,
                    to: action.path,
                    variant: 'outlined',
                    fullWidth: true,
                    sx: { justifyContent: 'space-between', py: 1.2 },
                  },
                  action.label
                )
              )
            )
          )
        )
      )
    )
  );
}

export default Dashboard;
