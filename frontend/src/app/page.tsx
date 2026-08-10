'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Navbar } from '../components/navbar';
import { BottomNav } from '../components/bottom-nav';
import { CatalogFilters, Category } from '../components/catalog-filters';
import { ProductGrid } from '../components/product-grid';
import { Product } from '../components/product-card';
import { CartDrawer } from '../components/cart-drawer';
import { AuthDialog } from '../components/auth-dialog';
import { OrderTracker } from '../components/order-tracker';
import { useCartStore } from '../store/useCartStore';

const MOCK_CATEGORIES: Category[] = [
  { id: 'c1111111-1111-1111-1111-111111111111', name: 'Frutas Frescas', slug: 'frutas' },
  { id: 'c2222222-2222-2222-2222-222222222222', name: 'Verduras e Folhas', slug: 'verduras' },
  { id: 'c3333333-3333-3333-3333-333333333333', name: 'Legumes e Tubérculos', slug: 'legumes' },
  { id: 'c4444444-4444-4444-4444-444444444444', name: 'Temperos e Ervas', slug: 'temperos' },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const setIsCartOpen = useCartStore((state) => state.setIsOpen);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let list: Product[] = data;
        if (isOrganicOnly) {
          list = list.filter((p) => p.isOrganic);
        }
        setProducts(list);
      }
    } catch (e) {
      console.error('Error fetching products from API', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, isOrganicOnly, searchQuery]);

  const handleCheckout = () => {
    const fakeOrderId = 'ord-' + Math.floor(100000 + Math.random() * 900000);
    setActiveOrderId(fakeOrderId);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar onSearch={setSearchQuery} onOpenAuth={() => setIsAuthOpen(true)} />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'home' && (
            <>
              <section className="bg-navy rounded-lg p-6 sm:p-10 text-white mb-8 relative overflow-hidden shadow-elevation-md">
                <div className="max-w-xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage/20 border border-sage/40 rounded text-sage text-xs font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Feira Orgânica Fresca</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                    Alimentos saudáveis colhidos para você
                  </h1>
                  <p className="text-slate-muted text-sm sm:text-base mb-6">
                    Selecione hortifrútis orgânicos de produtores locais com entrega garantida e frescor incomparável.
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-light/50">
                    <div className="flex items-center gap-2 text-xs">
                      <Leaf className="w-4 h-4 text-sage" />
                      <span>100% Orgânico</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Truck className="w-4 h-4 text-sage" />
                      <span>Entrega no Dia</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-sage" />
                      <span>Origem Garantida</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-navy">Catálogo de Produtos</h2>
                  <a href="/admin" className="text-xs font-semibold text-sage hover:underline">
                    Acesso Restrito (Painel Admin)
                  </a>
                </div>
                <CatalogFilters
                  categories={MOCK_CATEGORIES}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  isOrganicOnly={isOrganicOnly}
                  onToggleOrganic={() => setIsOrganicOnly(!isOrganicOnly)}
                />
                <ProductGrid products={products} isLoading={isLoading} />
              </section>
            </>
          )}

          {activeTab === 'catalog' && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-navy mb-4">Todos os Hortifrútis</h2>
              <CatalogFilters
                categories={MOCK_CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                isOrganicOnly={isOrganicOnly}
                onToggleOrganic={() => setIsOrganicOnly(!isOrganicOnly)}
              />
              <ProductGrid products={products} isLoading={isLoading} />
            </section>
          )}

          {activeTab === 'orders' && (
            <section className="py-6">
              <h2 className="text-2xl font-bold text-navy mb-2">Acompanhamento de Pedidos</h2>
              <p className="text-sm text-slate mb-6">Status em tempo real via Server-Sent Events (SSE).</p>
              {activeOrderId ? (
                <OrderTracker orderId={activeOrderId} />
              ) : (
                <div className="bg-surface border border-slate-border rounded p-8 text-center">
                  <p className="text-slate text-sm mb-4">Você ainda não realizou pedidos nesta sessão.</p>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      <footer className="bg-surface border-t border-slate-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate">
          <div>
            <p className="font-bold text-navy mb-1">Quintadinha Online - E-Commerce de Hortifrúti</p>
            <p>Arquitetura de Microsserviços para Alta Concorrência</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="/admin" className="hover:text-navy font-semibold">Painel Admin</a>
            <a href="/robots.txt" className="hover:text-navy">robots.txt</a>
            <a href="/llms.txt" className="hover:text-navy">llms.txt</a>
            <a href="/sitemap.xml" className="hover:text-navy">sitemap.xml</a>
          </div>
        </div>
      </footer>

      <CartDrawer onCheckout={handleCheckout} />
      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
