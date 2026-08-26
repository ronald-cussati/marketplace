"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingBasket,
  User,
  Store,
  LogOut,
  PackageCheck,
  Menu,
  X,
  Sprout,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const { user, usuario, isSeller, signOut } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white shadow-md shadow-primary-600/30 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary-800 via-primary-700 to-earth-800 bg-clip-text text-transparent">
                FeiraLocal
              </span>
              <span className="text-[11px] font-semibold text-primary-700/80 uppercase tracking-widest -mt-1">
                Feira & Artesanato
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link
              href="/"
              className={`transition-colors hover:text-primary-700 ${
                pathname === "/" ? "text-primary-700 font-bold" : ""
              }`}
            >
              Vitrine da Feira
            </Link>
            <Link
              href="/#categorias"
              className="transition-colors hover:text-primary-700"
            >
              Categorias
            </Link>
            <Link
              href="/#produtores"
              className="transition-colors hover:text-primary-700"
            >
              Produtores Locais
            </Link>
            <Link
              href="/#sobre"
              className="transition-colors hover:text-primary-700"
            >
              Sobre o Projeto
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Cart Button with Animated Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl text-slate-700 hover:text-primary-700 hover:bg-primary-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Abrir Cesta de Compras"
            >
              <ShoppingBasket className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[11px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Seller Shortcut if logged in as seller */}
            {isSeller && (
              <Link href="/painel" className="hidden sm:inline-flex">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Store className="w-4 h-4" />}
                  className="rounded-xl border-primary-600/40 text-primary-800 hover:bg-primary-50"
                >
                  Painel da Banca
                </Button>
              </Link>
            )}

            {/* User Auth Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-sm font-medium text-slate-800"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-xs">
                    {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {usuario?.nome?.split(" ")[0] || "Minha Conta"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Logado como</p>
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {usuario?.nome || user.email}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 uppercase">
                          {usuario?.tipo || "comprador"}
                        </span>
                      </div>

                      {isSeller && (
                        <Link
                          href="/painel"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                        >
                          <Store className="w-4 h-4 text-primary-600" />
                          Painel do Vendedor
                        </Link>
                      )}

                      <Link
                        href="/meus-pedidos"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                      >
                        <PackageCheck className="w-4 h-4 text-primary-600" />
                        Meus Pedidos
                      </Link>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair da Conta
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold">
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                  >
                    Vender / Comprar
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-primary-50 font-medium"
              >
                Vitrine da Feira
              </Link>
              <Link
                href="/#categorias"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-primary-50 font-medium"
              >
                Categorias
              </Link>
              <Link
                href="/#produtores"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-primary-50 font-medium"
              >
                Produtores Locais
              </Link>
              {isSeller && (
                <Link
                  href="/painel"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-xl text-primary-800 bg-primary-50 font-bold flex items-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  Painel do Vendedor
                </Link>
              )}
              {user && (
                <Link
                  href="/meus-pedidos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-primary-50 font-medium flex items-center gap-2"
                >
                  <PackageCheck className="w-4 h-4" />
                  Meus Pedidos
                </Link>
              )}
              {!user && (
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/cadastro" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
