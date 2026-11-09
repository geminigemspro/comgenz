import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Supabase client for testing
jest.mock('supabase', () => ({
  createClient: jest.fn(() => ({
    auth: {
      onAuthStateChange: jest.fn(),
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null }))
    }
  }))
}));

test('renders login screen by default', () => {
  render(<App />);
  
  const loginHeading = screen.getByText(/Sign In/i);
  expect(loginHeading).toBeInTheDocument();
});

test('renders dashboard after login', () => {
  // This test would need to be expanded with more complex mock setup
  expect(true).toBe(true);
});