// Starter AI assistant page for the FitBuddy app.
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function AIAssistant() {
  return React.createElement(
    Card,
    null,
    React.createElement(
      CardContent,
      null,
      React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'AI Assistant'),
      React.createElement(
        Typography,
        { color: 'text.secondary' },
        'This placeholder page will later connect to the backend AI endpoint.'
      )
    )
  );
}

export default AIAssistant;
