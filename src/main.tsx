import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import App from './App';
import DBProvider from './contexts/db.context';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<DBProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<App />
			</ThemeProvider>
		</DBProvider>
	</React.StrictMode>
);
