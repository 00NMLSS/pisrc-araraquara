import React from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-surface h-full shadow-elevation-lg flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-border">
          <h2 className="text-lg font-bold text-navy">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate hover:text-navy rounded hover:bg-slate-border/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
