import React from 'react';

export type TagSize = 'sm' | 'md';

export interface TagProps {
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  size?: TagSize;
  className?: string;
}

const sizeMap: Record<TagSize, React.CSSProperties> = {
  sm: { padding: '4px 12px', fontSize: '12px' },
  md: { padding: '6px 16px', fontSize: '14px' },
};

export const Tag = ({
  children,
  color,
  textColor,
  size = 'sm',
  className = '',
}: TagProps) => {
  const style: React.CSSProperties = {
    ...sizeMap[size],
    backgroundColor: color ?? 'rgba(255, 255, 255, 0.9)',
    color: textColor ?? '#333',
  };

  return (
    <span className={`ui-tag${className ? ' ' + className : ''}`} style={style}>
      {children}
    </span>
  );
};
