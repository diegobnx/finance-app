export interface Conta {
  id: string;               // identificador principal usado no frontend
  _id?: string;             // opcional — caso o backend devolva _id em vez de id
  descricao: string;
  valor: number;
  vencimento?: string; // ISO date string — ausente em contas recorrentes
  recorrente: boolean;
  inicio_periodo?: string; // 'YYYY-MM'
  fim_periodo?: string;
  status: "pendente" | "pago" | "vencida";  // "paga" removido para padronizar
  dia_vencimento?: number;
  numero_parcela?: number;
  total_parcelas?: number;
  quantidade_parcelas?: number;
}

export interface ContaCreate extends Omit<Conta, "id" | "_id"> {}
