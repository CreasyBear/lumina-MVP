import React, { ComponentType } from 'react';
import AuthWrapper from './AuthWrapper';

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>): React.FC<P> {
  return function WithAuth(props: P) {
    return (
      <AuthWrapper>
        <WrappedComponent {...props} />
      </AuthWrapper>
    );
  };
}