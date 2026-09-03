import React from "react";
import Link from "next/link";
import { Sprout, ShieldCheck, RefreshCw, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* Value Proposition Strip */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-950 border border-primary-800/50 flex items-center justify-center text-primary-400">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Produtores Locais</h4>
              <p className="text-xs text-slate-400">Alimentos agroecológicos e artesanato autêntico.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Transparência Total</h4>
              <p className="text-xs text-slate-400">Direto do produtor sem intermediários abusivos.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Controle de Estoque Real</h4>
              <p className="text-xs text-slate-400">Disponibilidade atualizada em tempo real.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: About */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">
              FeiraLocal
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Plataforma de comércio comunitário desenvolvida como projeto acadêmico do curso de
            <strong> Sistemas de Informação (Faculdade Multivix)</strong>. Promove a inclusão digital
            de feirantes, agricultores familiares e artesãos regionais.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://github.com/ronald-cussati/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl"
            >
              <Github className="w-4 h-4" />
              Repositório GitHub
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navegação</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/" className="hover:text-primary-400 transition-colors">
                Vitrine de Produtos
              </Link>
            </li>
            <li>
              <Link href="/#categorias" className="hover:text-primary-400 transition-colors">
                Categorias da Feira
              </Link>
            </li>
            <li>
              <Link href="/#produtores" className="hover:text-primary-400 transition-colors">
                Produtores Cadastrados
              </Link>
            </li>
            <li>
              <Link href="/cadastro" className="hover:text-primary-400 transition-colors">
                Cadastrar Banca / Produtor
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Academic Credits */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Projeto Acadêmico</h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li><strong>Faculdade Multivix</strong></li>
            <li>Sistemas de Informação</li>
            <li>Equipe Scrum (6 Integrantes)</li>
            <li>Sprints Quinzenais</li>
            <li>Deploy: Vercel & Supabase</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>
          FeiraLocal © {new Date().getFullYear()} — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
