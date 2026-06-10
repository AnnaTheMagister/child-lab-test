import React from 'react';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonColors = 'grape' | 'raspberry' | 'strawberry' | 'custom';
export type BorderRadiusValue = 'none' | '4px' | '6px' | '8px' | '10px' | '12px' | '16px' | '20px' | '32px' | '50%';

export interface ButtonStateColors {
  background?: string;
  color?: string;
  borderColor?: string;
}

export interface ButtonResponsiveRadius {
  desktop?: BorderRadiusValue;
  tablet?: BorderRadiusValue;
  phone?: BorderRadiusValue;
}

export interface ButtonProps {
  isActive?: boolean;
  active?: ButtonStateColors;
  inactive?: ButtonStateColors;
  colors?: ButtonColors;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  href?: string;
  target?: string;
  rel?: string;
  borderRadius?: BorderRadiusValue | ButtonResponsiveRadius;
}

interface ColorSchemeState {
  default: { background: string; color: string };
  hovered?: { background: string };
  pressed?: { background: string };
}

interface ColorScheme {
  active: ColorSchemeState;
  inactive?: ColorSchemeState;
}

const COLOR_SCHEMES: Record<Exclude<ButtonColors, 'custom'>, ColorScheme> = {
  grape: {
    active: {
      default: {
        background: 'linear-gradient(90deg, #5823EB 0%, #6D00D2 100%)',
        color: 'rgb(255, 255, 255)',
      },
      hovered: { background: '#7955F9' },
      pressed: { background: '#3D1FAA' },
    },
    inactive: {
      default: {
        background: 'linear-gradient(90deg, #ECEFFF 0%, #F2E8FF 100%)',
        color: '#5230D0',
      },
      hovered: { background: '#ffffff' },
      pressed: { background: '#DDDDDD' },
    },
  },
  raspberry: {
    active: {
      default: {
        background: 'linear-gradient(90deg, rgb(215, 69, 255) 0%, rgb(245, 47, 162) 100%)',
        color: 'rgb(255, 255, 255)',
      },
    },
    inactive: {
      default: {
        background: 'linear-gradient(90deg, rgb(247, 217, 255) 0%, rgb(255, 200, 232) 100%)',
        color: 'rgb(188, 0, 173)',
      },
    },
  },
  strawberry: {
    active: {
      default: {
        background: 'linear-gradient(90deg, #F74098 0%, #F64B30 100%)',
        color: 'rgb(255, 255, 255)',
      },
    },
    inactive: {
      default: {
        background: 'linear-gradient(90deg, #FFD4E9, #FFCFC8 100%)',
        color: 'rgb(188, 0, 173)',
      },
    },
  },
};

const DEFAULT_RADIUS: Record<string, BorderRadiusValue> = {
  desktop: '8px',
  tablet: '8px',
  phone: '6px',
};

interface SizeBreakpoints {
  phone: React.CSSProperties;
  tablet: React.CSSProperties;
  desktop: React.CSSProperties;
}

const sizeMap: Record<ButtonSize, SizeBreakpoints> = {
  sm: {
    phone: { padding: '8px 12px', fontSize: '16px' },
    tablet: { padding: '8px 12px', fontSize: '16px' },
    desktop: { padding: '8px 12px', fontSize: '16px' },
  },
  md: {
    phone: { padding: '8px 24px', fontSize: '24px' },
    tablet: { padding: '8px 24px', fontSize: '24px' },
    desktop: { padding: '8px 24px', fontSize: '24px' },
  },
  lg: {
    phone: { padding: '6px 18px', fontSize: '18px' },
    tablet: { padding: '8px 24px', fontSize: '24px' },
    desktop: { padding: '12px 36px', fontSize: '36px' },
  },
};

type Breakpoint = 'desktop' | 'tablet' | 'phone';

function getSizeProp(size: ButtonSize, bp: Breakpoint, prop: keyof React.CSSProperties): string | undefined {
  return (sizeMap[size]?.[bp] as any)?.[prop];
}

