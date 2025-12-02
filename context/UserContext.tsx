import { getCurrentUser } from '@/services/auth';
import { IUser } from '@/types/user.types';


import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

export interface IUserProviderValues {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

//Create Context
export const UserContext = createContext<IUserProviderValues | undefined>(
  undefined,
);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleUser = async () => {
    const user = await getCurrentUser();
    // console.log('+++++++++++++++++++++++User', user);
    setUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    handleUser();
  }, []);
 
  // console.log('===============>>>>>>>>>>>>User :', user);

  const contextValue = {
    user,
    isLoading,
    setIsLoading,
    setUser,
  };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
export default UserProvider;
