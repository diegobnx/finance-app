export interface Conta {
  _id: string;
  descricao: string;
  valor: number;
  vencimento: string; // ISO date string
  recorrente: boolean;
  inicio_periodo?: string; // 'YYYY-MM'
  fim_periodo?: string;
  status: "pendente" | "paga" | "vencida";
  dia_vencimento?: number; // <-- novo campo opcional para contas recorrentes
}

export interface ContaCreate extends Omit<Conta, "_id"> {}
