import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', elevated = false }) => {
  return (
    <div
      className={`bg-surface rounded border border-slate-border p-6 transition-all ${
        elevated ? 'shadow-elevation-md border-transparent' : 'shadow-elevation-sm'
      } ${className}`}
    >
      {children}
    </div>
  );
};
