import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import * as Raven from 'raven-js';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Const, Group, User } from '../models';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthService extends FirebaseService {
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    super(afAuth, afs);
  }

  public get isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => user !== null));
  }

  async signInWithFacebook() {
    const credential = await this.afAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );

    if (credential.additionalUserInfo.isNewUser) {
      await this.createUserProfile(
        credential.user.uid,
        credential.user.email,
        credential.user.displayName,
        credential.user.photoURL
      );
    }
  }

  async signInWithGoogle() {
    const credential = await this.afAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );

    if (credential.additionalUserInfo.isNewUser) {
      await this.createUserProfile(
        credential.user.uid,
        credential.user.email,
        credential.user.displayName,
        credential.user.photoURL
      );
    }
  }

  async signIn(email: string, password: string, persistance = 'session') {
    await this.afAuth.auth.setPersistence(persistance);
    await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async logOut(redirect = true) {
    if (redirect) {
      this.router.navigate(['/auth']);
      //window.location.href = window.location.origin;
    }
    await this.afAuth.auth.signOut();
    Raven.setUserContext();
    $crisp.push(['do', 'session:reset']);
  }

  get currentuser(): Observable<User> {
    return this.afAuth.authState.pipe(
      filter(user => !!user),
      switchMap(user => {
        return this.getUser(user.uid);
      })
    );
  }

  get currentGroup(): Observable<Group> {
    return this.currentuser.pipe(
      filter(
        user => !!user.lastGroupId //&& user.lastGroupId !== this.currentGroupId
      ),
      switchMap(user => {
        return this.doc$<Group>(
          `${Const.GroupsCollection}/${user.lastGroupId}`
        );
      })
    );
  }

  async register(
    fistName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void> {
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    await this.createUserProfile(
      credential.user.uid,
      credential.user.email,
      `${fistName} ${lastName}`,
      null
    );
  }

  createUserProfile(id, email, displayName, pictureUrl): Promise<any> {
    return this.set<User>(`${Const.UsersCollection}/${id}`, <User>{
      email: email,
      fullName: displayName,
      pictureUrl: pictureUrl
    });
  }

  getUser(userId: string): Observable<User> {
    return this.doc$<User>(`${Const.UsersCollection}/${userId}`);
  }
}
