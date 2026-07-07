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
    { sx: { maxWidth: 480, mx: 'auto', mt: 8 } },
    React.createElement(
      Card,
      null,
      React.createElement(
        CardContent,
        null,
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
  );
}

export default Register;
