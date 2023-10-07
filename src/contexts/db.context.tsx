import DB, { Database } from '@/db/db';
import { ReactNode, createContext, useContext } from 'react';

type Props = {
	children: string | ReactNode | JSX.Element;
};

type DBContextType = Database;

const DBContext = createContext<DBContextType>(DB);

const DBProvider = ({ children }: Props): JSX.Element => {
	return <DBContext.Provider value={DB}>{children}</DBContext.Provider>;
};

export default DBProvider;

export const useDBContext = () => useContext<DBContextType>(DBContext);
