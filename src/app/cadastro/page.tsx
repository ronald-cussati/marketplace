"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { TipoUsuario } from "@/types/database";
import { Button } from "@/components/ui/Button";
import {
  Sprout,
  Store,
  User,
  ShoppingBag,
  AlertCircle,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const { toast } = useToast();

  const [tipo, setTipo] = useState<TipoUsuario>("comprador");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");

  // Seller specific fields
  const [nomeLoja, setNomeLoja] = useState("");
  const [cidadeLoja, setCidadeLoja] = useState("Vitória - ES");
  const [descricaoLoja, setDescricaoLoja] = useState("");

  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (tipo === "vendedor" && !nomeLoja.trim()) {
      setErro("Informe o nome da sua banca ou ateliê.");
      return;
    }

    const res = await signUp({
      email,
      senha,
      nome,
      tipo,
      telefone,
      nomeLoja,
      descricaoLoja,
      cidadeLoja,
    });

    if (res.error) {
      setErro(res.error);
      toast(res.error, "error");
    } else {
      toast("Conta criada com sucesso!", "success");
      if (tipo === "vendedor") {
        router.push("/painel");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
              FeiraLocal
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Criar Nova Conta
          </h1>
          <p className="text-xs text-slate-500">
            Junte-se à maior feira digital de produtores e artesãos locais.
          </p>
        </div>

        {/* Profile Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setTipo("comprador")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
              tipo === "comprador"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-primary-600" />
            Quero Comprar
          </button>

          <button
            type="button"
            onClick={() => setTipo("vendedor")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
              tipo === "vendedor"
                ? "bg-primary-700 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Store className="w-4 h-4" />
            Quero Vender (Produtor)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Maria Aparecida dos Santos"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                E-mail *
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
                WhatsApp / Telefone
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(27) 99999-8888"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Senha *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Seller Extra Section */}
          {tipo === "vendedor" && (
            <div className="pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-200">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold">
                <Store className="w-3.5 h-3.5" />
                <span>Dados da sua Banca ou Agroindústria</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nome da Banca / Ateliê *
                </label>
                <input
                  type="text"
                  required={tipo === "vendedor"}
                  value={nomeLoja}
                  onChange={(e) => setNomeLoja(e.target.value)}
                  placeholder="Ex: Sítio Bela Vista, Ateliê Cerâmica Viva"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Município de Origem / Feira
                </label>
                <input
                  type="text"
                  value={cidadeLoja}
                  onChange={(e) => setCidadeLoja(e.target.value)}
                  placeholder="Ex: Domingos Martins - ES, Vitória - ES"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  História / Bio da Produção (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={descricaoLoja}
                  onChange={(e) => setDescricaoLoja(e.target.value)}
                  placeholder="Conte um pouco sobre sua produção familiar, técnicas artesanais ou certificação orgânica..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full font-bold shadow-lg shadow-primary-700/20"
          >
            {tipo === "vendedor" ? "Criar Conta de Produtor" : "Criar Conta de Comprador"}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
          Já possui conta?{" "}
          <Link href="/login" className="font-bold text-primary-700 hover:underline">
            Faça login aqui
          </Link>
        </div>
      </div>
    </div>
  );
}
