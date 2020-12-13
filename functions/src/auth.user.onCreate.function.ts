import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Const } from './utils/consts';

export const CreateUser = functions.auth.user().onCreate(user => {
  return admin
    .firestore()
    .collection(Const.UsersCollection)
    .doc(user.uid)
    .set({
      fullName: user.displayName,
      pictureUrl: user.photoURL,
      email: user.email
    })
    .then(() => {
      console.log('create user : ' + user.email);
    });
});
