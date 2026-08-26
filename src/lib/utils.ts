import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount || 0);
  if (isNaN(num)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export const CATEGORIAS_FEIRA = [
  { id: "todas", nome: "Todas as Categorias", icone: "Sparkles" },
  { id: "Hortifrúti", nome: "Hortifrúti Orgânico", icone: "Carrot" },
  { id: "Queijos & Laticínios", nome: "Queijos & Laticínios", icone: "Milk" },
  { id: "Panificação & Doces", nome: "Pães & Doces", icone: "Croissant" },
  { id: "Mel & Geleias", nome: "Mel & Geleias", icone: "Hexagon" },
  { id: "Artesanato", nome: "Artesanato & Decoração", icone: "Palette" },
  { id: "Bebidas Artesanais", nome: "Bebidas & Licores", icone: "Wine" },
  { id: "Temperos & Ervas", nome: "Temperos & Ervas", icone: "Leaf" },
] as const;
