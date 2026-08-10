import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, helperText, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-medium text-navy uppercase tracking-wider">{label}</label>}
      <input
        className={`h-[42px] px-3.5 bg-surface border rounded text-sm text-navy placeholder:text-slate-muted focus:outline-none transition-colors ${
          error
            ? 'border-status-error focus:ring-2 focus:ring-status-error/20'
            : 'border-slate-border focus:border-navy focus:ring-2 focus:ring-navy/10'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-status-error">{error}</span>}
      {helperText && !error && <span className="text-xs text-slate-muted">{helperText}</span>}
    </div>
  );
};
