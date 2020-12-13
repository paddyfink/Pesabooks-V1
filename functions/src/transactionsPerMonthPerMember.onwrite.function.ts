// tslint:disable-next-line:no-implicit-dependencies
import { Aggregation, AggregationPerMonthPerMember } from '@app/models';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Const } from './utils/consts';

export const transactionsPerMonthPerMemberOnWrite = functions.firestore
  .document(
    `${Const.GroupsCollection}/{groupId}/${
      Const.TransactionsPerMonthPerMemberCollection
    }/{id}`
  )
  .onWrite((change, context) => {
    const groupId = context.params.groupId;

    let data = (change.after.exists
      ? change.after.data()
      : null) as AggregationPerMonthPerMember;

    if (!data) {
      data = change.before.data() as AggregationPerMonthPerMember;
    }

    // ref to member document
    const memberRef = admin
      .firestore()
      .collection(
        `${Const.GroupsCollection}/${groupId}/${Const.MembersCollection}`
      )
      .doc(data.memberId);

    // get all responses and aggregate
    return admin
      .firestore()
      .collection(
        `${Const.GroupsCollection}/${groupId}/${
          Const.TransactionsPerMonthPerMemberCollection
        }`
      )
      .where('memberId', '==', data.memberId)
      .get()
      .then(querySnapshot => {
        // get the total comment count
        //  const dataCount = querySnapshot.size;
        const transactionsPerMonths = querySnapshot.docs.map(
          doc => doc.data() as AggregationPerMonthPerMember
        );

        // tslint:disable-next-line:prefer-const
        let aggregation = <Aggregation>{
          input: {
            total: 0,
            perCategory: {}
          },
          output: {
            total: 0,
            perCategory: {}
          },
          transactionsCount: 0
        };

        for (const transactionsPerMonth of transactionsPerMonths) {
          aggregation.transactionsCount =
            aggregation.transactionsCount +
            transactionsPerMonth.transactionsCount;
          aggregation.input.total =
            aggregation.input.total + transactionsPerMonth.input.total;
          aggregation.output.total =
            aggregation.output.total + transactionsPerMonth.output.total;

          for (const inputCatId in transactionsPerMonth.input.perCategory) {
            const categoryValue =
              aggregation.input.perCategory[inputCatId] || 0;

            aggregation.input.perCategory[inputCatId] =
              categoryValue +
              transactionsPerMonth.input.perCategory[inputCatId];
          }

          for (const outputCatId in transactionsPerMonth.output.perCategory) {
            const categoryValue =
              aggregation.output.perCategory[outputCatId] || 0;

            aggregation.output.perCategory[outputCatId] =
              categoryValue +
              transactionsPerMonth.output.perCategory[outputCatId];
          }
        }
        // run update
        return memberRef.update({ aggregation });
      })
      .catch(err => console.log(err));
  });
