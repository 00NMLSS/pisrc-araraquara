import React from 'react';
import { Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Sheet } from './ui/sheet';
import { Button } from './ui/button';
import { useCartStore } from '../store/useCartStore';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  return (
    <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Seu Carrinho">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-navy font-bold text-base mb-1">Seu carrinho está vazio</p>
          <p className="text-slate text-xs mb-4">Adicione hortifrútis frescos para começar sua compra.</p>
          <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
            Explorar Catálogo
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-background border border-slate-border rounded"
              >
                <div className="flex-1 pr-3">
                  <h4 className="text-sm font-bold text-navy">{item.name}</h4>
                  <div className="text-xs text-slate price-tag mt-0.5">
                    R$ {item.price.toFixed(2)} / {item.unit}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-border rounded bg-surface">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 text-slate hover:text-navy transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-navy price-tag">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 text-slate hover:text-navy transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-status-error/80 hover:text-status-error hover:bg-status-error/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-border mt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate">Subtotal</span>
              <span className="text-xl font-bold text-navy price-tag">R$ {totalPrice.toFixed(2)}</span>
            </div>
            <Button
              variant="sage"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                setIsOpen(false);
                onCheckout();
              }}
            >
              <span>Finalizar Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
};
