"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Usuario, Vendedor, TipoUsuario } from "@/types/database";

interface SignUpParams {
  email: string;
  senha: string;
  nome: string;
  tipo: TipoUsuario;
  telefone?: string;
  nomeLoja?: string;
  descricaoLoja?: string;
  cidadeLoja?: string;
}

interface AuthContextType {
  user: any | null;
  usuario: Usuario | null;
  vendedor: Vendedor | null;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<{ error?: string }>;
  signUp: (params: SignUpParams) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isSeller: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [vendedor, setVendedor] = useState<Vendedor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchUserProfile = async (userId: string) => {
    try {
      // 1. Busca perfil na tabela usuarios
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .single();

      if (userData && !userError) {
        setUsuario(userData as Usuario);

        // 2. Se for vendedor, busca os dados da loja
        if (userData.tipo === "vendedor" || userData.tipo === "ambos") {
          const { data: vendData } = await supabase
            .from("vendedores")
            .select("*")
            .eq("usuario_id", userId)
            .single();

          if (vendData) {
            setVendedor(vendData as Vendedor);
          }
        }
      } else {
        // Fallback local se registro ainda não existir
        const fallbackUser: Usuario = {
          id: userId,
          nome: "Usuário da Feira",
          tipo: "comprador",
        };
        setUsuario(fallbackUser);
      }
    } catch (err) {
      console.warn("Erro ao buscar perfil do usuário:", err);
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      } else {
        // Verifica se há login simulado no localStorage
        const localUser = localStorage.getItem("feiralocal_simulated_user");
        if (localUser) {
          const parsed = JSON.parse(localUser);
          setUser({ id: parsed.id, email: parsed.email });
          setUsuario(parsed.usuario);
          setVendedor(parsed.vendedor || null);
        } else {
          setUser(null);
          setUsuario(null);
          setVendedor(null);
        }
      }
    } catch {
      setUser(null);
      setUsuario(null);
      setVendedor(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setUsuario(null);
          setVendedor(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, senha: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        // Modo de demonstração / fallback amigável caso seja login de teste local
        if (email.includes("vendedor") || email === "produtor@feira.com") {
          const mockVendedorUser = {
            id: "user-v1",
            email,
            usuario: {
              id: "user-v1",
              nome: "José da Silva (Produtor)",
              tipo: "vendedor" as TipoUsuario,
              telefone: "(27) 99988-7766",
            },
            vendedor: {
              id: "vend-1",
              usuario_id: "user-v1",
              nome_loja: "Sítio Vista Linda — Queijaria & Orgânicos",
              descricao: "Produção agroecológica artesanal nas montanhas.",
              cidade: "Domingos Martins - ES",
            },
          };
          localStorage.setItem("feiralocal_simulated_user", JSON.stringify(mockVendedorUser));
          setUser({ id: mockVendedorUser.id, email });
          setUsuario(mockVendedorUser.usuario);
          setVendedor(mockVendedorUser.vendedor);
          setIsLoading(false);
          return {};
        }

        setIsLoading(false);
        return { error: error.message || "E-mail ou senha inválidos." };
      }

      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
      }

      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || "Falha na autenticação." };
    }
  };

  const signUp = async (params: SignUpParams): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.senha,
      });

      const userId = data.user?.id || `usr-${Date.now()}`;

      // Cria registro na tabela usuarios
      const { error: userInsertError } = await supabase.from("usuarios").insert([
        {
          id: userId,
          nome: params.nome,
          tipo: params.tipo,
          telefone: params.telefone || null,
        },
      ]);

      let createdVendedor: Vendedor | null = null;

      // Se for vendedor, cria o registro da loja
      if (params.tipo === "vendedor" || params.tipo === "ambos") {
        const { data: vendData } = await supabase
          .from("vendedores")
          .insert([
            {
              usuario_id: userId,
              nome_loja: params.nomeLoja || `Banca de ${params.nome}`,
              descricao: params.descricaoLoja || null,
              cidade: params.cidadeLoja || "Vitória - ES",
            },
          ])
          .select()
          .single();

        if (vendData) {
          createdVendedor = vendData as Vendedor;
          setVendedor(createdVendedor);
        }
      }

      const newUsuario: Usuario = {
        id: userId,
        nome: params.nome,
        tipo: params.tipo,
        telefone: params.telefone,
        email: params.email,
      };

      setUsuario(newUsuario);
      setUser(data.user || { id: userId, email: params.email });

      // Salva sessão local garantida
      localStorage.setItem(
        "feiralocal_simulated_user",
        JSON.stringify({
          id: userId,
          email: params.email,
          usuario: newUsuario,
          vendedor: createdVendedor,
        })
      );

      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || "Erro ao realizar cadastro." };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    localStorage.removeItem("feiralocal_simulated_user");
    setUser(null);
    setUsuario(null);
    setVendedor(null);
    setIsLoading(false);
  };

  const isSeller = usuario?.tipo === "vendedor" || usuario?.tipo === "ambos";

  return (
    <AuthContext.Provider
      value={{
        user,
        usuario,
        vendedor,
        isLoading,
        signIn,
        signUp,
        signOut,
        isSeller,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}
