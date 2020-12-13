import { Selector, State } from '@ngxs/store';

export interface TransactionStateModel {
  filter?: {
    model: {
      memberId: string;
      categoryId: string;
      direction: string;
      type: string;
      month: any;
    };
  };
}

@State<TransactionStateModel>({
  name: 'transactions',
  defaults: {
    filter: {
      model: {
        memberId: '',
        categoryId: '',
        direction: '',
        type: '',
        month: null
      }
    }
  }
})
export class TransactionState {
  @Selector()
  static getFilter(state: TransactionStateModel) {
    return state.filter.model;
  }

  @Selector()
  static isFiltered(state: TransactionStateModel) {
    return (
      state.filter.model.memberId ||
      state.filter.model.categoryId ||
      state.filter.model.direction ||
      state.filter.model.type ||
      state.filter.model.month
    );
  }
}
