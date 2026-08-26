"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { OrderService } from "@/lib/services/orderService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  PackageCheck,
  ShoppingBag,
  Clock,
  ArrowRight,
  Receipt,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function MeusPedidosPage() {
  const { user, usuario } = useAuth();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPedidos() {
      setIsLoading(true);
      const compradorId = usuario?.id || user?.id || "anon";
      try {
        const data = await OrderService.getPedidosByComprador(compradorId);
        setPedidos(data);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPedidos();
  }, [user, usuario]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-sm text-slate-500">Buscando seu histórico de pedidos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <PackageCheck className="w-8 h-8 text-primary-700" />
            Meus Pedidos na Feira
          </h1>
          <p className="text-xs text-slate-500">
            Acompanhe o status e histórico de todas as suas compras simuladas.
          </p>
        </div>

        <Link href="/">
          <Button variant="outline" size="sm">
            Explorar Mais Produtos
          </Button>
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Nenhum pedido realizado ainda
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Quando você concluir um pedido simulado, o comprovante e status aparecerão aqui.
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Ir às Compras
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      Pedido #{pedido.id.substring(0, 10).toUpperCase()}
                    </span>
                    <Badge variant="success" size="sm">
                      {pedido.status.toUpperCase()} (MOCK)
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Realizado em {formatDate(pedido.criado_em)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-lg text-primary-800">
                    {formatCurrency(pedido.total)}
                  </span>
                  <Link href={`/pedido-sucesso/${pedido.id}`}>
                    <Button variant="secondary" size="sm" leftIcon={<Receipt className="w-3.5 h-3.5" />}>
                      Recibo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Items List */}
              {pedido.itens && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Itens do Pedido ({pedido.itens.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pedido.itens.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="truncate pr-2">
                          <span className="font-bold text-slate-800">
                            {item.quantidade}x{" "}
                          </span>
                          <span className="text-slate-700">
                            {item.produto?.nome || "Item da Feira"}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 flex-shrink-0">
                          {formatCurrency(
                            (item.preco_unitario || item.produto?.preco || 0) *
                              item.quantidade
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
