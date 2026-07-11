// Workout routines manager page for the FitBuddy app.
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function WorkoutRoutines() {
  const { token } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routineName, setRoutineName] = useState('');
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [routineResponse, exerciseResponse] = await Promise.all([
        api.get('/routines', { headers }),
        api.get('/exercises', { headers }),
      ]);
      setRoutines(routineResponse.data);
      setExercises(exerciseResponse.data);
    } catch (err) {
      setError('Unable to load routines right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const openCreateDialog = () => {
    setEditingRoutine(null);
    setRoutineName('');
    setDialogOpen(true);
  };

  const openEditDialog = (routine) => {
    setEditingRoutine(routine);
    setRoutineName(routine.name);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRoutine(null);
    setRoutineName('');
  };

  const handleSaveRoutine = async () => {
    try {
      if (editingRoutine) {
        await api.put(`/routines/${editingRoutine.id}`, { name: routineName }, { headers });
      } else {
        await api.post('/routines', { name: routineName }, { headers });
      }
      closeDialog();
      setMessage(editingRoutine ? 'Routine updated.' : 'Routine created.');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save routine.');
    }
  };

  const handleDeleteRoutine = async (routineId) => {
    try {
      await api.delete(`/routines/${routineId}`, { headers });
      setMessage('Routine deleted.');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete routine.');
    }
  };

  const handleAddExercise = async (routineId) => {
    try {
      await api.post(`/routines/${routineId}/exercise`, { exercise_id: selectedExerciseId }, { headers });
      setSelectedExerciseId('');
      setMessage('Exercise added.');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add exercise.');
    }
  };

  const handleRemoveExercise = async (routineId, exerciseId) => {
    try {
      await api.delete(`/routines/${routineId}/exercise/${exerciseId}`, { headers });
      setMessage('Exercise removed.');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not remove exercise.');
    }
  };

  const renderRoutineCard = (routine) => {
    const exerciseOptions = exercises.map((exercise) =>
      React.createElement(MenuItem, { key: exercise.id, value: exercise.id }, exercise.name)
    );

    const exerciseList =
      routine.exercises && routine.exercises.length > 0
        ? React.createElement(
            Stack,
            { direction: 'row', spacing: 1, sx: { flexWrap: 'wrap', gap: 1, mb: 2 } },
            ...routine.exercises.map((item) =>
              React.createElement(Chip, {
                key: item.id,
                label: item.name,
                onDelete: () => handleRemoveExercise(routine.id, item.exercise_id),
              })
            )
          )
        : React.createElement(Typography, { color: 'text.secondary', mb: 2 }, 'No exercises yet.');

    return React.createElement(
      Grid,
      { item: true, xs: 12, md: 6, key: routine.id },
      React.createElement(
        Card,
        { sx: { height: '100%' } },
        React.createElement(
          CardContent,
          null,
          React.createElement(Typography, { variant: 'h6', gutterBottom: true }, routine.name),
          React.createElement(
            Stack,
            { direction: 'row', spacing: 1, sx: { mb: 2 } },
            React.createElement(Button, { variant: 'outlined', size: 'small', onClick: () => openEditDialog(routine) }, 'Edit'),
            React.createElement(Button, { variant: 'outlined', color: 'error', size: 'small', onClick: () => handleDeleteRoutine(routine.id) }, 'Delete')
          ),
          React.createElement(Typography, { variant: 'subtitle2', gutterBottom: true }, 'Exercises'),
          exerciseList,
          React.createElement(
            Stack,
            { direction: { xs: 'column', sm: 'row' }, spacing: 1, alignItems: 'center' },
            React.createElement(
              FormControl,
              { size: 'small', sx: { minWidth: 220 } },
              React.createElement(InputLabel, { id: `exercise-select-${routine.id}` }, 'Add exercise'),
              React.createElement(
                Select,
                {
                  labelId: `exercise-select-${routine.id}`,
                  value: selectedRoutineId === routine.id ? selectedExerciseId : '',
                  label: 'Add exercise',
                  onChange: (event) => {
                    setSelectedRoutineId(routine.id);
                    setSelectedExerciseId(event.target.value);
                  },
                },
                exerciseOptions
              )
            ),
            React.createElement(
              Button,
              {
                variant: 'contained',
                size: 'small',
                onClick: () => handleAddExercise(routine.id),
                disabled: !selectedExerciseId || selectedRoutineId !== routine.id,
              },
              'Add Exercise'
            )
          )
        )
      )
    );
  };

  return React.createElement(
    Box,
    { sx: { display: 'flex', flexDirection: 'column', gap: 3 } },
    React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'Workout Routines'),
    React.createElement(Typography, { color: 'text.secondary', mb: 2 }, 'Create, edit, and manage your workout routines.'),
    error ? React.createElement(Alert, { severity: 'error', sx: { mb: 2 } }, error) : null,
    message ? React.createElement(Alert, { severity: 'success', sx: { mb: 2 } }, message) : null,
    React.createElement(Button, { variant: 'contained', onClick: openCreateDialog, sx: { alignSelf: 'flex-start' } }, 'Create Routine'),
    loading
      ? React.createElement(Box, { sx: { display: 'flex', justifyContent: 'center', py: 6 } }, React.createElement(CircularProgress, null))
      : React.createElement(Grid, { container: true, spacing: 2 }, ...routines.map(renderRoutineCard)),
    React.createElement(
      Dialog,
      { open: dialogOpen, onClose: closeDialog },
      React.createElement(DialogTitle, null, editingRoutine ? 'Edit Routine' : 'Create Routine'),
      React.createElement(
        DialogContent,
        null,
        React.createElement(TextField, {
          autoFocus: true,
          margin: 'dense',
          label: 'Routine Name',
          fullWidth: true,
          value: routineName,
          onChange: (event) => setRoutineName(event.target.value),
        })
      ),
      React.createElement(
        DialogActions,
        null,
        React.createElement(Button, { onClick: closeDialog }, 'Cancel'),
        React.createElement(Button, { onClick: handleSaveRoutine, variant: 'contained' }, editingRoutine ? 'Save Changes' : 'Create')
      )
    )
  );
}

export default WorkoutRoutines;
