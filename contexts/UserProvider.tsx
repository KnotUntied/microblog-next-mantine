import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiProvider';
import { User } from '../client';

interface UserContextType {
  user?: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>,
  login: (username: string, password: string) => any,
  logout: () => void
};

interface UserProviderProps {
  children: React.ReactNode
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const api = useApi();

  useEffect(() => {
    (async () => {
      if (api.isAuthenticated()) {
        try {
          const response = await api.get('/me');
          // const response = await api.users.usersMe();
          setUser(response.ok ? response.body : null);
        } catch (error) {
          setUser(null);
        }
      }
      else {
        setUser(null);
      }
    })();
  }, [api]);

  const login = async (username: string, password: string) => {
    const result = await api.login(username, password);
    if (result === 'ok') {
      try {
        const response = await api.get('/me');
        // const response = await api.users.usersMe();
        setUser(response.ok ? response.body : null);
      } catch (error) {
        setUser(null);
      }
    }
    return result;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  };
  return context;
}