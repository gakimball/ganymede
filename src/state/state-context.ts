import { createContext } from 'preact';
import { State } from './state';

export const StateContext = createContext<State | null>(null)
