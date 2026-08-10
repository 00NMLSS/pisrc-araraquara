'use client';

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Users,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package,
  Layers,
  FileText,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  stockQuantity: number;
  isOrganic: boolean;
  categoryId: string;
}

interface InventoryMovement {
  id: string;
  productId: string;
  movementType: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  notes: string;
  createdAt: string;
}

const CATEGORIES_MAP: Record<string, string> = {
  'c1111111-1111-1111-1111-111111111111': 'Frutas Frescas',
  'c2222222-2222-2222-2222-222222222222': 'Verduras e Folhas',
  'c3333333-3333-3333-3333-333333333333': 'Legumes e Tubérculos',
  'c4444444-4444-4444-4444-444444444444': 'Temperos e Ervas',
};

export default function AdminPage() {
  const [activeModule, setActiveModule] = useState<'inventory' | 'crm' | 'billing'>('inventory');
  const [inventorySubTab, setInventorySubTab] = useState<'products' | 'movements'>('products');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // New Product Modal State
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newStock, setNewStock] = useState('100');
  const [newIsOrganic, setNewIsOrganic] = useState(true);
  const [newCategoryId, setNewCategoryId] = useState('c1111111-1111-1111-1111-111111111111');

  // Stock Adjustment State
  const [adjustingProductId, setAdjustingProductId] = useState<string | null>(null);
  const [adjustTargetStock, setAdjustTargetStock] = useState<number>(0);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const pRes = await fetch('/api/products');
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData);
      }

      const mRes = await fetch('/api/inventory/movements');
      if (mRes.ok) {
        const mData = await mRes.json();
        setMovements(mData);
      }
    } catch (e) {
      console.error('Error fetching admin data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          price: parseFloat(newPrice),
          unit: newUnit,
          stockQuantity: parseInt(newStock, 10),
          isOrganic: newIsOrganic,
          categoryId: newCategoryId,
        }),
      });

      if (res.ok) {
        setIsNewProductOpen(false);
        setNewName('');
        setNewDesc('');
        setNewPrice('');
        fetchAdminData();
      }
    } catch (e) {
      console.error('Error creating product', e);
    }
  };

  const handleStockUpdate = async (productId: string, newQty: number) => {
    try {
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockQuantity: newQty,
          notes: 'Ajuste direto via Painel Admin de Estoque',
        }),
      });

      if (res.ok) {
        setAdjustingProductId(null);
        fetchAdminData();
      }
    } catch (e) {
      console.error('Error updating stock', e);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stockQuantity > 20).length;
  const lowStockCount = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 20).length;
  const outOfStockCount = products.filter((p) => !p.stockQuantity || p.stockQuantity <= 0).length;

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      {/* Top Internal Admin Header */}
      <header className="bg-navy text-white h-16 px-6 flex items-center justify-between border-b border-slate-light/20 shadow-elevation-md">
        <div className="flex items-center gap-3">
          <a href="/" className="p-2 text-slate-muted hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-sage flex items-center justify-center text-white">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight font-headline">
                Quintadinha<span className="text-sage">Admin</span>
              </span>
              <span className="text-[10px] text-slate-muted block leading-none">Gestão Interna de Operações</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="filterActive" className="bg-navy-light border border-slate-light/40">
            <Lock className="w-3 h-3 mr-1 text-sage" /> REDE INTERNA PRIVADA
          </Badge>
          <div className="text-xs text-slate-muted border-l border-slate-light/30 pl-3">
            Operador: <span className="text-white font-semibold">Administrador</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 py-6 gap-6">
        {/* Admin Navigation Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-surface rounded border border-slate-border p-4 shadow-elevation-sm h-fit">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveModule('inventory')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-sm font-semibold transition-colors ${
                activeModule === 'inventory'
                  ? 'bg-navy text-white'
                  : 'text-slate hover:bg-background hover:text-navy'
              }`}
            >
              <Boxes className="w-5 h-5" />
              <span>Estoque & Produtos</span>
            </button>

            <button
              onClick={() => setActiveModule('crm')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-sm font-semibold transition-colors ${
                activeModule === 'crm'
                  ? 'bg-navy text-white'
                  : 'text-slate hover:bg-background hover:text-navy'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>CRM & Clientes</span>
              </div>
              <span className="text-[10px] bg-slate-border/50 text-slate px-1.5 py-0.5 rounded font-mono">EM BREVE</span>
            </button>

            <button
              onClick={() => setActiveModule('billing')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-sm font-semibold transition-colors ${
                activeModule === 'billing'
                  ? 'bg-navy text-white'
                  : 'text-slate hover:bg-background hover:text-navy'
              }`}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5" />
                <span>Faturamento & Vendas</span>
              </div>
              <span className="text-[10px] bg-slate-border/50 text-slate px-1.5 py-0.5 rounded font-mono">EM BREVE</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          {/* Module 1: Inventory & Stock Management */}
          {activeModule === 'inventory' && (
            <>
              {/* Stat Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="p-4">
                  <span className="text-xs text-slate uppercase tracking-wider block mb-1">Total de Produtos</span>
                  <div className="text-2xl font-bold text-navy price-tag">{totalProducts}</div>
                </Card>
                <Card className="p-4">
                  <span className="text-xs text-slate uppercase tracking-wider block mb-1">Em Estoque</span>
                  <div className="text-2xl font-bold text-emerald-600 price-tag">{inStockCount}</div>
                </Card>
                <Card className="p-4">
                  <span className="text-xs text-slate uppercase tracking-wider block mb-1">Estoque Baixo</span>
                  <div className="text-2xl font-bold text-amber-600 price-tag">{lowStockCount}</div>
                </Card>
                <Card className="p-4">
                  <span className="text-xs text-slate uppercase tracking-wider block mb-1">Indisponíveis</span>
                  <div className="text-2xl font-bold text-status-error price-tag">{outOfStockCount}</div>
                </Card>
              </div>

              {/* Subtabs & Actions Bar */}
              <Card className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-border pb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInventorySubTab('products')}
                      className={`px-3 py-1.5 text-xs font-bold rounded uppercase tracking-wider transition-colors ${
                        inventorySubTab === 'products' ? 'bg-navy text-white' : 'bg-background text-slate border border-slate-border'
                      }`}
                    >
                      Estoque Atual
                    </button>
                    <button
                      onClick={() => setInventorySubTab('movements')}
                      className={`px-3 py-1.5 text-xs font-bold rounded uppercase tracking-wider transition-colors ${
                        inventorySubTab === 'movements' ? 'bg-navy text-white' : 'bg-background text-slate border border-slate-border'
                      }`}
                    >
                      Histórico de Movimentações
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-64">
                      <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filtrar por produto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 text-xs bg-background border border-slate-border rounded focus:outline-none focus:border-navy"
                      />
                    </div>
                    <Button variant="sage" size="sm" onClick={() => setIsNewProductOpen(true)} className="flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      <span>Novo Produto</span>
                    </Button>
                  </div>
                </div>

                {inventorySubTab === 'products' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-navy border-collapse">
                      <thead>
                        <tr className="border-b border-slate-border bg-background/50 text-xs font-bold text-slate uppercase tracking-wider">
                          <th className="p-3">SKU / ID</th>
                          <th className="p-3">Produto</th>
                          <th className="p-3">Categoria</th>
                          <th className="p-3">Preço</th>
                          <th className="p-3">Qtd. Estoque</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Ações de Estoque</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-border/50">
                        {filteredProducts.map((p) => {
                          const isZero = !p.stockQuantity || p.stockQuantity <= 0;
                          const isLow = p.stockQuantity > 0 && p.stockQuantity <= 20;

                          return (
                            <tr key={p.id} className="hover:bg-background/40 transition-colors">
                              <td className="p-3 font-mono text-xs text-slate">{p.id.substring(0, 8)}</td>
                              <td className="p-3 font-bold text-navy">
                                {p.name} {p.isOrganic && <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono ml-1">ORG</span>}
                              </td>
                              <td className="p-3 text-slate text-xs">{CATEGORIES_MAP[p.categoryId] || 'Geral'}</td>
                              <td className="p-3 font-bold price-tag">R$ {Number(p.price).toFixed(2)} / {p.unit}</td>
                              <td className="p-3 font-bold price-tag text-base">
                                {adjustingProductId === p.id ? (
                                  <input
                                    type="number"
                                    value={adjustTargetStock}
                                    onChange={(e) => setAdjustTargetStock(parseInt(e.target.value, 10) || 0)}
                                    className="w-20 h-8 px-2 border border-navy rounded text-sm font-mono"
                                  />
                                ) : (
                                  <span>{p.stockQuantity || 0}</span>
                                )}
                              </td>
                              <td className="p-3">
                                {isZero ? (
                                  <Badge variant="error">Indisponível</Badge>
                                ) : isLow ? (
                                  <Badge variant="warning">Estoque Baixo</Badge>
                                ) : (
                                  <Badge variant="success">Em Estoque</Badge>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                {adjustingProductId === p.id ? (
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="sage"
                                      size="sm"
                                      onClick={() => handleStockUpdate(p.id, adjustTargetStock)}
                                      className="h-8 px-2 text-xs"
                                    >
                                      Salvar
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setAdjustingProductId(null)}
                                      className="h-8 px-2 text-xs"
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => handleStockUpdate(p.id, Math.max(0, (p.stockQuantity || 0) - 10))}
                                      className="px-2 py-1 bg-background border border-slate-border text-slate hover:text-navy text-xs rounded font-mono"
                                      title="Reduzir 10 unidades"
                                    >
                                      -10
                                    </button>
                                    <button
                                      onClick={() => handleStockUpdate(p.id, (p.stockQuantity || 0) + 10)}
                                      className="px-2 py-1 bg-background border border-slate-border text-slate hover:text-navy text-xs rounded font-mono"
                                      title="Adicionar 10 unidades"
                                    >
                                      +10
                                    </button>
                                    <button
                                      onClick={() => {
                                        setAdjustingProductId(p.id);
                                        setAdjustTargetStock(p.stockQuantity || 0);
                                      }}
                                      className="px-2.5 py-1 bg-navy text-white text-xs rounded hover:bg-navy-hover transition-colors font-medium ml-1"
                                    >
                                      Ajustar
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Inventory Movement Audit Log Table */
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-navy border-collapse">
                      <thead>
                        <tr className="border-b border-slate-border bg-background/50 text-xs font-bold text-slate uppercase tracking-wider">
                          <th className="p-3">Data / Hora</th>
                          <th className="p-3">ID Movimentação</th>
                          <th className="p-3">ID Produto</th>
                          <th className="p-3">Tipo</th>
                          <th className="p-3">Qtd</th>
                          <th className="p-3">Estoque Anterior</th>
                          <th className="p-3">Novo Estoque</th>
                          <th className="p-3">Observações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-border/50 font-mono text-xs">
                        {movements.map((m) => (
                          <tr key={m.id} className="hover:bg-background/40">
                            <td className="p-3 text-slate">{new Date(m.createdAt).toLocaleString('pt-BR')}</td>
                            <td className="p-3 text-slate">{m.id.substring(0, 8)}</td>
                            <td className="p-3 font-bold text-navy">{m.productId.substring(0, 8)}</td>
                            <td className="p-3">
                              {m.movementType === 'IN' ? (
                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">ENTRADA</span>
                              ) : (
                                <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded font-bold">SAÍDA</span>
                              )}
                            </td>
                            <td className="p-3 font-bold">{m.quantity}</td>
                            <td className="p-3 text-slate">{m.previousStock}</td>
                            <td className="p-3 font-bold text-navy">{m.newStock}</td>
                            <td className="p-3 text-slate font-body">{m.notes || 'Sem observações'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </>
          )}

          {/* Module 2: CRM & Clientes (Placeholder for future expansion) */}
          {activeModule === 'crm' && (
            <Card className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-navy/10 text-navy rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy">Módulo de CRM e Gestão de Clientes</h3>
              <p className="text-slate text-sm max-w-md mx-auto">
                Estrutura preparada para expansão futura. Permitirá gerenciar cadastros de clientes, segmentação de compradores e histórico de atendimento.
              </p>
              <div className="pt-4 border-t border-slate-border max-w-lg mx-auto grid grid-cols-3 gap-4 text-center">
                <div className="bg-background p-3 rounded">
                  <span className="text-xs text-slate block">Clientes Ativos</span>
                  <span className="text-lg font-bold text-navy price-tag">1.240</span>
                </div>
                <div className="bg-background p-3 rounded">
                  <span className="text-xs text-slate block">Ticket Médio</span>
                  <span className="text-lg font-bold text-navy price-tag">R$ 48,50</span>
                </div>
                <div className="bg-background p-3 rounded">
                  <span className="text-xs text-slate block">Retenção</span>
                  <span className="text-lg font-bold text-sage price-tag">88%</span>
                </div>
              </div>
            </Card>
          )}

          {/* Module 3: Billing & Sales (Placeholder for future expansion) */}
          {activeModule === 'billing' && (
            <Card className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy">Módulo de Faturamento e Vendas</h3>
              <p className="text-slate text-sm max-w-md mx-auto">
                Estrutura preparada para expansão futura. Permitirá emitir relatórios financeiros, faturamento de pedidos e controle fiscal.
              </p>
              <div className="pt-4 border-t border-slate-border max-w-lg mx-auto grid grid-cols-3 gap-4 text-center">
                <div className="bg-background p-3 rounded">
                  <span className="text-xs text-slate block">Receita Mês</span>
                  <span className="text-lg font-bold text-navy price-tag">R$ 14.890</span>
                </div>
                <div className="bg-background p-3 rounded">
                  <span className="text-xs text-slate block">Vendas Hoje</span>
                  <span className="text-lg font-bold text-navy price-tag">R$ 1.250</span>
                </div>
                <div className="bg-background p-3 rounded">
                  <span className="text-xs text-slate block">Faturas Ok</span>
                  <span className="text-lg font-bold text-sage price-tag">100%</span>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>

      {/* Modal: Cadastro de Novo Produto */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-lg w-full rounded-md shadow-elevation-lg border border-slate-border p-6 relative">
            <h3 className="text-lg font-bold text-navy mb-1">Cadastrar Novo Hortifrúti</h3>
            <p className="text-xs text-slate mb-4">Insira os dados do produto no banco relacional PostgreSQL.</p>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <Input label="Nome do Produto" value={newName} onChange={(e) => setNewName(e.target.value)} required />
              <Input label="Descrição" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} required />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Preço (R$)" type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-navy uppercase tracking-wider">Unidade</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="h-[42px] px-3 bg-surface border border-slate-border rounded text-sm text-navy"
                  >
                    <option value="kg">kg</option>
                    <option value="maço">maço</option>
                    <option value="unidade">unidade</option>
                    <option value="bandeja">bandeja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Estoque Inicial" type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-navy uppercase tracking-wider">Categoria</label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="h-[42px] px-3 bg-surface border border-slate-border rounded text-sm text-navy"
                  >
                    {Object.entries(CATEGORIES_MAP).map(([id, label]) => (
                      <option key={id} value={id}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="organic"
                  checked={newIsOrganic}
                  onChange={(e) => setNewIsOrganic(e.target.checked)}
                  className="w-4 h-4 text-navy rounded border-slate-border"
                />
                <label htmlFor="organic" className="text-xs font-medium text-navy">Produto Orgânico Certificado</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-border">
                <Button variant="ghost" size="md" onClick={() => setIsNewProductOpen(false)} type="button">
                  Cancelar
                </Button>
                <Button variant="sage" size="md" type="submit">
                  Salvar no Banco
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
