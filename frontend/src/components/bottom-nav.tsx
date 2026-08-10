import React from 'react';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenCart,
  onOpenAuth,
}) => {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const navItems = [
    { id: 'home', label: 'Início', icon: Home, action: () => setActiveTab('home') },
    { id: 'catalog', label: 'Catálogo', icon: Grid, action: () => setActiveTab('catalog') },
    { id: 'cart', label: 'Carrinho', icon: ShoppingBag, action: onOpenCart, badge: totalItems },
    { id: 'orders', label: 'Pedidos', icon: Package, action: () => setActiveTab('orders') },
    { id: 'account', label: 'Conta', icon: User, action: onOpenAuth },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-slate-border h-16 flex items-center justify-around px-2 shadow-elevation-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 relative transition-colors ${
              isActive ? 'text-sage font-bold' : 'text-slate hover:text-navy'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[11px] leading-none">{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span className="absolute top-1 right-2 bg-sage text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center price-tag">
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
