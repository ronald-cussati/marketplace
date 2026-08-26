export interface PaymentRequest {
  pedidoId: string;
  valor: number;
  metodo: "pix" | "cartao" | "dinheiro" | "mock";
  dadosCartao?: {
    numero: string;
    titular: string;
    validade: string;
    cvv: string;
  };
}

export interface PaymentResponse {
  sucesso: boolean;
  transacaoId: string;
  metodo: string;
  status: "aprovado" | "recusado";
  mensagem: string;
  horario: string;
  codigoAutenticacao: string;
}

export class MockPaymentService {
  /**
   * Processa pagamento simulado com resposta estruturada
   */
  static async processar(req: PaymentRequest): Promise<PaymentResponse> {
    // Simula latência realista de rede do gateway de pagamento
    await new Promise((resolve) => setTimeout(resolve, 600));

    const transacaoId = `MOCK-TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const codigoAutenticacao = `AUTH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return {
      sucesso: true,
      transacaoId,
      metodo: req.metodo,
      status: "aprovado",
      mensagem: "✅ Pagamento aprovado com sucesso pelo Gateway Simulado!",
      horario: new Date().toISOString(),
      codigoAutenticacao,
    };
  }

  /**
   * Gera chave Pix simulada para cópia e QR code
   */
  static gerarPixPayload(pedidoId: string, valor: number): { chave: string; qrCodeUrl: string } {
    const payload = `00020101021226580014br.gov.bcb.pix0136feiralocal-mock-chave-pix-${pedidoId}520400005303986540${valor.toFixed(2)}5802BR5910FEIRALOCAL6007VITORIA62070503***6304MOCK`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(payload)}`;
    return { chave: payload, qrCodeUrl };
  }
}
