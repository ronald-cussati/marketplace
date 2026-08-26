import { createClient } from "@/lib/supabase/client";
import { CartItem, Pedido } from "@/types/database";

export interface CriarPedidoParams {
  compradorId: string;
  itens: CartItem[];
  total: number;
  metodoPagamento: string;
}

export class OrderService {
  /**
   * Criação atômica simulada de pedido com itens, pagamento e baixa de estoque
   */
  static async criarPedido(params: CriarPedidoParams): Promise<{
    sucesso: boolean;
    pedidoId: string;
    mensagem: string;
    error?: any;
  }> {
    const supabase = createClient();
    const pedidoId = `ped-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      // 1. Grava o pedido
      const { data: pedidoData, error: pedidoError } = await supabase
        .from("pedidos")
        .insert([
          {
            comprador_id: params.compradorId,
            status: "pago",
            total: params.total,
          },
        ])
        .select()
        .single();

      const finalPedidoId = pedidoData?.id || pedidoId;

      if (!pedidoError && pedidoData) {
        // 2. Grava os itens do pedido
        const itensToInsert = params.itens.map((item) => ({
          pedido_id: finalPedidoId,
          produto_id: item.produto.id,
          quantidade: item.quantidade,
          preco_unitario: item.produto.preco,
        }));

        await supabase.from("itens_pedido").insert(itensToInsert);

        // 3. Grava o registro de pagamento mock
        await supabase.from("pagamentos").insert([
          {
            pedido_id: finalPedidoId,
            status: "aprovado",
            metodo: params.metodoPagamento || "mock",
          },
        ]);

        // 4. Decrementa o estoque de cada produto
        for (const item of params.itens) {
          const novoEstoque = Math.max(0, item.produto.estoque_qtd - item.quantidade);
          await supabase
            .from("produtos")
            .update({ estoque_qtd: novoEstoque })
            .eq("id", item.produto.id);
        }
      }

      // Persiste também no storage local para histórico rápido
      if (typeof window !== "undefined") {
        const historicoLocal = JSON.parse(localStorage.getItem("feiralocal_pedidos") || "[]");
        historicoLocal.unshift({
          id: finalPedidoId,
          comprador_id: params.compradorId,
          status: "pago",
          total: params.total,
          criado_em: new Date().toISOString(),
          metodo_pagamento: params.metodoPagamento,
          itens: params.itens.map((i) => ({
            produto_id: i.produto.id,
            quantidade: i.quantidade,
            preco_unitario: i.produto.preco,
            produto: i.produto,
          })),
        });
        localStorage.setItem("feiralocal_pedidos", JSON.stringify(historicoLocal));
      }

      return {
        sucesso: true,
        pedidoId: finalPedidoId,
        mensagem: "Pedido finalizado e pagamento aprovado com sucesso!",
      };
    } catch (err) {
      console.warn("Erro ao salvar pedido no Supabase, armazenando localmente:", err);

      // Fallback local garantido
      if (typeof window !== "undefined") {
        const historicoLocal = JSON.parse(localStorage.getItem("feiralocal_pedidos") || "[]");
        historicoLocal.unshift({
          id: pedidoId,
          comprador_id: params.compradorId,
          status: "pago",
          total: params.total,
          criado_em: new Date().toISOString(),
          metodo_pagamento: params.metodoPagamento,
          itens: params.itens.map((i) => ({
            produto_id: i.produto.id,
            quantidade: i.quantidade,
            preco_unitario: i.produto.preco,
            produto: i.produto,
          })),
        });
        localStorage.setItem("feiralocal_pedidos", JSON.stringify(historicoLocal));
      }

      return {
        sucesso: true,
        pedidoId: pedidoId,
        mensagem: "Pedido registrado com sucesso!",
      };
    }
  }

  /**
   * Busca histórico de compras do comprador
   */
  static async getPedidosByComprador(compradorId: string): Promise<Pedido[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("pedidos")
        .select(`
          *,
          itens:itens_pedido(
            *,
            produto:produtos(*)
          ),
          pagamento:pagamentos(*)
        `)
        .eq("comprador_id", compradorId)
        .order("criado_em", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Pedido[];
      }
    } catch (err) {
      console.warn("Aviso ao buscar pedidos no Supabase:", err);
    }

    // Fallback local
    if (typeof window !== "undefined") {
      const local = JSON.parse(localStorage.getItem("feiralocal_pedidos") || "[]");
      return local as Pedido[];
    }
    return [];
  }

  /**
   * Busca pedidos recebidos pelos produtos de um vendedor
   */
  static async getPedidosByVendedor(vendedorId: string): Promise<any[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("itens_pedido")
        .select(`
          *,
          pedido:pedidos(
            *,
            comprador:usuarios(nome, email, telefone)
          ),
          produto:produtos(*)
        `)
        .eq("produto.vendedor_id", vendedorId)
        .order("criado_em", { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn("Aviso ao buscar pedidos do vendedor:", err);
    }
    return [];
  }
}
