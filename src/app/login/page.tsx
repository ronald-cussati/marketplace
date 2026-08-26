"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/Button";
import { Sprout, LogIn, Store, User, AlertCircle, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    const res = await signIn(email, senha);
    if (res.error) {
      setErro(res.error);
      toast(res.error, "error");
    } else {
      toast("Bem-vindo de volta ao FeiraLocal!", "success");
      router.push("/");
    }
  };

  const handleQuickLogin = async (tipo: "comprador" | "vendedor") => {
    if (tipo === "vendedor") {
      setEmail("produtor@feira.com");
      setSenha("senha123");
      const res = await signIn("produtor@feira.com", "senha123");
      if (!res.error) {
        toast("Logado como Produtor (Sítio Vista Linda)!", "success");
        router.push("/painel");
      }
    } else {
      setEmail("comprador@email.com");
      setSenha("senha123");
      const res = await signIn("comprador@email.com", "senha123");
      if (!res.error) {
        toast("Logado como Comprador!", "success");
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
              FeiraLocal
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Acesse sua Conta
          </h1>
          <p className="text-xs text-slate-500">
            Entre para gerenciar sua banca ou acompanhar suas compras.
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="p-3.5 rounded-2xl bg-earth-50 border border-earth-200/80 space-y-2">
          <span className="text-[11px] font-bold text-earth-900 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Atalhos para Avaliação Acadêmica:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("comprador")}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-primary-600" />
              Comprador
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("vendedor")}
              className="px-3 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Store className="w-3.5 h-3.5 text-white" />
              Produtor / Vendedor
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@exemplo.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full font-bold shadow-lg shadow-primary-700/20"
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Entrar
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
          Não possui uma conta?{" "}
          <Link href="/cadastro" className="font-bold text-primary-700 hover:underline">
            Cadastre-se gratuitamente
          </Link>
        </div>
      </div>
    </div>
  );
}
