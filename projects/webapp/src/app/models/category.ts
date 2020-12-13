export interface Category {
  id?: string;
  name?: string;
  description?: string;
  type?: CategoryType;
  color?: string;
  active?: boolean;
}

export enum CategoryType {
  contribution = 'contribution',
  interestAndFee = 'interestAndFee',
  fineAndPenalty = 'fineAndPenalty',
  loan = 'loan',
  repayment = 'repayment',
  pot = 'pot'
}
