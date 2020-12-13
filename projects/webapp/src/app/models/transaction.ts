export interface Transaction {
  id?: string;
  type?: 'payment' | 'loan' | 'memo';
  direction?: 'input' | 'output';
  memberId?: string;
  memberFullName?: string;
  date?: any;
  dueDate?: any;
  status?: 'closed' | 'unpaid' | 'paid';
  categories?: { [catgoryId: string]: boolean };
  lines?: TransactionLine[];
  total?: number;
  dateMonth?: number;
  dateYear?: number;
  interest?: number;
  interestType?: string;
}

export interface TransactionLine {
  categoryId?: string;
  categoryName?: string;
  amount?: number;
  description?: string;
}

export interface Template extends Transaction {
  name?: string;
  isTemplate: true;
}
