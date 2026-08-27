"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { formatCurrency } from "@/lib/utils";
import { OrderService } from "@/lib/services/orderService";
import { MockPaymentService } from "@/lib/services/mockPayment";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  QrCode,
  CreditCard,
  Banknote,
  Copy,
  Check,
  ArrowLeft,
  Store,
  Sparkles,
  MapPin,
  Clock,
  UserCheck,
  Lock,
  User,
  LogIn,
  UserPlus,
  AlertCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, usuario, signIn } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();

  // Form State
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("Retirada na Feira Central (Praça do Produtor)");
  const [tipoEntrega, setTipoEntrega] = useState<"retirada" | "entrega">("retirada");

  // Payment Method
  const [metodoPagamento, setMetodoPagamento] = useState<"pix" | "cartao" | "dinheiro">("pix");
  const [numeroCartao, setNumeroCartao] = useState("4111 2222 3333 4444");
  const [titularCartao, setTitularCartao] = useState("CLIENTE TESTE MULTIVIX");
  const [validadeCartao, setValidadeCartao] = useState("12/28");
  const [cvvCartao, setCvvCartao] = useState("123");

  const [copiadoPix, setCopiadoPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuickLoggingIn, setIsQuickLoggingIn] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || "");
      setEmail(usuario.email || user?.email || "");
      setTelefone(usuario.telefone || "(27) 99999-8888");
    } else if (user) {
      setEmail(user.email || "");
      setNome("Comprador da Feira");
      setTelefone("(27) 99876-5432");
    }
  }, [usuario, user]);

  const pixPayload = MockPaymentService.gerarPixPayload("MOCK-CHECKOUT", subtotal);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload.chave);
    setCopiadoPix(true);
    toast("Chave Pix de teste copiada!", "info");
    setTimeout(() => setCopiadoPix(false), 3000);
  };

  const handleFillTestCard = () => {
    setNumeroCartao("4000 1234 5678 9010");
    setTitularCartao("ALUNO SI MULTIVIX");
    setValidadeCartao("08/29");
    setCvvCartao("888");
    toast("Cartão de teste simulado preenchido!", "info");
  };

  const handleQuickLoginBuyer = async () => {
    setIsQuickLoggingIn(true);
    const res = await signIn("comprador@email.com", "senha123");
    if (!res.error) {
      toast("Autenticado como Comprador Teste!", "success");
    } else {
      toast("Erro ao autenticar comprador de teste.", "error");
    }
    setIsQuickLoggingIn(false);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user && !usuario) {
      toast("É obrigatório entrar em uma conta antes de finalizar o pedido!", "error");
      return;
    }

    if (items.length === 0) {
      toast("Sua cesta está vazia!", "error");
      router.push("/");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Processa Mock Payment
      const paymentRes = await MockPaymentService.processar({
        pedidoId: "temp-order",
        valor: subtotal,
        metodo: metodoPagamento,
        dadosCartao:
          metodoPagamento === "cartao"
            ? {
                numero: numeroCartao,
                titular: titularCartao,
                validade: validadeCartao,
                cvv: cvvCartao,
              }
            : undefined,
      });

      // 2. Persiste Pedido no Supabase + Itens + Baixa de Estoque
      const compradorId = usuario?.id || user?.id || `anon-${Date.now()}`;
      const orderRes = await OrderService.criarPedido({
        compradorId,
        itens: items,
        total: subtotal,
        metodoPagamento,
      });

      if (orderRes.sucesso) {
        clearCart();
        toast("✅ Pagamento mock aprovado com sucesso!", "success");
        router.push(`/pedido-sucesso/${orderRes.pedidoId}`);
      } else {
        toast("Erro ao gravar pedido no banco.", "error");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Erro no checkout:", err);
      toast("Erro ao processar compra simulada.", "error");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Cesta de compras vazia</h2>
        <p className="text-sm text-slate-500">Adicione itens à sua cesta antes de finalizar o pedido.</p>
        <Link href="/">
          <Button variant="primary">Ir para a Feira</Button>
        </Link>
      </div>
    );
  }

  const isUserAuthenticated = !!user || !!usuario;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Back Button */}
      <Link
        href="/carrinho"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a Cesta
      </Link>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ambiente de Pagamento Simulado (Mock Gateway)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Finalizar Pedido Simulado
        </h1>
      </div>

      {/* 🔐 AUTHENTICATION REQUIRED BARRIER (If not logged in) */}
      {!isUserAuthenticated && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg animate-in fade-in zoom-in-95">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-slate-900">
                Conta Obrigatória para Finalizar a Compra
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Para vincular o pedido ao seu histórico, gerar a Nota Fiscal simulada (NFC-e) e
                garantir a separação correta pelo produtor, você precisa estar autenticado em uma conta.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold"
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Entrar na Minha Conta
              </Button>
            </Link>

            <Link href="/cadastro" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                className="w-full font-bold"
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Criar Nova Conta
              </Button>
            </Link>

            <Button
              variant="amber"
              size="md"
              isLoading={isQuickLoggingIn}
              onClick={handleQuickLoginBuyer}
              className="w-full sm:w-auto font-bold shadow-md shadow-amber-600/30"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              ⚡ Entrar com Conta Teste (1 Clique)
            </Button>
          </div>
        </div>
      )}

      {/* Identified Buyer Badge */}
      {isUserAuthenticated && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-950 text-sm block">
                Comprador Identificado: {usuario?.nome || "Maria Silva"}
              </span>
              <span className="text-emerald-700">{usuario?.email || user?.email}</span>
            </div>
          </div>
          <Link href="/login" className="text-primary-800 font-bold hover:underline">
            Trocar de conta →
          </Link>
        </div>
      )}

      <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Form: Buyer info & Payment Method */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Step 1: Dados do Comprador */}
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center text-xs font-black">
                1
              </span>
              Dados para Identificação do Pedido
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  disabled={!isUserAuthenticated}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  E-mail de Notificação *
                </label>
                <input
                  type="email"
                  required
                  disabled={!isUserAuthenticated}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  disabled={!isUserAuthenticated}
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tipo de Entrega
                </label>
                <select
                  value={tipoEntrega}
                  disabled={!isUserAuthenticated}
                  onChange={(e) => setTipoEntrega(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100"
                >
                  <option value="retirada">Retirar na Feira Livre / Ponto da Banca</option>
                  <option value="entrega">Entrega Local Direta do Produtor</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Local de Retirada ou Endereço de Entrega
                </label>
                <input
                  type="text"
                  required
                  disabled={!isUserAuthenticated}
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Método de Pagamento Simulado */}
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center text-xs font-black">
                  2
                </span>
                Método de Pagamento Simulado (Mock)
              </h2>
            </div>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMetodoPagamento("pix")}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  metodoPagamento === "pix"
                    ? "border-primary-600 bg-primary-50/50 shadow-md ring-2 ring-primary-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <QrCode className="w-6 h-6 text-primary-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Instantâneo
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-sm text-slate-900">Pix Simulado</span>
                  <span className="text-xs text-slate-500">QR Code de teste mock</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMetodoPagamento("cartao")}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  metodoPagamento === "cartao"
                    ? "border-primary-600 bg-primary-50/50 shadow-md ring-2 ring-primary-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                    Mock
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-sm text-slate-900">Cartão Simulado</span>
                  <span className="text-xs text-slate-500">Crédito/Débito teste</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMetodoPagamento("dinheiro")}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  metodoPagamento === "dinheiro"
                    ? "border-primary-600 bg-primary-50/50 shadow-md ring-2 ring-primary-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Banknote className="w-6 h-6 text-primary-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Presencial
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-sm text-slate-900">Na Retirada</span>
                  <span className="text-xs text-slate-500">Dinheiro/Máquina</span>
                </div>
              </button>
            </div>

            {/* Payment Details Sub-pane */}
            {metodoPagamento === "pix" && (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-32 h-32 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
                    <img
                      src={pixPayload.qrCodeUrl}
                      alt="QR Code Pix Simulado"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <h4 className="font-bold text-sm text-slate-800">
                      QR Code Pix para Demonstração
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Ao clicar em <strong>"Confirmar Pagamento Simulado"</strong> abaixo, o
                      gateway mock aprovará o pedido instantaneamente.
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                    >
                      {copiadoPix ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiadoPix ? "Copiado!" : "Copiar Chave Pix Mock"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {metodoPagamento === "cartao" && (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Dados do Cartão (Simulação)
                  </span>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    className="text-xs font-bold text-primary-700 hover:underline"
                  >
                    ⚡ Preencher Cartão de Teste
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      value={numeroCartao}
                      onChange={(e) => setNumeroCartao(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Nome do Titular
                    </label>
                    <input
                      type="text"
                      value={titularCartao}
                      onChange={(e) => setTitularCartao(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Validade
                      </label>
                      <input
                        type="text"
                        value={validadeCartao}
                        onChange={(e) => setValidadeCartao(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvvCartao}
                        onChange={(e) => setCvvCartao(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {metodoPagamento === "dinheiro" && (
              <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-sm">
                <h4 className="font-bold flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-amber-700" />
                  Pagamento na Retirada da Feira
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  O pedido será reservado para você. O pagamento de{" "}
                  <strong>{formatCurrency(subtotal)}</strong> será efetuado diretamente na banca
                  do produtor em dinheiro ou cartão.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary: Review & Final Button */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 border-b border-slate-100 pb-3">
              Itens da Cesta ({items.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(({ produto, quantidade }) => (
                <div key={produto.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex-1 truncate pr-2">
                    <span className="font-bold text-slate-800">{quantidade}x </span>
                    <span className="text-slate-600">{produto.nome}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 flex-shrink-0">
                    {formatCurrency(produto.preco * quantidade)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxa da plataforma</span>
                <span className="text-emerald-600 font-bold">R$ 0,00</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-sm sm:text-base text-slate-900">Total a Pagar</span>
                <span className="font-black text-xl sm:text-2xl text-primary-800">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isUserAuthenticated}
              isLoading={isProcessing}
              className="w-full font-bold shadow-xl shadow-primary-700/20 disabled:opacity-50"
            >
              {isUserAuthenticated
                ? "Confirmar Pagamento Simulado"
                : "Entre na Conta para Finalizar"}
            </Button>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Mock Gateway Seguro
              </span>
              <p className="text-[11px] text-slate-400">
                Ao confirmar, o estoque será atualizado e o pedido gravado no Supabase.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
