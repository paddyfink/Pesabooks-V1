import { DocRef } from './docRef';

export interface Doc {
  id?: string;
  createdAt?: Date | any;
  createdBy?: DocRef;
  modifiedAt?: Date | any;
  modifiedBy?: DocRef;
}
