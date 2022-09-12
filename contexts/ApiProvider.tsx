import { createContext, useContext } from 'react';
import MicroblogApiClient from '../lib/MicroblogApiClient';

interface ApiProviderProps {
  children: React.ReactNode
};

const ApiContext = createContext<MicroblogApiClient | undefined>(undefined);

export default function ApiProvider({ children }: ApiProviderProps) {
  const onError = () => {
    flash('An unexpected error has occurred. Please try again.', 'danger');
  };

  const api: MicroblogApiClient = new MicroblogApiClient();

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within a ApiProvider')
  };
  return context;
}