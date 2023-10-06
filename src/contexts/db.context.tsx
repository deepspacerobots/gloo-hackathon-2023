import { Database, preexistingData } from '@/db/db';
import { createContext } from 'react';

const database = new Database(preexistingData);
type DBContextType = Database;

const DBContext = createContext<DBContextType>(database);

const CompanyProvider = ({ children }: Props): JSX.Element => {};
