"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  Store,
  Printer,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock,
} from "lucide-react";

export default function PedidoSucessoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const historico = JSON.parse(localStorage.getItem("feiralocal_pedidos") || "[]");
      const found = historico.find((p: any) => p.id === id) || historico[0];
      if (found) {
        setPedido(found);
      }
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl text-center space-y-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulação Aprovada com Sucesso</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Pagamento Aprovado!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            O seu pedido foi registrado no sistema e os produtores já foram notificados para a separação dos itens.
          </p>
        </div>

        {/* Order Identification Strip */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-around gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Número do Pedido</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              #{id?.substring(0, 12).toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Status</span>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              PAGO (MOCK)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Data / Hora</span>
            <span className="font-semibold text-slate-800">
              {formatDate(pedido?.criado_em || new Date().toISOString())}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="pt-6 border-t border-slate-100 text-left space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Fluxo de Atendimento
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>1. Pedido Criado</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>2. Pagamento Mock</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>3. Em Separação</span>
            </div>
          </div>
        </div>

        {/* Items receipt */}
        {pedido?.itens && pedido.itens.length > 0 && (
          <div className="pt-6 border-t border-slate-100 text-left space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Itens Comprados
            </h3>
            <div className="space-y-2">
              {pedido.itens.map((it: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-800">{it.quantidade}x </span>
                    <span className="text-slate-700">
                      {it.produto?.nome || "Produto da Feira"}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    {formatCurrency((it.preco_unitario || it.produto?.preco || 0) * it.quantidade)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-baseline font-bold text-sm text-slate-900">
              <span>Total Pago</span>
              <span className="text-xl font-black text-primary-800">
                {formatCurrency(pedido.total)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/meus-pedidos" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              leftIcon={<PackageCheck className="w-4 h-4" />}
            >
              Ver Meus Pedidos
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-auto"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Imprimir Recibo
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="ghost" size="md" className="w-full">
              Voltar à Vitrine
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
