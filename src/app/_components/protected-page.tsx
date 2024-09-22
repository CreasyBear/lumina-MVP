import { withAuth } from '../_components/auth/withAuth';

function ProtectedPage() {
  return <div>This is a protected page</div>;
}

export default withAuth(ProtectedPage);