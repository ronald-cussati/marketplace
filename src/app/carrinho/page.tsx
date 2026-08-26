"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  ShoppingBasket,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Tag,
  Store,
} from "lucide-react";

export default function CarrinhoPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();
  const [cupom, setCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (cupom.trim().toUpperCase() === "FEIRALOCAL10") {
      setCupomAplicado(true);
    }
  };

  const desconto = cupomAplicado ? subtotal * 0.1 : 0;
  const totalComDesconto = Math.max(0, subtotal - desconto);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-earth-100 flex items-center justify-center mx-auto text-earth-700">
          <ShoppingBasket className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Sua cesta de compras está vazia
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Explore nossa vitrine de produtos locais agroecológicos e artesanais e monte sua cesta da semana.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="font-bold shadow-lg shadow-primary-700/20"
            >
              Explorar a Feira
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Cesta de Compras
          </h1>
          <p className="text-xs text-slate-500">
            Você tem {totalItems} {totalItems === 1 ? "item" : "itens"} de produtores locais.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Limpar Cesta
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ produto, quantidade }) => (
            <div
              key={produto.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                  <Image
                    src={produto.imagem_url || "https://placehold.co/200x200?text=Produto"}
                    alt={produto.nome}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="font-bold text-base text-slate-900 truncate">
                    {produto.nome}
                  </h3>
                  {produto.vendedor && (
                    <p className="text-xs text-earth-800 flex items-center gap-1 font-medium">
                      <Store className="w-3 h-3 text-earth-600" />
                      {produto.vendedor.nome_loja}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-primary-700">
                    {formatCurrency(produto.preco)} cada
                  </p>
                </div>
              </div>

              {/* Controls & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Quantity Modifier */}
                <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-3 py-1.5 bg-slate-50">
                  <button
                    onClick={() => updateQuantity(produto.id, quantidade - 1)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold w-6 text-center">{quantidade}</span>
                  <button
                    onClick={() => updateQuantity(produto.id, quantidade + 1)}
                    disabled={quantidade >= produto.estoque_qtd}
                    className="text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right min-w-[90px]">
                  <span className="text-base font-extrabold text-slate-900">
                    {formatCurrency(produto.preco * quantidade)}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeItem(produto.id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Remover produto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary-700 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Continuar Comprando na Feira
            </Link>
          </div>
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h2 className="font-extrabold text-lg text-slate-900">Resumo do Pedido</h2>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Cupom de Desconto
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: FEIRALOCAL10"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button type="submit" size="sm" variant="secondary">
                  Aplicar
                </Button>
              </div>
              {cupomAplicado && (
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Cupom de 10% aplicado com sucesso!
                </p>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal dos itens</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {cupomAplicado && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Desconto (10%)</span>
                  <span>- {formatCurrency(desconto)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Retirada na Feira / Ponto de Coleta</span>
                <span className="text-emerald-600 font-bold">Grátis</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Total do Pedido</span>
                <span className="text-2xl font-black text-primary-800">
                  {formatCurrency(totalComDesconto)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout */}
            <Button
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-xl shadow-primary-700/20"
              onClick={() => router.push("/checkout")}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Avançar para Checkout Simulado
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Simulação Acadêmica • Sem cobrança financeira</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
