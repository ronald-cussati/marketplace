"use client";

import React from "react";
import { CATEGORIAS_FEIRA } from "@/lib/utils";
import { Search, Sparkles, Carrot, Milk, Croissant, Hexagon, Palette, Wine, Leaf, X } from "lucide-react";

interface ProductFilterProps {
  categoriaSelecionada: string;
  onSelectCategoria: (categoriaId: string) => void;
  busca: string;
  onBuscaChange: (busca: string) => void;
  totalEncontrados: number;
}

const ICONES_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Carrot: <Carrot className="w-4 h-4" />,
  Milk: <Milk className="w-4 h-4" />,
  Croissant: <Croissant className="w-4 h-4" />,
  Hexagon: <Hexagon className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Wine: <Wine className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
};

export function ProductFilter({
  categoriaSelecionada,
  onSelectCategoria,
  busca,
  onBuscaChange,
  totalEncontrados,
}: ProductFilterProps) {
  return (
    <div className="space-y-6" id="categorias">
      {/* Search Bar & Result Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            placeholder="Buscar por mel, queijo, café, artesanato..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm transition-all"
          />
          {busca && (
            <button
              onClick={() => onBuscaChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Counter Badge */}
        <div className="text-xs font-semibold text-slate-500 bg-slate-100/80 px-3.5 py-2 rounded-xl border border-slate-200/60 self-end sm:self-center">
          {totalEncontrados} {totalEncontrados === 1 ? "produto disponível" : "produtos disponíveis"}
        </div>
      </div>

      {/* Category Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIAS_FEIRA.map((cat) => {
          const isSelected = categoriaSelecionada === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategoria(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-sm ${
                isSelected
                  ? "bg-primary-700 text-white shadow-md shadow-primary-700/20 scale-[1.02]"
                  : "bg-white text-slate-700 hover:bg-primary-50 hover:text-primary-800 border border-slate-200/80"
              }`}
            >
              <span className={isSelected ? "text-white" : "text-primary-600"}>
                {ICONES_MAP[cat.icone] || <Sparkles className="w-4 h-4" />}
              </span>
              <span>{cat.nome}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
