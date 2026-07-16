// Login page for the FitBuddy app.
import React, { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return React.createElement(
    Box,
    {
      sx: {
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 6,
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 52%, #ECFDF5 100%)',
      },
    },
    React.createElement(
      Box,
      { sx: { width: '100%', maxWidth: 980, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' }, gap: 3, alignItems: 'stretch' } },
      React.createElement(
        Box,
        {
          sx: {
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            color: '#FFFFFF',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 58%, #14B8A6 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 420,
          },
        },
        React.createElement(
          Box,
          null,
          React.createElement(Typography, { variant: 'h4', mb: 1 }, 'FitBuddy'),
          React.createElement(Typography, { sx: { color: 'rgba(255,255,255,0.86)', maxWidth: 420 } }, 'Build routines, browse exercises, and get practical workout guidance from one clean dashboard.')
        ),
        React.createElement(
          Stack,
          { spacing: 1.5 },
          ['Exercise library', 'Routine builder', 'AI-powered suggestions'].map((item) =>
            React.createElement(Typography, { key: item, sx: { fontWeight: 700 } }, item)
          )
        )
      ),
      React.createElement(
        Card,
        { sx: { alignSelf: 'center' } },
      React.createElement(
        CardContent,
        { sx: { p: { xs: 3, md: 4 } } },
        React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'Login'),
        React.createElement(Typography, { color: 'text.secondary', mb: 3 }, 'Welcome back to FitBuddy.'),
        error ? React.createElement(Alert, { severity: 'error', sx: { mb: 2 } }, error) : null,
        React.createElement(
          'form',
          { onSubmit: handleSubmit },
          React.createElement(
            Stack,
            { spacing: 2 },
            React.createElement(TextField, { label: 'Email', type: 'email', value: email, onChange: (event) => setEmail(event.target.value), fullWidth: true, required: true }),
            React.createElement(TextField, { label: 'Password', type: 'password', value: password, onChange: (event) => setPassword(event.target.value), fullWidth: true, required: true }),
            React.createElement(Button, { type: 'submit', variant: 'contained', size: 'large' }, 'Login')
          )
        ),
        React.createElement(Typography, { variant: 'body2', sx: { mt: 2 } }, 'No account yet? ' , React.createElement(Link, { to: '/register' }, 'Create one'))
      )
      )
    )
  );
}

export default Login;
