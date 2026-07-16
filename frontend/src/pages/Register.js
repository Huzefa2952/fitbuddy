// Register page for the FitBuddy app.
import React, { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await register(name, email, password);
      setSuccess('Account created successfully. You can now log in.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
            minHeight: 460,
          },
        },
        React.createElement(
          Box,
          null,
          React.createElement(Typography, { variant: 'h4', mb: 1 }, 'Start with FitBuddy'),
          React.createElement(Typography, { sx: { color: 'rgba(255,255,255,0.86)', maxWidth: 420 } }, 'Create your account and keep your routines organized in a simple, focused workspace.')
        ),
        React.createElement(
          Stack,
          { spacing: 1.5 },
          ['Secure account access', 'Saved workout routines', 'Exercise suggestions when you need them'].map((item) =>
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
        React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'Register'),
        React.createElement(Typography, { color: 'text.secondary', mb: 3 }, 'Create your FitBuddy account.'),
        error ? React.createElement(Alert, { severity: 'error', sx: { mb: 2 } }, error) : null,
        success ? React.createElement(Alert, { severity: 'success', sx: { mb: 2 } }, success) : null,
        React.createElement(
          'form',
          { onSubmit: handleSubmit },
          React.createElement(
            Stack,
            { spacing: 2 },
            React.createElement(TextField, { label: 'Name', value: name, onChange: (event) => setName(event.target.value), fullWidth: true, required: true }),
            React.createElement(TextField, { label: 'Email', type: 'email', value: email, onChange: (event) => setEmail(event.target.value), fullWidth: true, required: true }),
            React.createElement(TextField, { label: 'Password', type: 'password', value: password, onChange: (event) => setPassword(event.target.value), fullWidth: true, required: true }),
            React.createElement(Button, { type: 'submit', variant: 'contained', size: 'large' }, 'Create account')
          )
        ),
        React.createElement(Typography, { variant: 'body2', sx: { mt: 2 } }, 'Already have an account? ', React.createElement(Link, { to: '/login' }, 'Login'))
      )
      )
    )
  );
}

export default Register;
