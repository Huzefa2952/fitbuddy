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
    React.createElement(
      Box,
      null,
      React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'AI Assistant'),
      React.createElement(Typography, { color: 'text.secondary' }, 'Ask about beginner-friendly workout ideas and get suggestions from the exercise library.')
    ),
    React.createElement(
      Card,
      { sx: { maxWidth: 860 } },
      React.createElement(
        CardContent,
        { sx: { p: { xs: 3, md: 4 } } },
        React.createElement(
          Box,
          { sx: { p: 2.5, mb: 3, borderRadius: 2, backgroundColor: '#F8FAFC', border: '1px solid', borderColor: 'divider' } },
          React.createElement(Typography, { variant: 'subtitle1', fontWeight: 800 }, 'Try asking'),
          React.createElement(Typography, { variant: 'body2', color: 'text.secondary', mt: 0.5 }, 'What are good beginner chest exercises?')
        ),
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
          React.createElement(Button, { type: 'submit', variant: 'contained', size: 'large', disabled: loading }, loading ? React.createElement(CircularProgress, { size: 20, sx: { mr: 1, color: 'inherit' } }) : null, 'Ask Assistant')
        ),
        error ? React.createElement(Alert, { severity: 'error', sx: { mt: 2 } }, error) : null,
        answer ? React.createElement(Paper, { elevation: 0, sx: { mt: 3, p: 3, backgroundColor: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 2 } },
          React.createElement(Typography, { variant: 'overline', color: 'text.secondary', fontWeight: 800 }, 'Your question'),
          React.createElement(Typography, { mb: 2, fontWeight: 700 }, question),
          React.createElement(Typography, { variant: 'overline', color: 'text.secondary', fontWeight: 800 }, 'Assistant response'),
          React.createElement(Typography, { mb: 2, sx: { lineHeight: 1.8 } }, answer),
          React.createElement(Typography, { variant: 'overline', color: 'text.secondary', fontWeight: 800 }, 'Sources used'),
          React.createElement(Stack, { direction: 'row', spacing: 1, sx: { flexWrap: 'wrap', gap: 1, mt: 1 } }, sources.map((source) => React.createElement(Typography, { key: source, component: 'span', sx: { px: 1.5, py: 0.75, borderRadius: 2, backgroundColor: 'primary.light', color: 'primary.dark', fontWeight: 700, fontSize: 13 } }, source)))) : null
      )
    )
  );
}

export default AIAssistant;
