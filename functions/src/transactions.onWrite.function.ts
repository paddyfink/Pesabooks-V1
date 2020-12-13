// tslint:disable-next-line:no-implicit-dependencies
import { Transaction } from '@app/models';
import * as functions from 'firebase-functions';
import {
  summarizeGroupTransactions,
  summarizeGroupTransactionsByMember
} from './utils';
import { Const } from './utils/consts';

export const transactionsOnWrite = functions.firestore
  .document(
    `${Const.GroupsCollection}/{groupId}/${
      Const.TransactionsCollection
    }/{transactionId}`
  )
  .onWrite((change, context) => {
    const groupId = context.params.groupId;
    const promises = [];
    // // Get an object with the current document value.
    // // If the document does not exist, it has been deleted.

    const transaction = (change.after.exists
      ? change.after.data()
      : null) as Transaction;

    // Get an object with the previous document value (for update or delete)
    const oldTransaction = change.before.data() as Transaction;

    if (transaction) {
      promises.push(
        summarizeGroupTransactions(
          groupId,
          transaction.dateMonth,
          transaction.dateYear
        )
      );

      promises.push(
        summarizeGroupTransactionsByMember(
          groupId,
          transaction.memberId,
          transaction.dateMonth,
          transaction.dateYear
        )
      );
    }

    if (
      !transaction ||
      (oldTransaction &&
        (oldTransaction.dateMonth !== transaction.dateMonth ||
          oldTransaction.dateYear !== transaction.dateYear))
    ) {
      promises.push(
        summarizeGroupTransactions(
          groupId,
          oldTransaction.dateMonth,
          oldTransaction.dateYear
        )
      );
    }

    if (
      !transaction ||
      (oldTransaction && oldTransaction.memberId !== transaction.memberId)
    ) {
      promises.push(
        summarizeGroupTransactionsByMember(
          groupId,
          oldTransaction.memberId,
          oldTransaction.dateMonth,
          oldTransaction.dateYear
        )
      );
    }

    return Promise.all(promises).catch(error => console.log(error));
  });
