"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ShoppingBag,
  Clock,
  User,
  Phone,
  CheckCircle2,
  PackageCheck,
  Loader2,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export default function PainelPedidosPage() {
  const { vendedor } = useAuth();
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const carregarPedidos = async () => {
    setIsLoading(true);
    // Simula pedidos recebidos para a banca
    const mockVendedorPedidos = [
      {
        id: "PED-MOCK-901",
        comprador: "Mariana Alvarenga",
        telefone: "(27) 99876-1234",
        criado_em: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: "pago",
        itens: [
          {
            nome: "Queijo Artesanal Meia Cura da Serra",
            quantidade: 2,
            preco_unitario: 38.5,
          },
          {
            nome: "Cesta de Hortaliças Orgânicas",
            quantidade: 1,
            preco_unitario: 35.0,
          },
        ],
        total: 112.0,
        retirada: "Retirada na Feira Livre de Sábado (Banca 14)",
      },
      {
        id: "PED-MOCK-842",
        comprador: "Carlos Eduardo Souza",
        telefone: "(27) 99123-5566",
        criado_em: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: "pago",
        itens: [
          {
            nome: "Mel Puro de Flores Silvestres (500g)",
            quantidade: 3,
            preco_unitario: 29.9,
          },
        ],
        total: 89.7,
        retirada: "Entrega Local Agendada",
      },
    ];

    setPedidos(mockVendedorPedidos);
    setIsLoading(false);
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  const handleMarcarPronto = (pedidoId: string) => {
    toast(`Pedido #${pedidoId} marcado como separado para a feira!`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Pedidos Recebidos pela Banca
        </h2>
        <p className="text-xs text-slate-500">
          Acompanhe as encomendas dos clientes para separar a produção no dia da feira.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-sm text-slate-500">Carregando pedidos da banca...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">Nenhum pedido recebido ainda</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Assim que os compradores realizarem compras simuladas com produtos da sua banca, eles aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((ped) => (
            <div
              key={ped.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      Pedido #{ped.id}
                    </span>
                    <Badge variant="success" size="sm">
                      PAGO (MOCK)
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Recebido em {formatDate(ped.criado_em)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-xl text-primary-800">
                    {formatCurrency(ped.total)}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleMarcarPronto(ped.id)}
                    leftIcon={<PackageCheck className="w-4 h-4" />}
                  >
                    Separado
                  </Button>
                </div>
              </div>

              {/* Customer Info Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>
                    Comprador: <strong>{ped.comprador}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>WhatsApp: {ped.telefone}</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Itens para Separação
                </span>
                <div className="space-y-1.5">
                  {ped.itens.map((it: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 px-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div>
                        <span className="font-bold text-slate-800">
                          {it.quantidade}x{" "}
                        </span>
                        <span className="text-slate-700">{it.nome}</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(it.preco_unitario * it.quantidade)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
