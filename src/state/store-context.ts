import { createContext } from 'preact';
import { AppStore } from './app-store';

export const StoreContext = createContext<AppStore | null>(null)
