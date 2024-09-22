import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthWrapper from '../AuthWrapper';
import { useAuth } from '@clerk/nextjs';

jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

describe('AuthWrapper', () => {
  it('shows loading state when not loaded', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoaded: false });
    render(<AuthWrapper>Test</AuthWrapper>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows sign in message when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoaded: true, userId: null });
    render(<AuthWrapper>Test</AuthWrapper>);
    expect(screen.getByText('Please sign in to access this content.')).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoaded: true, userId: 'test-user-id' });
    render(<AuthWrapper>Test Content</AuthWrapper>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});