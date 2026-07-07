// Starter dashboard page for the FitBuddy app.
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function Dashboard() {
  return React.createElement(
    Card,
    null,
    React.createElement(
      CardContent,
      null,
      React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'Dashboard'),
      React.createElement(
        Typography,
        { color: 'text.secondary' },
        'This is the starter dashboard for FitBuddy. More features will be added soon.'
      )
    )
  );
}

export default Dashboard;
