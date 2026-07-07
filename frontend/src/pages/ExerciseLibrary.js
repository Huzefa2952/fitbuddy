// Starter exercise library page for the FitBuddy app.
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function ExerciseLibrary() {
  return React.createElement(
    Card,
    null,
    React.createElement(
      CardContent,
      null,
      React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'Exercise Library'),
      React.createElement(
        Typography,
        { color: 'text.secondary' },
        'This placeholder page will later display exercises from the backend.'
      )
    )
  );
}

export default ExerciseLibrary;
