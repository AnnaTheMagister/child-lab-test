import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const GoodChild = () => <div data-testid="good-child">OK</div>;

const BadChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('good-child')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary name="TestComponent">
        <BadChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/Ошибка/)).toBeInTheDocument();
    expect(screen.getByText(/TestComponent/)).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('calls console.error when child throws', () => {
    render(
      <ErrorBoundary name="TestComponent">
        <BadChild />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalled();
  });
});
