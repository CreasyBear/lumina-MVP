import React, { ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <div>Please sign in to access this content.</div>;
  }

  return <>{children}</>;
};

export default AuthWrapper;