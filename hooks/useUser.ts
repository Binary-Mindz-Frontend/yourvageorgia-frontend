
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within the UserProvider context');
  }
  // console.log('==============>context=====', context);
  return context;
};
export default useUser;
