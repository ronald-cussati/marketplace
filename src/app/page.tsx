"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Produto, Vendedor } from "@/types/database";
import { ProductService } from "@/lib/services/productService";
import { MOCK_VENDEDORES } from "@/lib/mock-data";
import { ProductCard } from "@/components/produtos/ProductCard";
import { ProductFilter } from "@/components/produtos/ProductFilter";
import { ProductDetailModal } from "@/components/produtos/ProductDetailModal";
import { Button } from "@/components/ui/Button";
import {
  Sprout,
  ShoppingBag,
  Store,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  MapPin,
  Loader2,
} from "lucide-react";

export default function HomePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoria, setCategoria] = useState("todas");
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarProdutos = async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getProdutos({
        categoria,
        busca,
        apenasAtivos: true,
      });
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao carregar catálogo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, [categoria, busca]);

  const handleOpenDetail = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800 text-white pt-12 pb-24 md:py-24">
        {/* Background Subtle Organic Shapes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-400 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-400 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-primary-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Marketplace Comunitário & Agricultura Familiar</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Da banca da feira direto para a sua mesa.
              </h1>

              <p className="text-base sm:text-lg text-primary-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Descubra hortaliças colhidas no dia, queijos artesanais da serra, pães de
                fermentação natural e cerâmicas exclusivas feitas por produtores e artesãos locais.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <a href="#catalogo" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="amber"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="w-full shadow-xl shadow-amber-600/30 font-bold"
                  >
                    Explorar a Feira
                  </Button>
                </a>
                <Link href="/cadastro" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                    leftIcon={<Store className="w-5 h-5" />}
                  >
                    Cadastrar Minha Banca
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-primary-800/80 grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block font-black text-2xl text-amber-300">+25</span>
                  <span className="text-xs text-primary-200">Produtores Locais</span>
                </div>
                <div>
                  <span className="block font-black text-2xl text-emerald-300">100%</span>
                  <span className="text-xs text-primary-200">Artesanal & Fresco</span>
                </div>
                <div>
                  <span className="block font-black text-2xl text-white">0%</span>
                  <span className="text-xs text-primary-200">Taxas Abusivas</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner">
                  <Image
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                    alt="Feira de Produtores Locais"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md text-slate-900 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary-800 uppercase tracking-wide">
                      🌾 Destaque da Semana
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Colheita de Hoje
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Cesta Agroecológica das Montanhas
                  </h4>
                  <p className="text-xs text-slate-500">
                    Sítio Vista Linda • Domingos Martins - ES
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Catalogue & Filters Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="catalogo">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vitrine de Produtos Locais
          </h2>
          <p className="text-sm text-slate-500">
            Filtre por categoria ou pesquise pelo que você procura nesta feira.
          </p>
        </div>

        {/* Filter Bar */}
        <ProductFilter
          categoriaSelecionada={categoria}
          onSelectCategoria={setCategoria}
          busca={busca}
          onBuscaChange={setBusca}
          totalEncontrados={produtos.length}
        />

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <p className="text-sm font-medium">Buscando os produtos frescos da feira...</p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Nenhum produto encontrado</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Não encontramos produtos correspondentes ao termo ou categoria selecionada.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setCategoria("todas");
                setBusca("");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtos.map((prod) => (
              <ProductCard
                key={prod.id}
                produto={prod}
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Featured Producers / Bancas */}
      <section className="bg-earth-50/70 border-y border-earth-200/60 py-16" id="produtores">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Conheça Nossos Produtores
            </h2>
            <p className="text-sm text-slate-600">
              Famílias que cultivam com respeito à terra e artesãos que mantêm viva a cultura local.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_VENDEDORES.map((vendedor) => (
              <Link
                key={vendedor.id}
                href={`/loja/${vendedor.id}`}
                className="group bg-white p-6 rounded-3xl border border-earth-200 shadow-sm hover:shadow-xl hover:border-primary-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    <Store className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-primary-800 transition-colors">
                    {vendedor.nome_loja}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {vendedor.descricao}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-primary-600" />
                    {vendedor.cidade}
                  </span>
                  <span className="font-bold text-primary-700 group-hover:translate-x-0.5 transition-transform">
                    Ver banca →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Seller Invitation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-800 to-primary-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-xs font-semibold">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Espaço para o Feirante e Artesão</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Você produz alimentos ou artesanato? Divulgue sua banca aqui!
            </h2>
            <p className="text-sm sm:text-base text-primary-100/90 leading-relaxed">
              Crie sua conta em poucos cliques, cadastre seus produtos pelo celular, controle seu
              estoque e alcance novos clientes sem burocracia.
            </p>
            <div className="pt-2">
              <Link href="/cadastro">
                <Button
                  size="lg"
                  variant="amber"
                  className="font-bold shadow-xl shadow-amber-600/30"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Criar Conta de Produtor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        produto={produtoSelecionado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
