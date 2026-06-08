import React from 'react';
import { render, screen } from '@testing-library/react';
import { ButtonGroup } from './ButtonGroup';

describe('ButtonGroup', () => {
  it('renders children', () => {
    render(
      <ButtonGroup>
        <button>First</button>
        <button>Second</button>
      </ButtonGroup>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('applies ui-button-group class', () => {
    render(<ButtonGroup><button>Test</button></ButtonGroup>);
    expect(screen.getByText('Test').parentElement?.className).toContain('ui-button-group');
  });

  it('applies custom className', () => {
    render(
      <ButtonGroup className="my-group">
        <button>Test</button>
      </ButtonGroup>,
    );
    expect(screen.getByText('Test').parentElement?.className).toContain('my-group');
  });
});
