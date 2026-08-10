import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Leaf } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onOpenAuth }) => {
  const { setIsOpen, getTotalItems } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-slate-border shadow-elevation-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center text-white">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold text-navy tracking-tight font-headline hidden sm:inline">
            Quintadinha<span className="text-sage">Online</span>
          </span>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar frutas, verduras, legumes..."
            className="w-full h-10 pl-9 pr-4 bg-background border border-slate-border rounded text-sm text-navy placeholder:text-slate-muted focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 text-navy hover:bg-slate-border/40 rounded-full transition-colors flex items-center justify-center"
          >
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-sage text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center price-tag">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAuth}
            className="px-3.5 py-2 text-sm font-medium text-navy border border-slate-border rounded hover:bg-slate-border/20 transition-colors flex items-center gap-2"
          >
            <User className="w-4 h-4 text-slate" />
            <span className="hidden md:inline">
              {isAuthenticated ? user?.fullName || 'Minha Conta' : 'Entrar'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
