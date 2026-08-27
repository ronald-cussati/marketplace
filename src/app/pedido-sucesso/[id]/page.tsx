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
  FileText,
  QrCode,
  FileCheck,
} from "lucide-react";

export default function PedidoSucessoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [pedido, setPedido] = useState<any>(null);
  const [exibirNFCe, setExibirNFCe] = useState(false);

  // Gera Chave de Acesso e Protocolo NFC-e Simulados
  const chaveAcesso = `3226 0842 1234 5600 0189 6500 1000 00${Math.floor(Math.random() * 89999 + 10000)} 1098 7654 3210`;
  const protocolo = `33226000${Math.floor(Math.random() * 8999999 + 1000000)} - ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `https://sefaz.es.gov.br/nfce/consulta?p=${chaveAcesso.replace(/\s+/g, "")}|2|1|1|MOCK-AUTH`
  )}`;

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 print-container">
      {/* Success Hero Card (Hidden when printing via .no-print) */}
      <div className="no-print bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulação Aprovada com Sucesso</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pagamento Aprovado!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
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

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/meus-pedidos">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PackageCheck className="w-4 h-4" />}
            >
              Ver Meus Pedidos
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Imprimir Cupom Fiscal / NFC-e
          </Button>
          <button
            onClick={() => setExibirNFCe(!exibirNFCe)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4 text-primary-600" />
            {exibirNFCe ? "Ocultar NFC-e" : "Visualizar NFC-e na Tela"}
          </button>
        </div>
      </div>

      {/* 📄 NFC-e Simulated Voucher (Visible on screen if toggled, and ALONE when printed) */}
      <div
        className={`${
          exibirNFCe ? "block" : "hidden sm:block"
        } print-only bg-white text-black p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-md font-mono text-xs max-w-lg mx-auto space-y-4`}
      >
        {/* NFC-e Header */}
        <div className="text-center space-y-1 border-b border-black/80 pb-3">
          <h2 className="font-black text-sm uppercase tracking-tight">
            FEIRALOCAL COMÉRCIO DE PRODUTOS REGIONAIS LTDA
          </h2>
          <p className="text-[11px] leading-tight">
            CNPJ: 42.123.456/0001-89 • IE: 083.456.789-01
          </p>
          <p className="text-[11px] leading-tight">
            Praça do Produtor Rural, S/N - Centro, Vitória - ES
          </p>
          <div className="pt-2">
            <p className="font-bold text-[11px] uppercase">
              DOCUMENTO AUXILIAR DA NOTA FISCAL DE CONSUMIDOR ELETRÔNICA (NFC-e)
            </p>
            <p className="text-[10px] font-bold bg-black text-white px-2 py-0.5 inline-block rounded mt-1">
              EMISSÃO EM AMBIENTE DE HOMOLOGAÇÃO - TESTE ACADÊMICO
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-1 border-b border-black/80 pb-3">
          <div className="grid grid-cols-12 font-bold text-[10px] border-b border-dashed border-black/40 pb-1">
            <span className="col-span-1">#</span>
            <span className="col-span-6">DESCRIÇÃO</span>
            <span className="col-span-2 text-center">QTD</span>
            <span className="col-span-3 text-right">TOTAL</span>
          </div>

          {pedido?.itens?.map((it: any, index: number) => (
            <div key={index} className="grid grid-cols-12 text-[11px] py-1 border-b border-dashed border-slate-200">
              <span className="col-span-1 text-slate-500">{index + 1}</span>
              <span className="col-span-6 font-semibold truncate pr-1">
                {it.produto?.nome || "PRODUTO ARTESANAL FEIRA"}
              </span>
              <span className="col-span-2 text-center">
                {it.quantidade} un x {formatCurrency(it.preco_unitario || it.produto?.preco || 0)}
              </span>
              <span className="col-span-3 text-right font-bold">
                {formatCurrency((it.preco_unitario || it.produto?.preco || 0) * it.quantidade)}
              </span>
            </div>
          )) || (
            <div className="py-2 text-center text-slate-400">1x Produto da Feira - R$ 38,50</div>
          )}
        </div>

        {/* Totals Section */}
        <div className="space-y-1 border-b border-black/80 pb-3 text-[11px]">
          <div className="flex justify-between font-bold">
            <span>QTD. TOTAL DE ITENS:</span>
            <span>{pedido?.itens?.reduce((acc: number, i: any) => acc + i.quantidade, 0) || 1}</span>
          </div>
          <div className="flex justify-between font-black text-sm pt-1">
            <span>VALOR TOTAL R$:</span>
            <span>{formatCurrency(pedido?.total || 38.5)}</span>
          </div>
          <div className="flex justify-between text-[10px] pt-1">
            <span>FORMA DE PAGAMENTO:</span>
            <span className="font-bold uppercase">
              {pedido?.metodo_pagamento === "pix" ? "PIX MOCK INSTANTÂNEO" : "CARTÃO / MOCK"}
            </span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>VALOR PAGO R$:</span>
            <span>{formatCurrency(pedido?.total || 38.5)}</span>
          </div>
        </div>

        {/* Fiscal Taxes Information */}
        <div className="text-[10px] text-slate-600 border-b border-black/80 pb-2 space-y-0.5">
          <p>
            Informação dos Tributos Totais Incidentes (Lei Federal 12.741/2012): R$ 0,00 (Isenção Simples Nacional Feirante).
          </p>
        </div>

        {/* Access Key & Protocol */}
        <div className="space-y-1.5 text-center border-b border-black/80 pb-3">
          <p className="text-[10px] font-bold text-slate-700">
            NFC-e Nº 000.0{Math.floor(Math.random() * 8999 + 1000)} • Série 001 • Data de Emissão:{" "}
            {new Date().toLocaleDateString("pt-BR")}
          </p>
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
              Chave de Acesso (44 Dígitos)
            </span>
            <span className="font-mono text-[10px] font-bold bg-slate-100 p-1 rounded block tracking-widest text-slate-800">
              {chaveAcesso}
            </span>
          </div>
          <p className="text-[10px] text-slate-600">
            Protocolo de Autorização: <strong>{protocolo}</strong>
          </p>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1 text-center">
          <div className="w-28 h-28 bg-white p-1 border border-black/40 rounded flex items-center justify-center flex-shrink-0">
            <img
              src={qrCodeUrl}
              alt="QR Code de Consulta NFC-e"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left text-[10px] space-y-1 max-w-[200px]">
            <p className="font-bold flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5" />
              Consulta via Leitor QR Code
            </p>
            <p className="text-slate-500">
              Aponte a câmera do seu smartphone para consultar a autenticidade deste cupom fiscal simulado.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 text-[9px] text-slate-500">
          PROJETO ACADÊMICO SISTEMAS DE INFORMAÇÃO • FACULDADE MULTIVIX
        </div>
      </div>
    </div>
  );
}
