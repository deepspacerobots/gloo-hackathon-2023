import { Database, preexistingData } from '@/db/db';
import { ReactNode, createContext, useContext } from 'react';

type Props = {
	children: string | ReactNode | JSX.Element;
};

const database = new Database(preexistingData);
type DBContextType = Database;

const DBContext = createContext<DBContextType>(database);

const DBProvider = ({ children }: Props): JSX.Element => {
	return <DBContext.Provider value={database}>{children}</DBContext.Provider>;
};

export default DBProvider;

export const useDBContext = () => useContext<DBContextType>(DBContext);
