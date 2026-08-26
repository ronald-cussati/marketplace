"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/Button";
import { Store, MapPin, Phone, Save, CheckCircle2, User } from "lucide-react";

export default function PainelPerfilPage() {
  const { usuario, vendedor } = useAuth();
  const { toast } = useToast();

  const [nomeLoja, setNomeLoja] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (vendedor) {
      setNomeLoja(vendedor.nome_loja || "");
      setCidade(vendedor.cidade || "");
      setDescricao(vendedor.descricao || "");
    }
    if (usuario) {
      setTelefone(usuario.telefone || "");
    }
  }, [vendedor, usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simula atualização do perfil da banca
    setTimeout(() => {
      setIsSaving(false);
      toast("Dados da banca atualizados com sucesso!", "success");
    }, 600);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Configurações da Banca
        </h2>
        <p className="text-xs text-slate-500">
          Personalize as informações públicas que aparecem na vitrine da feira para os compradores.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nome da Banca / Ateliê *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={nomeLoja}
                onChange={(e) => setNomeLoja(e.target.value)}
                placeholder="Ex: Sítio Vista Linda — Queijaria & Orgânicos"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Município / Local da Feira *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Domingos Martins - ES"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              WhatsApp de Atendimento
            </label>
            <div className="relative">
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(27) 99988-7766"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              História e Apresentação da Banca
            </label>
            <textarea
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a história da sua produção, se possui certificações orgânicas, métodos tradicionais de preparo ou dias de colheita..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Salvar Alterações da Banca
          </Button>
        </div>
      </form>
    </div>
  );
}
