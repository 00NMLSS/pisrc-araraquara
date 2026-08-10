import React from 'react';
import { ProductCard, Product } from './product-card';
import { Skeleton } from './ui/skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-surface rounded border border-slate-border p-6 h-80 flex flex-col justify-between">
            <div>
              <Skeleton className="w-full h-44 mb-4" />
              <Skeleton className="w-3/4 h-5 mb-2" />
              <Skeleton className="w-1/2 h-4" />
            </div>
            <div className="flex justify-between items-center pt-3">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-24 h-9" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-surface border border-slate-border rounded-lg p-12 text-center my-8">
        <h3 className="text-lg font-bold text-navy mb-2">Nenhum produto encontrado</h3>
        <p className="text-sm text-slate">Tente alterar os termos da busca ou os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
