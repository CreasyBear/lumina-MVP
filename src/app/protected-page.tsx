import React from 'react';
import { withAuth } from './_components/auth/withAuth';

const ProtectedPage: React.FC = () => {
  return <div>This is a protected page</div>;
};

export default withAuth(ProtectedPage);