import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import { Event, ModeNight, WbSunny } from '@mui/icons-material';
import EventEditor from '@/pages/eventEditor';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline, Fab, useTheme } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useState } from 'react';
import "./app.scss"
import UserProfile from './components/UserProfile/UserProfile';

function Copyright() {
	return (
		<Typography variant="body2" color="text.secondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://mui.com/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}.
		</Typography>
	);
}

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? 'dark' : 'light',
    },
  });
  const themeIcon = () => {
    if (isDarkTheme) return <WbSunny />
    return <ModeNight/>
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ my: 4,mx:8 }}>
        <EventEditor/>
      </Box>
        <Fab className={'fab'} size="small" aria-label="add" onClick={() => {
          setIsDarkTheme(!isDarkTheme)
        }}>
          {!isDarkTheme ? <WbSunny /> : <ModeNight/>}
        </Fab>
    </ThemeProvider>
  );
}
