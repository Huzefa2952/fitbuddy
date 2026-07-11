// Read-only exercise library page for the FitBuddy app.
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, CircularProgress, Grid, TextField, Typography } from '@mui/material';
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
    React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'Exercise Library'),
    React.createElement(
      TextField,
      {
        label: 'Search by exercise name',
        variant: 'outlined',
        value: search,
        onChange: (event) => setSearch(event.target.value),
        sx: { maxWidth: 420 },
      }
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
                { sx: { height: '100%' } },
                React.createElement(
                  CardContent,
                  null,
                  React.createElement(Typography, { variant: 'h6', gutterBottom: true }, exercise.name),
                  React.createElement(Typography, { color: 'text.secondary', mb: 1 }, `Muscle Group: ${exercise.muscle_group}`),
                  React.createElement(Typography, { color: 'text.secondary', mb: 1 }, `Difficulty: ${exercise.difficulty}`),
                  React.createElement(Typography, { variant: 'body2' }, exercise.description)
                )
              )
            )
          )
        )
  );
}

export default ExerciseLibrary;
