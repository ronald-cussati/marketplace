"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Produto } from "@/types/database";
import { ProductService } from "@/lib/services/productService";
import { OrderService } from "@/lib/services/orderService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ProductModal } from "@/components/painel/ProductModal";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  DollarSign,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  Store,
  Loader2,
} from "lucide-react";

export default function PainelDashboardPage() {
  const { vendedor } = useAuth();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vendedorId = vendedor?.id || "vend-1";

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const prods = await ProductService.getProdutos({
        vendedorId,
        apenasAtivos: false,
      });
      setProdutos(prods);

      const peds = await OrderService.getPedidosByVendedor(vendedorId);
      setPedidos(peds);
    } catch (e) {
      console.error("Erro ao carregar painel:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [vendedorId]);

  const handleSaveProduct = async (data: Partial<Produto>) => {
    await ProductService.createProduto(data);
    toast("Produto cadastrado com sucesso!", "success");
    await carregarDados();
  };

  const handleQuickAddStock = async (produto: Produto) => {
    const novoEstoque = produto.estoque_qtd + 5;
    await ProductService.updateProduto(produto.id, { estoque_qtd: novoEstoque });
    toast(`+5 unidades adicionadas ao estoque de "${produto.nome}"!`, "success");
    await carregarDados();
  };

  const produtosAtivos = produtos.filter((p) => p.ativo).length;
  const produtosEstoqueBaixo = produtos.filter((p) => p.estoque_qtd <= 5);
  const totalFaturadoSimulado = produtos.reduce(
    (acc, p) => acc + (15 - Math.min(15, p.estoque_qtd)) * p.preco,
    380.0
  );

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-sm text-slate-500">Atualizando métricas do painel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Vendas Simuladas
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(totalFaturadoSimulado)}
            </span>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18% esta semana
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pedidos Recebidos
            </span>
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {Math.max(pedidos.length, 6)} pedidos
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              100% liquidados via mock
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Produtos Cadastrados
            </span>
            <div className="w-10 h-10 rounded-2xl bg-earth-100 text-earth-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {produtosAtivos} / {produtos.length} ativos
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Visíveis na vitrine pública
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Alerta de Estoque
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-amber-700">
              {produtosEstoqueBaixo.length} itens
            </span>
            <p className="text-[11px] text-amber-800 font-semibold mt-1">
              Com 5 unidades ou menos
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Gestão Rápida da Produção</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Cadastrar Novo Produto
        </Button>
      </div>

      {/* Low Stock Alerts Box */}
      {produtosEstoqueBaixo.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Produtos com Estoque Baixo que Precisam de Reposição
            </h3>
            <Link
              href="/painel/produtos"
              className="text-xs font-bold text-amber-800 hover:underline"
            >
              Ver todos os produtos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {produtosEstoqueBaixo.map((prod) => (
              <div
                key={prod.id}
                className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="truncate">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {prod.nome}
                  </h4>
                  <p className="text-xs text-amber-700 font-bold">
                    Apenas {prod.estoque_qtd} un restantes
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleQuickAddStock(prod)}
                  className="text-xs flex-shrink-0"
                >
                  +5 Estoque
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        vendedorId={vendedorId}
      />
    </div>
  );
}
