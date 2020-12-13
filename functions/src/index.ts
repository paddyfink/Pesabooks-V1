// tslint:disable-next-line:no-implicit-dependencies
import * as admin from 'firebase-admin';

admin.initializeApp();
const settings = { timestampsInSnapshots: true };
admin.firestore().settings(settings);

export { sendInvitation } from './emails/sendInvitation';
export { transactionsOnWrite } from './transactions.onWrite.function';
export {
  transactionsPerMonthOnWrite
} from './transactionsPerMonth.onwrite.function';
export {
  transactionsPerMonthPerMemberOnWrite
} from './transactionsPerMonthPerMember.onwrite.function';
