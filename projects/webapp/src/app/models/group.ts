import { Aggregation } from './aggregation';
import { Category } from './category';
import { Member } from './member';
import { RoleEnum } from './role';
import { Transaction } from './transaction';

export interface Group {
  id?: string;
  name?: string;
  description?: string;
  startDate: any;
  openingBalance: number;
  currency?: string;
  users?: {
    [userId: string]: {
      isMember: boolean;
      isOwner: boolean;
      role: RoleEnum;
    };
  };
  transactions?: Transaction[];
  members?: Member[];
  categories?: Category[];
  aggregation?: Aggregation;
}
