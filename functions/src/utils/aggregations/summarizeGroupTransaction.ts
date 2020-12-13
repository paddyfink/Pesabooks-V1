// tslint:disable-next-line:no-implicit-dependencies
import { Transaction } from '@app/models';
import * as admin from 'firebase-admin';
import { Const } from '../consts';
import { aggregateTransactionstionByMonth } from './helpers/aggregateTransactionstionByMonth';

export const summarizeGroupTransactions = async (
  groupId: string,
  dateMonth: number,
  dateYear: number
): Promise<any> => {
  const monthKey = `${dateMonth}${dateYear}`;
  const querySnapshot = await admin
    .firestore()
    .collection(
      `${Const.GroupsCollection}/${groupId}/${Const.TransactionsCollection}`
    )
    .where('dateMonth', '==', dateMonth)
    .where('dateYear', '==', dateYear)
    .get();

  const transactions = querySnapshot.docs.map(doc => doc.data() as Transaction);
  const transactionPerMonth = aggregateTransactionstionByMonth(
    transactions,
    dateMonth,
    dateYear
  );

  // console.log(transactionPerMonth);

  if (transactionPerMonth.transactionsCount === 0) {
    return admin
      .firestore()
      .collection(
        `${Const.GroupsCollection}/${groupId}/${
          Const.TransactionsPerMonthCollection
        }`
      )
      .doc(monthKey)
      .delete();
  } else {
    return admin
      .firestore()
      .collection(
        `${Const.GroupsCollection}/${groupId}/${
          Const.TransactionsPerMonthCollection
        }`
      )
      .doc(monthKey)
      .set(transactionPerMonth);
  }
};
