import React from 'react';
import { icons, IconName } from './icons';

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export const Icon = ({ name, size, className }: IconProps) => {
  const SvgComponent = icons[name];
  if (!SvgComponent) return null;
  return <SvgComponent size={size} className={className} />;
};
