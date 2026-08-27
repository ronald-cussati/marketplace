"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { X, ShoppingBasket, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    totalItems,
  } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-800 flex items-center justify-center">
                <ShoppingBasket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Cesta de Compras</h3>
                <p className="text-xs text-slate-500">
                  {totalItems} {totalItems === 1 ? "item adicionado" : "itens adicionados"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-20 h-20 rounded-full bg-earth-100 flex items-center justify-center text-earth-600 mb-4">
                  <ShoppingBasket className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-lg text-slate-800 mb-1">
                  Sua cesta está vazia
                </h4>
                <p className="text-sm text-slate-500 max-w-xs mb-6">
                  Navegue pela vitrine e apoie nossos produtores locais adicionando itens frescos à sua cesta.
                </p>
                <Button
                  variant="primary"
                  onClick={() => setIsCartOpen(false)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explorar a Feira
                </Button>
              </div>
            ) : (
              items.map(({ produto, quantidade }) => (
                <div
                  key={produto.id}
                  className="flex gap-4 p-3 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 shadow-sm transition-all"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                      src={produto.imagem_url || "https://placehold.co/200x200?text=Produto"}
                      alt={produto.nome}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 truncate">
                          {produto.nome}
                        </h4>
                        <p className="text-xs text-primary-700 font-medium">
                          {produto.vendedor?.nome_loja || "Produtor Local"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(produto.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {formatCurrency(produto.preco * quantidade)}
                      </span>

                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-2 py-1 bg-slate-50">
                        <button
                          onClick={() => updateQuantity(produto.id, quantidade - 1)}
                          className="text-slate-600 hover:text-slate-900 disabled:opacity-30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {quantidade}
                        </span>
                        <button
                          onClick={() => updateQuantity(produto.id, quantidade + 1)}
                          disabled={quantidade >= produto.estoque_qtd}
                          className="text-slate-600 hover:text-slate-900 disabled:opacity-30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-extrabold text-xl text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                * Pagamento simulado mock (sem transação financeira real)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/carrinho"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full"
                >
                  <Button variant="secondary" className="w-full text-xs">
                    Ver Cesta
                  </Button>
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" className="w-full text-xs font-bold">
                    Finalizar
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
