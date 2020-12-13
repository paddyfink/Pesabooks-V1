import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Const, User } from '../models';
import { FirebaseService } from './firebase.service';

@Injectable()
export class UsersService extends FirebaseService {
  constructor(afAuth: AngularFireAuth, public afs: AngularFirestore) {
    super(afAuth, afs);
  }

  getUserById(userId: string): Observable<User> {
    return this.doc$<User>(`${Const.UsersCollection}/${userId}`);
  }

  getUsers(groupId: string): Observable<User[]> {
    return this.col$<User>(Const.UsersCollection, ref =>
      ref.where(`groups.${groupId}.isMember`, '==', true)
    );
  }

  changeUserCurrentGroup(userId, groupId): Promise<void> {
    return this.update<User>(`${Const.UsersCollection}/${userId}`, <User>{
      lastGroupId: groupId
    });
  }

  createUser(userId: string, user: User): Promise<any> {
    return this.set<User>(`${Const.UsersCollection}/${userId}`, user);
  }
}
