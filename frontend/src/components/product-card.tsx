import React from 'react';
import { Plus, PackageX } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useCartStore } from '../store/useCartStore';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  stockQuantity: number;
  isOrganic: boolean;
  categoryId: string;
  imageUrl?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product.stockQuantity === undefined || product.stockQuantity <= 0;

  return (
    <Card className={`flex flex-col justify-between h-full group transition-all duration-200 ${
      isOutOfStock ? 'opacity-75 bg-slate-border/10' : 'hover:border-navy'
    }`}>
      <div>
        <div className="relative w-full h-44 bg-background rounded-sm mb-4 overflow-hidden flex items-center justify-center border border-slate-border/50">
          <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center text-sage font-bold text-xl font-headline">
            {product.name.charAt(0)}
          </div>
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isOrganic && <Badge variant="success">Orgânico</Badge>}
            {isOutOfStock && <Badge variant="error">Indisponível</Badge>}
          </div>
        </div>

        <h3 className="text-base font-bold text-navy mb-1 group-hover:text-sage transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-slate mb-3 line-clamp-2">{product.description}</p>
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-border/40">
        <div>
          <span className="text-xs text-slate block">Preço</span>
          <div className="text-lg font-bold text-navy price-tag">
            R$ {Number(product.price).toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate font-body">/ {product.unit}</span>
          </div>
        </div>

        {isOutOfStock ? (
          <Button variant="ghost" size="sm" disabled className="flex items-center gap-1.5 text-status-error cursor-not-allowed">
            <PackageX className="w-4 h-4" />
            <span>Sem Estoque</span>
          </Button>
        ) : (
          <Button
            variant="sage"
            size="sm"
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                unit: product.unit,
              })
            }
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </Button>
        )}
      </div>
    </Card>
  );
};
