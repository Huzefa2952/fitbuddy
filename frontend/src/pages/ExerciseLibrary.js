// Read-only exercise library page for the FitBuddy app.
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Chip, CircularProgress, Grid, Stack, TextField, Typography } from '@mui/material';
import api from '../services/api';

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exercises')
      .then((response) => {
        setExercises(response.data);
      })
      .catch(() => {
        setExercises([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredExercises = useMemo(() => {
    const term = search.toLowerCase();
    return exercises.filter((exercise) => exercise.name.toLowerCase().includes(term));
  }, [exercises, search]);

  return React.createElement(
    Box,
    { sx: { display: 'flex', flexDirection: 'column', gap: 3 } },
    React.createElement(
      Box,
      { sx: { display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2, alignItems: { xs: 'stretch', md: 'flex-end' } } },
      React.createElement(
        Box,
        null,
        React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'Exercise Library'),
        React.createElement(Typography, { color: 'text.secondary' }, 'Browse movements by name, muscle group, and difficulty level.')
      ),
      React.createElement(
        TextField,
        {
          label: 'Search by exercise name',
          value: search,
          onChange: (event) => setSearch(event.target.value),
          sx: { width: { xs: '100%', md: 360 } },
        }
      )
    ),
    loading
      ? React.createElement(Box, { sx: { display: 'flex', justifyContent: 'center', py: 6 } }, React.createElement(CircularProgress, null))
      : React.createElement(
          Grid,
          { container: true, spacing: 2 },
          filteredExercises.map((exercise) =>
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6, key: exercise.id },
              React.createElement(
                Card,
                { sx: { height: '100%', transition: 'transform 160ms ease, box-shadow 160ms ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } } },
                React.createElement(
                  CardContent,
                  { sx: { p: 3 } },
                  React.createElement(
                    Stack,
                    { direction: 'row', spacing: 1, sx: { mb: 2, flexWrap: 'wrap', gap: 1 } },
                    React.createElement(Chip, { label: exercise.muscle_group, color: 'primary', variant: 'outlined', size: 'small' }),
                    React.createElement(Chip, { label: exercise.difficulty, color: exercise.difficulty === 'Beginner' ? 'success' : 'secondary', size: 'small' })
                  ),
                  React.createElement(Typography, { variant: 'h6', gutterBottom: true }, exercise.name),
                  React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { lineHeight: 1.7 } }, exercise.description)
                )
              )
            )
          ),
          filteredExercises.length === 0
            ? React.createElement(
                Grid,
                { item: true, xs: 12 },
                React.createElement(
                  Card,
                  null,
                  React.createElement(
                    CardContent,
                    { sx: { textAlign: 'center', py: 5 } },
                    React.createElement(Typography, { variant: 'h6' }, 'No exercises found'),
                    React.createElement(Typography, { color: 'text.secondary' }, 'Try a different search term.')
                  )
                )
              )
            : null
        )
  );
}

export default ExerciseLibrary;