function resolveSchemeColors(
  colors: ButtonColors,
  state: 'active' | 'inactive',
  customColors?: ButtonStateColors,
): ButtonStateColors {
  if (colors !== 'custom' && customColors) {
    const scheme = COLOR_SCHEMES[colors];
    const schemeState = state === 'active' ? scheme.active : scheme.inactive;
    if (!schemeState) return customColors;
    return {
      background: customColors.background || schemeState.default.background,
      color: customColors.color || schemeState.default.color,
      borderColor: customColors.borderColor,
    };
  }

  if (colors !== 'custom') {
    const scheme = COLOR_SCHEMES[colors];
    const schemeState = state === 'active' ? scheme.active : scheme.inactive;
    if (!schemeState) return {};
    return {
      background: schemeState.default.background,
      color: schemeState.default.color,
    };
  }

  return customColors || {};
}

function getRadius(borderRadius: ButtonProps['borderRadius'], bp: 'desktop' | 'tablet' | 'phone'): string {
  if (!borderRadius) return DEFAULT_RADIUS[bp];
  if (typeof borderRadius === 'string') return borderRadius;
  return borderRadius[bp] || DEFAULT_RADIUS[bp];
}

function getSchemeName(colors: ButtonColors): string {
  return colors;
}

function hasDefinedHover(colors: ButtonColors, state: 'active' | 'inactive'): boolean {
  if (colors === 'custom') return false;
  const scheme = COLOR_SCHEMES[colors];
  const schemeState = state === 'active' ? scheme.active : scheme.inactive;
  return !!schemeState?.hovered;
}

function getHoverBackground(colors: ButtonColors, state: 'active' | 'inactive'): string | undefined {
  if (colors === 'custom') return undefined;
  const scheme = COLOR_SCHEMES[colors];
  const schemeState = state === 'active' ? scheme.active : scheme.inactive;
  return schemeState?.hovered?.background;
}

function getPressedBackground(colors: ButtonColors, state: 'active' | 'inactive'): string | undefined {
  if (colors === 'custom') return undefined;
  const scheme = COLOR_SCHEMES[colors];
  const schemeState = state === 'active' ? scheme.active : scheme.inactive;
  return schemeState?.pressed?.background;
}

export const Button = ({
  isActive = true,
  active: activeColors,
  inactive: inactiveColors,
  colors = 'grape',
  icon,
  onClick,
  children,
  className = '',
  disabled = false,
  size = 'md',
  href,
  target,
  rel,
  borderRadius,
}: ButtonProps) => {
  const currentColors = isActive
    ? resolveSchemeColors(colors, 'active', activeColors)
    : resolveSchemeColors(colors, 'inactive', inactiveColors);

  const style: React.CSSProperties = {
    background: currentColors.background,
    color: currentColors.color,
    border: `1px solid ${currentColors.borderColor || 'transparent'}`,
    '--button-padding-desktop': getSizeProp(size, 'desktop', 'padding'),
    '--button-padding-tablet': getSizeProp(size, 'tablet', 'padding'),
    '--button-padding-phone': getSizeProp(size, 'phone', 'padding'),
    '--button-font-size-desktop': getSizeProp(size, 'desktop', 'fontSize'),
    '--button-font-size-tablet': getSizeProp(size, 'tablet', 'fontSize'),
    '--button-font-size-phone': getSizeProp(size, 'phone', 'fontSize'),
    '--button-radius-desktop': getRadius(borderRadius, 'desktop'),
    '--button-radius-tablet': getRadius(borderRadius, 'tablet'),
    '--button-radius-phone': getRadius(borderRadius, 'phone'),
    '--button-hover-bg': getHoverBackground(colors, isActive ? 'active' : 'inactive'),
    '--button-pressed-bg': getPressedBackground(colors, isActive ? 'active' : 'inactive'),
  } as React.CSSProperties;

  const dataAttrs = {
    'data-colors': getSchemeName(colors),
    'data-hover-defined': hasDefinedHover(colors, isActive ? 'active' : 'inactive') ? 'true' : undefined,
  };

  const classNames = [
    'ui-button',
    isActive ? 'ui-button--active' : '',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {icon && <span className="ui-button__icon">{icon}</span>}
      {children && <span className="ui-button__text">{children}</span>}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={classNames}
        style={style}
        {...dataAttrs}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classNames}
      style={style}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isActive}
      {...dataAttrs}
    >
      {content}
    </button>
  );
};
