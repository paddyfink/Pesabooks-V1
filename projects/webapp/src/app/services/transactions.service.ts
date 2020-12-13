import { Injectable } from '@angular/core';
import { Query } from '@firebase/firestore-types';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Const, Transaction } from '../models';
import { FirebaseService } from './firebase.service';

@Injectable()
export class TransactionsService extends FirebaseService {
  constructor(afAuth: AngularFireAuth, public afs: AngularFirestore) {
    super(afAuth, afs);
  }

  getTransactions(groupId: string, filter: any) {
    return this.col$<Transaction>(
      `${Const.GroupsCollection}/${groupId}/${Const.TransactionsCollection}`,
      ref => {
        let query = ref as Query;
        let isFiltered = false;
        const { memberId, categoryId, direction, type, month } = filter;
        if (memberId) {
          query = query.where('memberId', '==', memberId);
          isFiltered = true;
        }
        if (categoryId) {
          query = query.where(`categories.${categoryId}`, '==', true);
          isFiltered = true;
        }
        if (direction) {
          query = query.where('direction', '==', direction);
          isFiltered = true;
        }
        if (type) {
          query = query.where('type', '==', type);
          isFiltered = true;
        }
        if (month) {
          query = query
            .where('dateMonth', '==', month.month)
            .where('dateYear', '==', month.year);
          isFiltered = true;
        }
        query = query.limit(100);
        if (!isFiltered) {
          query = query.orderBy('date', 'desc');
        }
        return query;
      }
    );
  }

  getLatestTransactions(groupId: string, limit = 10) {
    return this.col$<Transaction>(
      `${Const.GroupsCollection}/${groupId}/${Const.TransactionsCollection}`,
      query => query.limit(limit).orderBy('date', 'desc')
    );
  }

  getUnpaidLoans(groupId: string, limit = 10) {
    return this.col$<Transaction>(
      `${Const.GroupsCollection}/${groupId}/${Const.TransactionsCollection}`,
      query =>
        query
          .where('type', '==', 'loan')
          .where('status', '==', 'unpaid')
          .where('direction', '==', 'output')
    );
  }

  async create(groupId: string, transaction: Transaction): Promise<string> {
    const docRef = await this.add<Transaction>(
      `${Const.GroupsCollection}/${groupId}/${Const.TransactionsCollection}`,
      {
        ...transaction,
        dateMonth: transaction.date.getUTCMonth() + 1,
        dateYear: transaction.date.getUTCFullYear()
      }
    );
    return docRef.id;
  }

  async deleteTransaction(groupId: string, id: string) {
    await this.delete(
      `${Const.GroupsCollection}/${groupId}/${
        Const.TransactionsCollection
      }/${id}`
    );
  }

  async updateTransaction(
    groupId: string,
    id: string,
    transaction: Transaction
  ) {
    if (transaction.date) {
      transaction.dateMonth = transaction.date.getUTCMonth() + 1;
      transaction.dateYear = transaction.date.getUTCFullYear();
    }
    await super.update(
      `${Const.GroupsCollection}/${groupId}/${
        Const.TransactionsCollection
      }/${id}`,
      transaction
    );
  }
}
