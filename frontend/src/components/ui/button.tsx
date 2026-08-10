import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'sage' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 rounded disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary: 'bg-navy text-white hover:bg-navy-hover active:bg-navy-light',
    secondary: 'bg-transparent text-navy border border-navy hover:bg-navy/5',
    ghost: 'bg-transparent text-slate hover:bg-slate-border/50',
    sage: 'bg-sage text-white hover:bg-sage-hover',
    destructive: 'bg-status-error text-white hover:bg-red-600',
  };

  const sizeStyles = {
    sm: 'h-[36px] px-3 text-xs',
    md: 'h-[44px] px-5 text-sm',
    lg: 'h-[48px] px-7 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
