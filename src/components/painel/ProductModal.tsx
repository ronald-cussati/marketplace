"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Produto } from "@/types/database";
import { CATEGORIAS_FEIRA } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import {
  ImageIcon,
  Save,
  AlertCircle,
  Upload,
  Sparkles,
  Check,
} from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (produtoData: Partial<Produto>) => Promise<void>;
  produtoInicial?: Produto | null;
  vendedorId: string;
}

const PRESET_IMAGENS = [
  {
    nome: "Queijo Artesanal",
    url: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Mel Puro",
    url: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Pão Rústico",
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Hortaliças",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Artesanato Palha",
    url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Geleia",
    url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Cerâmica",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Café Especial",
    url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
  },
];

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  produtoInicial,
  vendedorId,
}: ProductModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("Hortifrúti");
  const [estoqueQtd, setEstoqueQtd] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [erro, setErro] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (produtoInicial) {
      setNome(produtoInicial.nome);
      setDescricao(produtoInicial.descricao || "");
      setPreco(produtoInicial.preco.toString());
      setCategoria(produtoInicial.categoria || "Hortifrúti");
      setEstoqueQtd(produtoInicial.estoque_qtd.toString());
      setImagemUrl(produtoInicial.imagem_url || "");
      setAtivo(produtoInicial.ativo);
    } else {
      setNome("");
      setDescricao("");
      setPreco("");
      setCategoria("Hortifrúti");
      setEstoqueQtd("10");
      setImagemUrl("");
      setAtivo(true);
    }
    setErro("");
  }, [produtoInicial, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `produtos/${fileName}`;

      // Tenta upload no bucket 'produtos' do Supabase Storage
      const { data, error } = await supabase.storage
        .from("produtos")
        .upload(filePath, file);

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("produtos")
          .getPublicUrl(filePath);
        setImagemUrl(publicUrlData.publicUrl);
      } else {
        // Fallback: Converte para Base64 Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagemUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn("Aviso ao fazer upload, utilizando fallback:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }

    const numPreco = parseFloat(preco);
    if (isNaN(numPreco) || numPreco <= 0) {
      setErro("Informe um preço unitário válido maior que zero.");
      return;
    }

    const numEstoque = parseInt(estoqueQtd, 10);
    if (isNaN(numEstoque) || numEstoque < 0) {
      setErro("A quantidade em estoque não pode ser negativa.");
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        ...(produtoInicial ? { id: produtoInicial.id } : {}),
        vendedor_id: vendedorId,
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        preco: numPreco,
        categoria,
        estoque_qtd: numEstoque,
        imagem_url:
          imagemUrl.trim() ||
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        ativo,
      });
      onClose();
    } catch (err: any) {
      setErro(err.message || "Erro ao salvar produto.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={produtoInicial ? "Editar Produto" : "Cadastrar Novo Produto"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {erro && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Nome do Produto */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Nome do Produto *
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Queijo Meia Cura Artesanal, Mel Silvestre 500g"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Grid: Categoria, Preço e Estoque */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CATEGORIAS_FEIRA.filter((c) => c.id !== "todas").map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Preço (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.10"
              required
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="0,00"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Estoque Inicial *
            </label>
            <input
              type="number"
              min="0"
              required
              value={estoqueQtd}
              onChange={(e) => setEstoqueQtd(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Seção de Imagem: Upload de Arquivo + URL Externa + Presets */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Foto do Produto (Upload ou URL)
          </label>

          {/* Preview da Imagem Selecionada */}
          {imagemUrl && (
            <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                <img
                  src={imagemUrl}
                  alt="Pré-visualização"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <span className="font-bold text-emerald-700 block">✓ Foto Selecionada</span>
                <span className="text-slate-400 truncate block text-[11px]">{imagemUrl}</span>
              </div>
              <button
                type="button"
                onClick={() => setImagemUrl("")}
                className="text-xs text-red-600 font-bold px-2 py-1 hover:bg-red-50 rounded-lg"
              >
                Remover
              </button>
            </div>
          )}

          {/* Botão de Upload e Campo de URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                isLoading={isUploading}
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
              >
                Enviar Foto do Celular/PC
              </Button>
            </div>

            <div className="relative">
              <input
                type="url"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder="Ou cole o link da foto..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              />
              <ImageIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Galeria de Fotos Rápidas da Feira */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Ou escolha uma foto artesanal da galeria:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {PRESET_IMAGENS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImagemUrl(preset.url)}
                  className={`relative aspect-video rounded-lg overflow-hidden border transition-all text-left ${
                    imagemUrl === preset.url
                      ? "ring-2 ring-primary-600 border-primary-600"
                      : "border-slate-200 hover:opacity-80"
                  }`}
                  title={preset.nome}
                >
                  <img
                    src={preset.url}
                    alt={preset.nome}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate block font-medium">
                    {preset.nome}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Descrição e Ingredientes
          </label>
          <textarea
            rows={2}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o modo de preparo, colheita, dimensões ou diferenciais artesanais..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Switch Ativo / Inativo */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Exibir na Vitrine Pública</span>
            <span className="text-[11px] text-slate-500">
              Se desativado, o produto fica salvo no painel mas oculto aos compradores.
            </span>
          </div>
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {produtoInicial ? "Salvar Alterações" : "Cadastrar Produto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
