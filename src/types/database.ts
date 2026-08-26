export type TipoUsuario = 'comprador' | 'vendedor' | 'ambos';
export type StatusPedido = 'pendente' | 'pago' | 'cancelado';
export type StatusPagamento = 'aprovado' | 'recusado';
export type MetodoPagamento = 'pix' | 'cartao' | 'dinheiro' | 'mock';

export interface Usuario {
  id: string;
  nome: string;
  tipo: TipoUsuario;
  telefone?: string | null;
  criado_em?: string;
  email?: string;
}

export interface Vendedor {
  id: string;
  usuario_id: string;
  nome_loja: string;
  descricao?: string | null;
  cidade?: string | null;
  criado_em?: string;
  usuario?: Usuario;
}

export interface Produto {
  id: string;
  vendedor_id: string;
  nome: string;
  descricao?: string | null;
  preco: number;
  categoria?: string | null;
  estoque_qtd: number;
  imagem_url?: string | null;
  ativo: boolean;
  criado_em?: string;
  vendedor?: Vendedor;
}

export interface ItemPedido {
  id: string;
  pedido_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  produto?: Produto;
}

export interface Pagamento {
  id: string;
  pedido_id: string;
  status: StatusPagamento;
  metodo: string;
  criado_em?: string;
}

export interface Pedido {
  id: string;
  comprador_id: string;
  status: StatusPedido;
  total: number;
  criado_em?: string;
  itens?: ItemPedido[];
  pagamento?: Pagamento;
  comprador?: Usuario;
}

export interface CartItem {
  produto: Produto;
  quantidade: number;
}
