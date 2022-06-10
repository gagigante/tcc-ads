import { useRouter } from 'next/router';
import { 
  createContext,
  useCallback,
  useState,
  ReactNode, 
} from 'react';
import { User } from '../models/User';

import { api } from '../services/api';

type AuthState  = {
  token: string;
  user: User;
}

type SignInCredentials = {
  email: string;
  password: string;
  return_url?: string;
}

type AuthContextData = {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(data: User): void;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { push } = useRouter();

  const [data, setData] = useState<AuthState>(() => {
    if (process.browser) {
      const token = localStorage.getItem('@doa+:token');
      const user = localStorage.getItem('@doa+:user');

      if (token && user) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        return { token, user: JSON.parse(user) };
      }
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password, return_url }: SignInCredentials) => {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      });
  
      const { token, user } = response.data;
  
      localStorage.setItem('@doa+:token', token);
      localStorage.setItem('@doa+:user', JSON.stringify(user));
  
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
  
      setData({ token, user });

      if (return_url) {
        push(return_url);
        return;
      }

      push('/');
    } catch {
      alert('Erro ao realizar login. Tente novamente!');
    }
  }, [push]);

  const signOut = useCallback(() => {
    localStorage.removeItem('@doa+:token');
    localStorage.removeItem('@doa+:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      localStorage.setItem('@doa+:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
