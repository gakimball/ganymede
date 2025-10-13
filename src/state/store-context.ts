import { createContext } from 'preact';
import { AppState } from './app-state';

export const StoreContext = createContext<AppState | null>(null)
