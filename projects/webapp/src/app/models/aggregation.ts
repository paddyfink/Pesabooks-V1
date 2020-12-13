export interface Aggregation {
  id?: string;
  input: {
    total: number;
    perCategory?: {};
    payment: {
      total: number;
      perCategory: object;
    };
    loan: {
      total: number;
      perCategory: object;
      perStatus: object;
    };
  };
  output: {
    total: number;
    perCategory?: {};
    payment: {
      total: number;
      perCategory: object;
    };
    loan: {
      total: number;
      perStatus: object;
      perCategory: object;
    };
  };
  transactionsCount: number;
}

export interface AggregationPerMonth extends Aggregation {
  dateMonth: number;
  dateYear: number;
}

export interface AggregationPerMonthPerMember extends AggregationPerMonth {
  memberId: string;
}
