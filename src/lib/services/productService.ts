import { createClient } from "@/lib/supabase/client";
import { Produto } from "@/types/database";
import { MOCK_PRODUTOS } from "@/lib/mock-data";

export class ProductService {
  /**
   * Busca catálogo de produtos com filtros
   */
  static async getProdutos(filtros?: {
    categoria?: string;
    busca?: string;
    vendedorId?: string;
    apenasAtivos?: boolean;
  }): Promise<Produto[]> {
    const supabase = createClient();
    try {
      let query = supabase
        .from("produtos")
        .select(`
          *,
          vendedor:vendedores(
            id,
            usuario_id,
            nome_loja,
            descricao,
            cidade
          )
        `)
        .order("criado_em", { ascending: false });

      if (filtros?.apenasAtivos !== false) {
        query = query.eq("ativo", true);
      }

      if (filtros?.categoria && filtros.categoria !== "todas") {
        query = query.eq("categoria", filtros.categoria);
      }

      if (filtros?.vendedorId) {
        query = query.eq("vendedor_id", filtros.vendedorId);
      }

      if (filtros?.busca) {
        query = query.ilike("nome", `%${filtros.busca}%`);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return data as Produto[];
      }
    } catch (err) {
      console.warn("Aviso ao consultar Supabase, utilizando dados locais:", err);
    }

    // Fallback gracioso para dados locais de demonstração
    let resultado = [...MOCK_PRODUTOS];

    if (filtros?.apenasAtivos !== false) {
      resultado = resultado.filter((p) => p.ativo);
    }

    if (filtros?.categoria && filtros.categoria !== "todas") {
      resultado = resultado.filter((p) => p.categoria === filtros.categoria);
    }

    if (filtros?.vendedorId) {
      resultado = resultado.filter((p) => p.vendedor_id === filtros.vendedorId);
    }

    if (filtros?.busca) {
      const b = filtros.busca.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.nome.toLowerCase().includes(b) ||
          (p.descricao && p.descricao.toLowerCase().includes(b))
      );
    }

    return resultado;
  }

  /**
   * Busca um produto específico por ID
   */
  static async getProdutoById(id: string): Promise<Produto | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select(`
          *,
          vendedor:vendedores(
            id,
            usuario_id,
            nome_loja,
            descricao,
            cidade
          )
        `)
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as Produto;
      }
    } catch (err) {
      console.warn("Aviso ao buscar produto no Supabase:", err);
    }

    const localProd = MOCK_PRODUTOS.find((p) => p.id === id);
    return localProd || null;
  }

  /**
   * Cria novo produto no Supabase
   */
  static async createProduto(produto: Partial<Produto>): Promise<{ data: Produto | null; error: any }> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("produtos")
        .insert([
          {
            vendedor_id: produto.vendedor_id,
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            categoria: produto.categoria,
            estoque_qtd: produto.estoque_qtd ?? 0,
            imagem_url: produto.imagem_url,
            ativo: produto.ativo ?? true,
          },
        ])
        .select()
        .single();

      return { data: data as Produto, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  /**
   * Atualiza produto existente
   */
  static async updateProduto(
    id: string,
    updates: Partial<Produto>
  ): Promise<{ data: Produto | null; error: any }> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("produtos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      return { data: data as Produto, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  /**
   * Exclui ou inativa um produto
   */
  static async deleteProduto(id: string): Promise<{ error: any }> {
    const supabase = createClient();
    try {
      const { error } = await supabase.from("produtos").delete().eq("id", id);
      return { error };
    } catch (err) {
      return { error: err };
    }
  }
}
