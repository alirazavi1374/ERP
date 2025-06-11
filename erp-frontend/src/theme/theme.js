import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: { main: '#6200ea' }, // MD3 primary color
    secondary: { main: '#03dac6' },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
