// Starter workout routines page for the FitBuddy app.
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function WorkoutRoutines() {
  return React.createElement(
    Card,
    null,
    React.createElement(
      CardContent,
      null,
      React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'Workout Routines'),
      React.createElement(
        Typography,
        { color: 'text.secondary' },
        'This page will later show user-created workout plans.'
      )
    )
  );
}

export default WorkoutRoutines;
