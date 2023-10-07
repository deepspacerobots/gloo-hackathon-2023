import DB, { Database } from '@/db/db';
import { ReactNode, createContext, useContext, useState } from 'react';

type Props = {
	children: string | ReactNode | JSX.Element;
};

type DBContextType = Database;

const DBContext = createContext<DBContextType>(DB);

const DBProvider = ({ children }: Props): JSX.Element => {
	const [db, setDb] = useState<Database>(DB);
	return <DBContext.Provider value={db}>{children}</DBContext.Provider>;
};

export default DBProvider;

export const useDBContext = () => useContext<DBContextType>(DBContext);
