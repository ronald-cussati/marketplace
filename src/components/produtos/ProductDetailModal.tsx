"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Produto } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShoppingBasket,
  MapPin,
  Check,
  Store,
  Plus,
  Minus,
  ShieldCheck,
  Leaf,
} from "lucide-react";

interface ProductDetailModalProps {
  produto: Produto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({
  produto,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantidade, setQuantidade] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!produto) return null;

  const handleAddToCart = () => {
    if (produto.estoque_qtd <= 0) {
      toast("Produto indisponível em estoque.", "error");
      return;
    }

    setIsAdding(true);
    const added = addItem(produto, quantidade);

    if (added) {
      toast(`✅ ${quantidade}x "${produto.nome}" adicionado(s) à cesta!`, "success");
      onClose();
    } else {
      toast("Quantidade solicitada excede o estoque disponível.", "error");
    }

    setIsAdding(false);
  };

  const isOutOfStock = produto.estoque_qtd <= 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" title={produto.nome}>
      <div className="space-y-6">
        {/* Top Split: Image & Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <Image
              src={produto.imagem_url || "https://placehold.co/600x600?text=FeiraLocal"}
              alt={produto.nome}
              fill
              className="object-cover"
            />
            {produto.categoria && (
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-white/90 backdrop-blur-md shadow-sm">
                  {produto.categoria}
                </Badge>
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Preço
                </span>
                <div className="text-3xl font-extrabold text-primary-800">
                  {formatCurrency(produto.preco)}
                </div>
              </div>

              {/* Stock Status */}
              <div>
                {isOutOfStock ? (
                  <Badge variant="danger">Esgotado no momento</Badge>
                ) : (
                  <Badge variant="success">
                    {produto.estoque_qtd} unidades disponíveis em estoque
                  </Badge>
                )}
              </div>

              {/* Vendor Box */}
              {produto.vendedor && (
                <div className="p-3.5 rounded-2xl bg-earth-50 border border-earth-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-earth-900 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-earth-700" />
                      {produto.vendedor.nome_loja}
                    </span>
                    <Link
                      href={`/loja/${produto.vendedor.id}`}
                      onClick={onClose}
                      className="text-[11px] font-bold text-primary-700 hover:underline"
                    >
                      Ver Banca →
                    </Link>
                  </div>
                  {produto.vendedor.cidade && (
                    <p className="text-xs text-earth-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-earth-600" />
                      {produto.vendedor.cidade}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selector & Action */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {!isOutOfStock && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Quantidade:</span>
                  <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-3 py-1.5 bg-slate-50">
                    <button
                      onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                      disabled={quantidade <= 1}
                      className="text-slate-600 hover:text-slate-900 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{quantidade}</span>
                    <button
                      onClick={() =>
                        setQuantidade((q) => Math.min(produto.estoque_qtd, q + 1))
                      }
                      disabled={quantidade >= produto.estoque_qtd}
                      className="text-slate-600 hover:text-slate-900 disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <Button
                variant={isOutOfStock ? "secondary" : "primary"}
                size="lg"
                disabled={isOutOfStock || isAdding}
                onClick={handleAddToCart}
                className="w-full"
                leftIcon={<ShoppingBasket className="w-5 h-5" />}
              >
                {isOutOfStock
                  ? "Produto Indisponível"
                  : `Adicionar à Cesta • ${formatCurrency(produto.preco * quantidade)}`}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Details: Description & Highlights */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">Sobre o Produto</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {produto.descricao ||
                "Produto artesanal cultivado ou manufaturado localmente com muito carinho, respeito ao meio ambiente e técnicas tradicionais familiares."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary-50 text-primary-800 text-xs font-medium">
              <Leaf className="w-4 h-4 text-primary-600 flex-shrink-0" />
              <span>Cultivo / Manufatura Artesanal</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 text-amber-900 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Garantia de Qualidade da Feira</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
