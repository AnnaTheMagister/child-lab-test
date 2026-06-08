import React from 'react';

export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ButtonGroup = ({ children, className = '' }: ButtonGroupProps) => {
  return (
    <div
      className={`ui-button-group${className ? ' ' + className : ''}`}
    >
      {children}
    </div>
  );
};
