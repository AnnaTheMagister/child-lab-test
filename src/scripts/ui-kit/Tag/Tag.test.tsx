import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders children text', () => {
    render(<Tag>Webinar</Tag>);
    expect(screen.getByText('Webinar')).toBeInTheDocument();
  });

  it('applies default background and text color', () => {
    render(<Tag>Tag</Tag>);
    const el = screen.getByText('Tag');
    expect(el.style.backgroundColor).toBeTruthy();
    expect(el.style.color).toBe('rgb(51, 51, 51)');
  });

  it('applies custom color and textColor', () => {
    render(<Tag color="#ff0000" textColor="#fff">Red</Tag>);
    const el = screen.getByText('Red');
    expect(el.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(el.style.color).toBe('rgb(255, 255, 255)');
  });

  it('applies padding based on size prop', () => {
    const { rerender } = render(<Tag size="sm">Small</Tag>);
    expect(screen.getByText('Small').style.padding).toBe('4px 12px');

    rerender(<Tag size="md">Medium</Tag>);
    expect(screen.getByText('Medium').style.padding).toBe('6px 16px');
  });

  it('applies custom className', () => {
    render(<Tag className="my-tag">Custom</Tag>);
    expect(screen.getByText('Custom').className).toContain('my-tag');
  });

  it('has base ui-tag class', () => {
    render(<Tag>Base</Tag>);
    expect(screen.getByText('Base').className).toContain('ui-tag');
  });
});
