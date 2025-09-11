import { create } from "zustand";
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: Cookies.get('token') || null,
  user: null,
  isAuthenticated: !!Cookies.get('token'),
  setAuth: (token, user) => {
    Cookies.set('token', token, { expires: 7 }); 
    set({ token, user, isAuthenticated: true });
  },
  clearAuth: () => {
    Cookies.remove('token');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));