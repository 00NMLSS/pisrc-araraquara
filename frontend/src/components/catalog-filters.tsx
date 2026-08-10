import React from 'react';
import { Badge } from './ui/badge';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CatalogFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  isOrganicOnly: boolean;
  onToggleOrganic: () => void;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isOrganicOnly,
  onToggleOrganic,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 border-b border-slate-border/50">
      <button onClick={() => onSelectCategory(null)}>
        <Badge variant={selectedCategory === null ? 'filterActive' : 'filter'}>
          Todos os Produtos
        </Badge>
      </button>

      {categories.map((cat) => (
        <button key={cat.id} onClick={() => onSelectCategory(cat.id)}>
          <Badge variant={selectedCategory === cat.id ? 'filterActive' : 'filter'}>
            {cat.name}
          </Badge>
        </button>
      ))}

      <div className="h-4 w-[1px] bg-slate-border mx-1" />

      <button onClick={onToggleOrganic}>
        <Badge variant={isOrganicOnly ? 'success' : 'filter'}>
          Apenas Orgânicos
        </Badge>
      </button>
    </div>
  );
};
