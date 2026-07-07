// Simple AI assistant page for the FitBuddy app.
import React, { useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function AIAssistant() {
  const { token } = useAuth();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/ai/suggest', { question }, { headers });
      setAnswer(response.data.answer || '');
      setSources(response.data.sources || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to get an answer right now.');
      setAnswer('');
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    Box,
    { sx: { display: 'flex', flexDirection: 'column', gap: 3 } },
    React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'AI Assistant'),
    React.createElement(Typography, { color: 'text.secondary', mb: 2 }, 'Ask about beginner-friendly workout ideas and get suggestions from the exercise library.'),
    React.createElement(
      Card,
      { sx: { maxWidth: 800 } },
      React.createElement(
        CardContent,
        null,
        React.createElement(
          'form',
          { onSubmit: handleSubmit },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Ask a fitness question',
            value: question,
            onChange: (event) => setQuestion(event.target.value),
            placeholder: 'What are good beginner chest exercises?',
            multiline: true,
            minRows: 3,
            sx: { mb: 2 },
          }),
          React.createElement(Button, { type: 'submit', variant: 'contained', disabled: loading }, loading ? React.createElement(CircularProgress, { size: 20, sx: { mr: 1 } }) : null, 'Ask Assistant')
        ),
        error ? React.createElement(Alert, { severity: 'error', sx: { mt: 2 } }, error) : null,
        answer ? React.createElement(Paper, { elevation: 0, sx: { mt: 3, p: 2, backgroundColor: '#f5f7fb' } },
          React.createElement(Typography, { variant: 'subtitle1', fontWeight: 600, mb: 1 }, 'You asked:'),
          React.createElement(Typography, { mb: 2 }, question),
          React.createElement(Typography, { variant: 'subtitle1', fontWeight: 600, mb: 1 }, 'AI Response:'),
          React.createElement(Typography, { mb: 2 }, answer),
          React.createElement(Typography, { variant: 'subtitle1', fontWeight: 600, mb: 1 }, 'Sources Used:'),
          React.createElement(Stack, { direction: 'row', spacing: 1, sx: { flexWrap: 'wrap', gap: 1 } }, sources.map((source) => React.createElement(Typography, { key: source, component: 'span', sx: { px: 1.5, py: 0.75, borderRadius: 999, backgroundColor: '#e3f2fd' } }, source)))) : null
      )
    )
  );
}

export default AIAssistant;
