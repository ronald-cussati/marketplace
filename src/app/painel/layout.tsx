"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  ArrowLeft,
  Sprout,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { usuario, vendedor, isSeller } = useAuth();

  const navItems = [
    {
      href: "/painel",
      label: "Visão Geral",
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      href: "/painel/produtos",
      label: "Meus Produtos & Estoque",
      icon: <Package className="w-4 h-4" />,
    },
    {
      href: "/painel/pedidos",
      label: "Pedidos Recebidos",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      href: "/painel/perfil",
      label: "Dados da Banca",
      icon: <Store className="w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-earth-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-xs font-semibold">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>Painel de Controle do Produtor / Vendedor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {vendedor?.nome_loja || "Minha Banca na Feira"}
          </h1>
          <p className="text-xs sm:text-sm text-primary-100/80">
            {vendedor?.cidade || "Vitória - ES"} • Olá, {usuario?.nome?.split(" ")[0] || "Produtor"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Ver Vitrine da Feira
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Sidebar + Subpage Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary-700 text-white shadow-md shadow-primary-700/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className={isActive ? "text-white" : "text-primary-600"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Dynamic Page Content */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
