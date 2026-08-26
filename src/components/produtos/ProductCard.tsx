"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Produto } from "@/types/database";
import { formatCurrency, truncateText } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { ShoppingBasket, MapPin, Check, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  produto: Produto;
  onOpenDetail?: (produto: Produto) => void;
}

export function ProductCard({ produto, onOpenDetail }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (produto.estoque_qtd <= 0) {
      toast("Este produto está esgotado no momento.", "error");
      return;
    }

    setIsAdding(true);
    const added = addItem(produto, 1);

    if (added) {
      toast(`✅ "${produto.nome}" adicionado à cesta!`, "success");
    } else {
      toast("Quantidade máxima em estoque atingida para este item.", "error");
    }

    setTimeout(() => setIsAdding(false), 500);
  };

  const isLowStock = produto.estoque_qtd > 0 && produto.estoque_qtd <= 5;
  const isOutOfStock = produto.estoque_qtd <= 0;

  return (
    <div
      onClick={() => onOpenDetail?.(produto)}
      className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Header with Badges */}
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
        <Image
          src={produto.imagem_url || "https://placehold.co/400x300?text=FeiraLocal"}
          alt={produto.nome}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge */}
        {produto.categoria && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="secondary" size="sm" className="bg-white/90 backdrop-blur-md shadow-sm text-slate-800">
              {produto.categoria}
            </Badge>
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <Badge variant="danger" size="sm" className="shadow-sm">
              Esgotado
            </Badge>
          ) : isLowStock ? (
            <Badge variant="amber" size="sm" className="shadow-sm">
              Restam {produto.estoque_qtd} un
            </Badge>
          ) : (
            <Badge variant="success" size="sm" className="bg-emerald-50/90 text-emerald-800 border-emerald-300 shadow-sm">
              Em estoque ({produto.estoque_qtd})
            </Badge>
          )}
        </div>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 shadow-md">
            <Eye className="w-3.5 h-3.5" /> Ver Detalhes
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Vendor name & City */}
          {produto.vendedor && (
            <Link
              href={`/loja/${produto.vendedor.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-900 transition-colors mb-1 truncate max-w-full"
            >
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {produto.vendedor.nome_loja}
                {produto.vendedor.cidade ? ` • ${produto.vendedor.cidade}` : ""}
              </span>
            </Link>
          )}

          {/* Product Title */}
          <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-primary-800 transition-colors">
            {produto.nome}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {truncateText(produto.descricao, 85) || "Produto artesanal fresco de qualidade garantida pelo produtor."}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Preço unitário</span>
            <span className="text-lg font-extrabold text-primary-800">
              {formatCurrency(produto.preco)}
            </span>
          </div>

          <Button
            size="sm"
            variant={isOutOfStock ? "secondary" : "primary"}
            disabled={isOutOfStock || isAdding}
            onClick={handleAddToCart}
            className="rounded-xl px-3.5 py-2"
            leftIcon={
              isAdding ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <ShoppingBasket className="w-4 h-4" />
              )
            }
          >
            {isOutOfStock ? "Esgotado" : isAdding ? "Adicionado!" : "Adicionar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
