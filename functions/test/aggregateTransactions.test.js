// tslint:disable-next-line:no-implicit-dependencies
const test = require('firebase-functions-test')(
  {
    databaseURL: 'https://pesabooks-staging.firebaseio.com',
    storageBucket: 'pesabooks-staging.appspot.com',
    projectId: 'pesabooks-staging'
  },
  './serviceAccountKey.json'
);

const myFunctions = require('../lib/functions/src/index.js');

// Make snapshot for state of database beforehand
const beforeSnap = test.firestore.makeDocumentSnapshot(
  {
    total: 300,
    date: new Date(),
    dateMonth: 3,
    dateYear: 2018,
    direction: 'input',
    type: 'payment',
    memberId: '2kNXa7HhH8Vpcca0Llep'
  },
  'groups/qFM0WLnEt1xXsRbe1U0U/transactions/qu0ABvX6jJp386LwsbKb'
);
// Make snapshot for state of database after the change
const afterSnap = test.firestore.makeDocumentSnapshot(
  {
    total: 300,
    date: new Date(),
    dateMonth: 2,
    dateYear: 2018,
    direction: 'input',
    type: 'payment',
    memberId: '2kNXa7HhH8Vpcca0Llep'
  },
  'groups/qFM0WLnEt1xXsRbe1U0U/transactions/qu0ABvX6jJp386LwsbKb'
);
const change = test.makeChange(beforeSnap, afterSnap);

const wrappedAggTrans = test.wrap(myFunctions.transactionsOnWrite);

wrappedAggTrans(change, {
  params: {
    groupId: 'qFM0WLnEt1xXsRbe1U0U',
    transactionId: 'qu0ABvX6jJp386LwsbKb'
  }
}).then(() => {
  return '';
});

// const wrappedAggTransPerMont = test.wrap(
//   myFunctions.aggregateTransactionsPerMember
// );

// wrappedAggTransPerMont(change, {
//   params: {
//     groupId: 'qFM0WLnEt1xXsRbe1U0U',
//     transactionId: 'qu0ABvX6jJp386LwsbKb'
//   }
// }).then(() => {
//   return '';
// });
