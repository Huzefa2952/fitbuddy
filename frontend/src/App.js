// Root application component for FitBuddy with routing and layout.
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutRoutines from './pages/WorkoutRoutines';
import AIAssistant from './pages/AIAssistant';
import { AuthProvider } from './context/AuthContext';
import theme from './theme/theme';
import './App.css';

function App() {
  const protectedRoutes = React.createElement(
    Route,
    { element: React.createElement(ProtectedRoute, null) },
    React.createElement(Route, { path: '/', element: React.createElement(Layout, null) },
      React.createElement(Route, { index: true, element: React.createElement(Dashboard) }),
      React.createElement(Route, { path: 'exercises', element: React.createElement(ExerciseLibrary) }),
      React.createElement(Route, { path: 'routines', element: React.createElement(WorkoutRoutines) }),
      React.createElement(Route, { path: 'ai', element: React.createElement(AIAssistant) })
    )
  );

  const routes = React.createElement(
    Routes,
    null,
    React.createElement(Route, { path: '/login', element: React.createElement(Login) }),
    React.createElement(Route, { path: '/register', element: React.createElement(Register) }),
    protectedRoutes,
    React.createElement(Route, { path: '*', element: React.createElement(Navigate, { to: '/login', replace: true }) })
  );

  return React.createElement(
    ThemeProvider,
    { theme },
    React.createElement(CssBaseline, null),
    React.createElement(
      AuthProvider,
      null,
      React.createElement(BrowserRouter, null, routes)
    )
  );
}

export default App;
