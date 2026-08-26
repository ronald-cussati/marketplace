"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Produto, Vendedor } from "@/types/database";
import { ProductService } from "@/lib/services/productService";
import { MOCK_VENDEDORES } from "@/lib/mock-data";
import { ProductCard } from "@/components/produtos/ProductCard";
import { ProductDetailModal } from "@/components/produtos/ProductDetailModal";
import { Button } from "@/components/ui/Button";
import { Store, MapPin, ArrowLeft, Loader2, Sparkles } from "lucide-react";

export default function LojaProdutorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [vendedor, setVendedor] = useState<Vendedor | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadStore() {
      setIsLoading(true);
      try {
        const foundVend = MOCK_VENDEDORES.find((v) => v.id === id) || {
          id,
          usuario_id: "user-unknown",
          nome_loja: "Banca do Produtor",
          descricao: "Produtos frescos cultivados de forma artesanal e familiar.",
          cidade: "Vitória - ES",
        };
        setVendedor(foundVend);

        const prods = await ProductService.getProdutos({
          vendedorId: id,
          apenasAtivos: true,
        });
        setProdutos(prods);
      } catch (e) {
        console.error("Erro ao carregar banca:", e);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadStore();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-sm text-slate-500">Carregando a banca do produtor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a Vitrine
      </button>

      {/* Store Header Profile */}
      <div className="bg-gradient-to-br from-earth-900 via-earth-800 to-primary-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 flex-shrink-0 shadow-lg">
            <Store className="w-10 h-10" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Banca Certificada da Feira Local</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {vendedor?.nome_loja}
            </h1>
            {vendedor?.cidade && (
              <p className="text-xs sm:text-sm text-earth-200 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-amber-400" />
                {vendedor.cidade}
              </p>
            )}
          </div>
        </div>

        {vendedor?.descricao && (
          <p className="text-sm text-earth-100 max-w-3xl leading-relaxed pt-4 border-t border-white/10">
            {vendedor.descricao}
          </p>
        )}
      </div>

      {/* Store's Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Produtos Disponíveis nesta Banca
            </h2>
            <p className="text-xs text-slate-500">
              {produtos.length} {produtos.length === 1 ? "item à venda" : "itens à venda"}
            </p>
          </div>
        </div>

        {produtos.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <p className="text-sm text-slate-500">Esta banca ainda não cadastrou produtos ativos para a feira desta semana.</p>
            <Link href="/">
              <Button variant="primary">Ver outros produtores</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtos.map((prod) => (
              <ProductCard
                key={prod.id}
                produto={prod}
                onOpenDetail={(p) => {
                  setProdutoSelecionado(p);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductDetailModal
        produto={produtoSelecionado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
