import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'filter' | 'filterActive' | 'success' | 'warning' | 'error';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'filter', className = '' }) => {
  const styles = {
    filter: 'bg-background text-navy border border-slate-border',
    filterActive: 'bg-navy text-white',
    success: 'bg-status-success/10 text-emerald-700 font-semibold',
    warning: 'bg-status-warning/10 text-amber-700 font-semibold',
    error: 'bg-status-error/10 text-red-700 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[11px] font-medium uppercase tracking-[0.5px] rounded-sm select-none ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
