"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Produto } from "@/types/database";
import { ProductService } from "@/lib/services/productService";
import { formatCurrency } from "@/lib/utils";
import { ProductModal } from "@/components/painel/ProductModal";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  PlusCircle,
  MinusCircle,
  Search,
  Check,
  X,
  Loader2,
} from "lucide-react";

export default function PainelProdutosPage() {
  const { vendedor } = useAuth();
  const { toast } = useToast();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const vendedorId = vendedor?.id || "vend-1";

  const carregarProdutos = async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getProdutos({
        vendedorId,
        apenasAtivos: false,
      });
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, [vendedorId]);

  const handleSave = async (data: Partial<Produto>) => {
    if (produtoEditando) {
      await ProductService.updateProduto(produtoEditando.id, data);
      toast("Produto atualizado com sucesso!", "success");
    } else {
      await ProductService.createProduto(data);
      toast("Novo produto cadastrado na banca!", "success");
    }
    await carregarProdutos();
  };

  const handleToggleAtivo = async (produto: Produto) => {
    const novoStatus = !produto.ativo;
    await ProductService.updateProduto(produto.id, { ativo: novoStatus });
    toast(
      novoStatus
        ? `"${produto.nome}" está visível na vitrine!`
        : `"${produto.nome}" foi ocultado da vitrine.`,
      "info"
    );
    await carregarProdutos();
  };

  const handleUpdateEstoque = async (produto: Produto, delta: number) => {
    const novoEstoque = Math.max(0, produto.estoque_qtd + delta);
    await ProductService.updateProduto(produto.id, { estoque_qtd: novoEstoque });
    await carregarProdutos();
  };

  const handleDelete = async (produto: Produto) => {
    if (confirm(`Deseja realmente excluir o produto "${produto.nome}"?`)) {
      await ProductService.deleteProduto(produto.id);
      toast("Produto removido com sucesso.", "info");
      await carregarProdutos();
    }
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Catálogo & Controle de Estoque
          </h2>
          <p className="text-xs text-slate-500">
            Cadastre novos itens, altere preços e ajuste quantidades disponíveis em tempo real.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setProdutoEditando(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-md shadow-primary-700/20"
        >
          Novo Produto
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar em meus produtos cadastrados..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-sm text-slate-500">Carregando seus produtos...</p>
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">Nenhum produto cadastrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cadastre seu primeiro produto para que os compradores possam encontrá-lo na feira.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setProdutoEditando(null);
              setIsModalOpen(true);
            }}
          >
            Cadastrar Primeiro Produto
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Preço Unitário</th>
                  <th className="px-6 py-4">Estoque Atual</th>
                  <th className="px-6 py-4">Status Vitrine</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produtosFiltrados.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Image & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                          <Image
                            src={prod.imagem_url || "https://placehold.co/100x100?text=Produto"}
                            alt={prod.nome}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-slate-900 line-clamp-1 max-w-[180px]">
                          {prod.nome}
                        </span>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="px-6 py-4">
                      <Badge variant="secondary" size="sm">
                        {prod.categoria || "Geral"}
                      </Badge>
                    </td>

                    {/* Preço */}
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                      {formatCurrency(prod.preco)}
                    </td>

                    {/* Estoque com botões de ajuste inline */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateEstoque(prod, -1)}
                          disabled={prod.estoque_qtd <= 0}
                          className="text-slate-400 hover:text-red-600 disabled:opacity-30"
                          title="Diminuir 1 un"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                        <span
                          className={`font-black text-sm w-8 text-center ${
                            prod.estoque_qtd <= 5 ? "text-amber-700" : "text-slate-900"
                          }`}
                        >
                          {prod.estoque_qtd}
                        </span>
                        <button
                          onClick={() => handleUpdateEstoque(prod, 1)}
                          className="text-slate-400 hover:text-emerald-600"
                          title="Aumentar 1 un"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Switch Ativo / Inativo */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAtivo(prod)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors ${
                          prod.ativo
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        {prod.ativo ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {prod.ativo ? "Ativo na Feira" : "Inativo"}
                      </button>
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => {
                            setProdutoEditando(prod);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                          title="Editar dados"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        produtoInicial={produtoEditando}
        vendedorId={vendedorId}
      />
    </div>
  );
}
