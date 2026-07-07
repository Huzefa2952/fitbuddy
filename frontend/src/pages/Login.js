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
    { sx: { maxWidth: 480, mx: 'auto', mt: 8 } },
    React.createElement(
      Card,
      null,
      React.createElement(
        CardContent,
        null,
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
  );
}

export default Login;
