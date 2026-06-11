import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

function getStyle(btn: HTMLElement): string {
  return (btn as HTMLElement).style.cssText || (btn as HTMLElement).getAttribute('style') || '';
}

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<Button icon={<span data-testid="test-icon">*</span>}>With Icon</Button>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('sets aria-pressed based on isActive prop', () => {
    const { rerender } = render(<Button isActive={true}>Active</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');

    rerender(<Button isActive={false}>Inactive</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies ui-button--active class when isActive is true', () => {
    const { rerender } = render(<Button isActive={true}>Active</Button>);
    expect(screen.getByRole('button').className).toContain('ui-button--active');

    rerender(<Button isActive={false}>Inactive</Button>);
    expect(screen.getByRole('button').className).not.toContain('ui-button--active');
  });

  it('isActive defaults to true', () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button').className).toContain('ui-button--active');
  });

  it('applies custom className', () => {
    render(<Button className="my-custom-class">Custom</Button>);
    expect(screen.getByRole('button').className).toContain('my-custom-class');
  });

  it('sets responsive padding and font-size CSS custom properties based on size', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let s = screen.getByRole('button').style;
    expect(s.getPropertyValue('--button-padding-phone')).toBe('8px 12px');
    expect(s.getPropertyValue('--button-font-size-phone')).toBe('16px');

    rerender(<Button size="md">Medium</Button>);
    s = screen.getByRole('button').style;
    expect(s.getPropertyValue('--button-padding-phone')).toBe('8px 24px');
    expect(s.getPropertyValue('--button-font-size-phone')).toBe('24px');

    rerender(<Button size="lg">Large</Button>);
    s = screen.getByRole('button').style;
    expect(s.getPropertyValue('--button-padding-phone')).toBe('6px 18px');
    expect(s.getPropertyValue('--button-font-size-phone')).toBe('18px');
    expect(s.getPropertyValue('--button-padding-tablet')).toBe('8px 24px');
    expect(s.getPropertyValue('--button-font-size-tablet')).toBe('24px');
  });

  it('uses grape scheme by default', () => {
    render(<Button>Grape</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-colors', 'grape');
    expect(btn.style.color).toBe('rgb(255, 255, 255)');
    expect(btn.style.getPropertyValue('--button-hover-bg')).toBe('#7955F9');
    expect(btn.style.getPropertyValue('--button-pressed-bg')).toBe('#3D1FAA');
  });

  it('applies raspberry scheme when colors="raspberry"', () => {
    render(<Button colors="raspberry">Raspberry</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-colors', 'raspberry');
    expect(btn.style.color).toBe('rgb(255, 255, 255)');
  });

  it('applies strawberry scheme when colors="strawberry"', () => {
    render(<Button colors="strawberry">Strawberry</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-colors', 'strawberry');
    expect(btn.style.color).toBe('rgb(255, 255, 255)');
  });

  it('uses custom active colors when colors="custom"', () => {
    render(
      <Button colors="custom" active={{ background: '#ff0000', color: '#ffffff' }}>
        Custom
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(getStyle(btn)).toContain('rgb(255, 0, 0)');
    expect(btn.style.color).toBe('rgb(255, 255, 255)');
  });

  it('uses inactive colors when isActive is false', () => {
    render(
      <Button
        isActive={false}
        colors="custom"
        active={{ background: '#000', color: '#fff' }}
        inactive={{ background: '#fff', color: '#000' }}
      >
        Toggle
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(getStyle(btn)).toContain('rgb(255, 255, 255)');
    expect(btn.style.color).toBe('rgb(0, 0, 0)');
  });

  it('does not use inactive if not provided and isActive is false with custom scheme', () => {
    render(
      <Button isActive={false} colors="custom" active={{ background: '#000', color: '#fff' }}>
        No Inactive
      </Button>,
    );
    const style = getStyle(screen.getByRole('button'));
    expect(style).not.toContain('background');
  });

  it('applies custom borderColor via active group', () => {
    render(
      <Button colors="custom" active={{ background: '#fff', color: '#000', borderColor: 'red' }}>
        Border
      </Button>,
    );
    const style = getStyle(screen.getByRole('button'));
    expect(style).toContain('border: 1px solid red');
  });

  it('renders without children', () => {
    render(<Button />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders as anchor when href is provided', () => {
    render(<Button href="/course-1">Подробнее</Button>);
    const link = screen.getByRole('link', { name: /подробнее/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/course-1');
  });

  it('renders anchor with target and rel', () => {
    render(<Button href="/external" target="_blank" rel="noopener">Link</Button>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('anchor still renders icon and children', () => {
    render(<Button href="/test" icon={<span data-testid="link-icon">*</span>}>Go</Button>);
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByTestId('link-icon')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('sets data-colors attribute', () => {
    render(<Button colors="raspberry">Test</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-colors', 'raspberry');
  });

  it('sets responsive border-radius CSS custom properties', () => {
    render(
      <Button
        borderRadius={{
          desktop: '12px',
          tablet: '10px',
          phone: '8px',
        }}
      >
        Radius
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn.style.getPropertyValue('--button-radius-desktop')).toBe('12px');
    expect(btn.style.getPropertyValue('--button-radius-tablet')).toBe('10px');
    expect(btn.style.getPropertyValue('--button-radius-phone')).toBe('8px');
  });

  it('applies single borderRadius value to all breakpoints', () => {
    render(<Button borderRadius="16px">Radius</Button>);
    const btn = screen.getByRole('button');
    expect(btn.style.getPropertyValue('--button-radius-desktop')).toBe('16px');
    expect(btn.style.getPropertyValue('--button-radius-tablet')).toBe('16px');
    expect(btn.style.getPropertyValue('--button-radius-phone')).toBe('16px');
  });

  it('uses default radius values when no borderRadius prop', () => {
    render(<Button>Default Radius</Button>);
    const btn = screen.getByRole('button');
    expect(btn.style.getPropertyValue('--button-radius-desktop')).toBe('8px');
    expect(btn.style.getPropertyValue('--button-radius-tablet')).toBe('8px');
    expect(btn.style.getPropertyValue('--button-radius-phone')).toBe('6px');
  });

  it('sets data-hover-defined for grape scheme', () => {
    render(<Button colors="grape">Grape</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-hover-defined', 'true');
  });

  it('does not set data-hover-defined for strawberry scheme', () => {
    render(<Button colors="strawberry">Strawberry</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-hover-defined');
  });
});
