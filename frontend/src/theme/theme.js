// Custom Material UI theme for the FitBuddy app.
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      dark: '#1E3A8A',
      light: '#DBEAFE',
    },
    secondary: {
      main: '#14B8A6',
      dark: '#0F766E',
      light: '#CCFBF1',
    },
    success: {
      main: '#16A34A',
    },
    background: {
      default: '#F6F8FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#64748B',
    },
    divider: '#E5E7EB',
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(15, 23, 42, 0.06)',
    '0 8px 24px rgba(15, 23, 42, 0.08)',
    '0 12px 30px rgba(15, 23, 42, 0.10)',
    '0 16px 40px rgba(15, 23, 42, 0.12)',
    ...Array(20).fill('0 16px 40px rgba(15, 23, 42, 0.12)'),
  ],
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", Arial, sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h4: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E5E7EB',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
