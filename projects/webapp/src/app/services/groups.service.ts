import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngxs/store';
import * as _ from 'lodash';
import { set } from 'lodash';
import { Observable } from 'rxjs';
import { Const, Group, User } from '../models';
import { FirebaseService } from './firebase.service';

@Injectable()
export class GroupsService extends FirebaseService {
  constructor(
    afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public store: Store,
    private fb: FirebaseApp
  ) {
    super(afAuth, afs);
  }

  getAllGroups(): Observable<Group[]> {
    return this.col$<Group>(Const.GroupsCollection);
  }

  getGroups(): Observable<Group[]> {
    return this.col$<Group>(Const.GroupsCollection, q =>
      q.where(`users.${this.userId}.isMember`, '==', true)
    );
  }

  getGroup(groupId: string): Observable<Group> {
    return this.doc$<Group>(`${Const.GroupsCollection}/${groupId}`);
  }

  updateGroup(groupId: string, group: Group): Promise<void> {
    return this.update<Group>(`${Const.GroupsCollection}/${groupId}`, group);
  }

  async createGroup(user: User, group: Group): Promise<any> {
    let groupOwnedCount = 0;

    for (const groupId in user.groups) {
      if (user.groups.hasOwnProperty(groupId)) {
        const groupUserRelation = user.groups[groupId];
        if (groupUserRelation.isOwner) {
          groupOwnedCount++;
        }
      }
    }

    if (groupOwnedCount >= 5) {
      throw new Error(
        'The number of group is limited to 5 per user. Is you need more, contact us'
      );
    }

    const newGroupDocRef = await this.add<Group>(Const.GroupsCollection, {
      ...group
    });

    await this.AddUserToGroup(newGroupDocRef.id, user.id, 'admin', true);
  }

  async AddUserToGroup(
    groupId: string,
    userId: string,
    role,
    isOwner = false
  ): Promise<void> {
    const userRef = this.afs.firestore
      .collection(Const.UsersCollection)
      .doc(userId);

    const groupRef = this.afs.firestore
      .collection(Const.GroupsCollection)
      .doc(groupId);

    await this.afs.firestore.runTransaction(async transaction => {
      const user = (await transaction.get(userRef)).data() as User;
      const group = (await transaction.get(groupRef)).data() as Group;

      const userGroupRole = {
        isMember: true,
        isOwner: isOwner,
        role: role
      };

      set(user, ['groups', groupId], userGroupRole);
      transaction.update(userRef, user);

      set(group, ['users', userId], userGroupRole);
      transaction.update(groupRef, group);
    });

    return this.update<User>(`${Const.UsersCollection}/${userId}`, <User>{
      lastGroupId: groupId
    });
  }

  removeUserFromGroup(userId, groupId): Promise<void> {
    const userRef = this.afs.firestore
      .collection(Const.UsersCollection)
      .doc(userId);

    const groupRef = this.afs.firestore
      .collection(Const.GroupsCollection)
      .doc(groupId);

    return this.afs.firestore.runTransaction(async transaction => {
      const user = (await transaction.get(userRef)).data() as User;
      const group = (await transaction.get(groupRef)).data() as Group;

      const newUserGroups = _.omit(user.groups, groupId);
      if (user.lastGroupId === groupId) {
        user.lastGroupId = null;
      }
      transaction.update(userRef, { ...user, groups: newUserGroups });

      const newGroupUsers = _.omit(group.users, userId);
      transaction.update(groupRef, { ...group, users: newGroupUsers });
    });
  }
}
