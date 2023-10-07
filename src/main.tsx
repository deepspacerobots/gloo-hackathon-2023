import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import DBProvider from './contexts/db.context';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<DBProvider>
			<App />
		</DBProvider>
	</React.StrictMode>,
);
