// tslint:disable-next-line:no-implicit-dependencies
import { AggregationPerMonthPerMember, Transaction } from '@app/models';
import * as admin from 'firebase-admin';
import { Const } from '../consts';
import { aggregateTransactionstionByMonth } from './helpers/aggregateTransactionstionByMonth';

export const summarizeGroupTransactionsByMember = async (
  groupId: string,
  memberId: string,
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
    .where('memberId', '==', memberId)
    .get();

  const transactions = querySnapshot.docs.map(doc => doc.data() as Transaction);
  const transactionPerMonth = aggregateTransactionstionByMonth(
    transactions,
    dateMonth,
    dateYear
  );

  const transactionPerMonthPerMember: AggregationPerMonthPerMember = {
    ...transactionPerMonth,
    memberId: memberId
  };
  if (transactionPerMonthPerMember.transactionsCount === 0) {
    return admin
      .firestore()
      .collection(
        `${Const.GroupsCollection}/${groupId}/${
          Const.TransactionsPerMonthPerMemberCollection
        }`
      )
      .doc(`${memberId}_${monthKey}`)
      .delete();
  } else {
    return admin
      .firestore()
      .collection(
        `${Const.GroupsCollection}/${groupId}/${
          Const.TransactionsPerMonthPerMemberCollection
        }`
      )
      .doc(`${memberId}_${monthKey}`)
      .set(transactionPerMonthPerMember);
  }
};
