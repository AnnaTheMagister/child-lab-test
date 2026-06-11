import React from 'react';

export type TagSize = 'sm' | 'md' | 'lg';
type Breakpoint = 'desktop' | 'tablet' | 'phone';

interface TagBreakpoints {
  phone: React.CSSProperties;
  tablet: React.CSSProperties;
  desktop: React.CSSProperties;
}

export interface TagProps {
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  size?: TagSize;
  className?: string;
}

const sizeMap: Record<TagSize, TagBreakpoints> = {
  sm: {
    phone: { padding: '4px 12px', fontSize: '12px', borderRadius: '12px' },
    tablet: { padding: '4px 12px', fontSize: '12px', borderRadius: '12px' },
    desktop: { padding: '4px 12px', fontSize: '12px', borderRadius: '12px' },
  },
  md: {
    phone: { padding: '6px 16px', fontSize: '14px', borderRadius: '16px' },
    tablet: { padding: '6px 16px', fontSize: '14px', borderRadius: '16px' },
    desktop: { padding: '6px 16px', fontSize: '14px', borderRadius: '16px' },
  },
  lg: {
    phone: { padding: '2px 12px', fontSize: '12px', borderRadius: '12px' },
    tablet: { padding: '6px 16px', fontSize: '16px', borderRadius: '16px' },
    desktop: { padding: '8px 24px', fontSize: '20px', borderRadius: '20px' },
  },
};

function getSizeProp(size: TagSize, bp: Breakpoint, prop: keyof React.CSSProperties): string | undefined {
  return (sizeMap[size]?.[bp] as any)?.[prop];
}

export const Tag = ({
  children,
  color,
  textColor,
  size = 'sm',
  className = '',
}: TagProps) => {
  const style: React.CSSProperties = {
    backgroundColor: color ?? '#EB3F9B',
    color: textColor ?? '#ffffff',
    '--tag-padding-desktop': getSizeProp(size, 'desktop', 'padding'),
    '--tag-padding-tablet': getSizeProp(size, 'tablet', 'padding'),
    '--tag-padding-phone': getSizeProp(size, 'phone', 'padding'),
    '--tag-font-size-desktop': getSizeProp(size, 'desktop', 'fontSize'),
    '--tag-font-size-tablet': getSizeProp(size, 'tablet', 'fontSize'),
    '--tag-font-size-phone': getSizeProp(size, 'phone', 'fontSize'),
    '--tag-radius-desktop': getSizeProp(size, 'desktop', 'borderRadius'),
    '--tag-radius-tablet': getSizeProp(size, 'tablet', 'borderRadius'),
    '--tag-radius-phone': getSizeProp(size, 'phone', 'borderRadius'),
  } as React.CSSProperties;

  return (
    <span className={`ui-tag${className ? ' ' + className : ''}`} style={style}>
      {children}
    </span>
  );
};
