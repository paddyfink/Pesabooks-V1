import { Aggregation } from './aggregation';
import { Base } from './base';

export interface Member extends Base {
  id?: string;
  firstName?: string;
  lastName?: string;
  readonly fullName?: string;
  email?: string;
  phone?: string;
  userId?: string;
  aggregation: Aggregation;
}
