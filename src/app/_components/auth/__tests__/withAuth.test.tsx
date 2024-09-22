import React from 'react';
import { render, screen } from '@testing-library/react';
import { withAuth } from '../withAuth';
import { useAuth } from '@clerk/nextjs';

jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

describe('withAuth HOC', () => {
  const TestComponent = () => <div>Protected Content</div>;
  const WrappedComponent = withAuth(TestComponent);

  it('renders AuthWrapper with the wrapped component', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoaded: true, userId: 'test-user-id' });
    render(<WrappedComponent />);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});