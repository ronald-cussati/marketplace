"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Produto } from "@/types/database";
import { ProductService } from "@/lib/services/productService";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ShoppingBasket,
  MapPin,
  Store,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Leaf,
  Share2,
  Check,
  Loader2,
} from "lucide-react";

export default function ProdutoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [produto, setProduto] = useState<Produto | null>(null);
  const [relacionados, setRelacionados] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const prod = await ProductService.getProdutoById(id);
        setProduto(prod);

        if (prod?.categoria) {
          const rel = await ProductService.getProdutos({
            categoria: prod.categoria,
            apenasAtivos: true,
          });
          setRelacionados(rel.filter((p) => p.id !== id).slice(0, 3));
        }
      } catch (e) {
        console.error("Erro ao carregar produto:", e);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  const handleAddToCart = () => {
    if (!produto || produto.estoque_qtd <= 0) return;
    setIsAdding(true);
    const added = addItem(produto, quantidade);
    if (added) {
      toast(`✅ ${quantidade}x "${produto.nome}" adicionado à cesta!`, "success");
    } else {
      toast("Quantidade solicitada excede o estoque disponível.", "error");
    }
    setIsAdding(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: produto?.nome,
        text: `Confira este produto no FeiraLocal: ${produto?.nome}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Link copiado para a área de transferência!", "info");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-sm text-slate-500">Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Produto não encontrado</h2>
        <p className="text-sm text-slate-500">
          O produto que você procura pode ter sido esgotado ou removido pelo produtor.
        </p>
        <Link href="/">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Voltar para a Vitrine
          </Button>
        </Link>
      </div>
    );
  }

  const isOutOfStock = produto.estoque_qtd <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back link */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md">
            <Image
              src={produto.imagem_url || "https://placehold.co/800x800?text=FeiraLocal"}
              alt={produto.nome}
              fill
              priority
              className="object-cover"
            />
            {produto.categoria && (
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" size="md" className="bg-white/95 backdrop-blur-md shadow-sm">
                  {produto.categoria}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info & Purchase */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Vendor chip */}
            {produto.vendedor && (
              <Link
                href={`/loja/${produto.vendedor.id}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-earth-100 hover:bg-earth-200 text-earth-900 text-xs font-bold transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-earth-700" />
                <span>{produto.vendedor.nome_loja}</span>
                {produto.vendedor.cidade && (
                  <span className="text-earth-600 font-normal">
                    • {produto.vendedor.cidade}
                  </span>
                )}
              </Link>
            )}

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {produto.nome}
            </h1>

            {/* Price & Stock */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-4xl font-black text-primary-800">
                {formatCurrency(produto.preco)}
              </span>
              {isOutOfStock ? (
                <Badge variant="danger">Esgotado</Badge>
              ) : (
                <Badge variant="success">
                  {produto.estoque_qtd} un em estoque
                </Badge>
              )}
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Descrição do Produtor
              </h3>
              <p className="text-base text-slate-700 leading-relaxed">
                {produto.descricao ||
                  "Produto artesanal preparado segundo métodos tradicionais e sustentáveis pelos produtores locais."}
              </p>
            </div>
          </div>

          {/* Action Box */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 shadow-sm">
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  Quantidade desejada:
                </span>
                <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-2 bg-white shadow-sm">
                  <button
                    onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                    disabled={quantidade <= 1}
                    className="text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-bold w-8 text-center">{quantidade}</span>
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

            <div className="flex items-center gap-3">
              <Button
                variant={isOutOfStock ? "secondary" : "primary"}
                size="lg"
                disabled={isOutOfStock || isAdding}
                onClick={handleAddToCart}
                className="flex-1 font-bold shadow-lg shadow-primary-700/20"
                leftIcon={<ShoppingBasket className="w-5 h-5" />}
              >
                {isOutOfStock
                  ? "Esgotado no momento"
                  : `Adicionar à Cesta • ${formatCurrency(produto.preco * quantidade)}`}
              </Button>

              <button
                onClick={handleShare}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
                title="Compartilhar produto"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary-600" />
                <span>Origem Agroecológica</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Compra Comunitária Segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relacionados.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">
            Outros produtos em {produto.categoria}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relacionados.map((rel) => (
              <Link
                key={rel.id}
                href={`/produtos/${rel.id}`}
                className="group bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <Image
                    src={rel.imagem_url || "https://placehold.co/200x200?text=Feira"}
                    alt={rel.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-primary-700">
                    {rel.nome}
                  </h4>
                  <span className="text-xs font-extrabold text-primary-800">
                    {formatCurrency(rel.preco)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
