import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { ModeNight, WbSunny } from '@mui/icons-material';
import EventEditor from '@/pages/eventEditor';
import { ThemeProvider } from '@emotion/react';
import { AppBar, CssBaseline, IconButton, Toolbar } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import './app.scss';
import { Logo } from '../public/logo/Logo';

function Copyright() {
	return (
		<Typography variant='body2' color='text.secondary' align='center'>
			{'Copyright © '}
			<Link color='inherit' href='https://mui.com/'>
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
		if (isDarkTheme) return <WbSunny />;
		return <ModeNight />;
	};
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position='static'>
					<Toolbar>
						<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
							<Logo color={theme.palette.text.secondary} />
						</Typography>
						<IconButton
							onClick={() => {
								setIsDarkTheme(!isDarkTheme);
							}}
						>
							{!isDarkTheme ? <WbSunny /> : <ModeNight />}
						</IconButton>
					</Toolbar>
				</AppBar>
			</Box>
			<Box sx={{ my: 4, mx: 8 }}>
				<EventEditor />
			</Box>
		</ThemeProvider>
	);
}
