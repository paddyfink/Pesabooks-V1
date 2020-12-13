import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Const, Member } from '../models';
import { FirebaseService } from './firebase.service';

@Injectable()
export class MembersService extends FirebaseService {
  constructor(afAuth: AngularFireAuth, public afs: AngularFirestore) {
    super(afAuth, afs);
  }

  getMembers(groupId: string) {
    return this.col$<Member>(
      `${Const.GroupsCollection}/${groupId}/${Const.MembersCollection}`
    );
  }

  async create(groupId: string, member: Member): Promise<string> {
    const docRef = await this.add<Member>(
      `${Const.GroupsCollection}/${groupId}/${Const.MembersCollection}`,
      {
        ...member,
        fullName: `${member.firstName} ${member.lastName}`
      }
    );

    return docRef.id;
  }

  updateMember(
    groupId: string,
    memberId: string,
    member: Member
  ): Promise<void> {
    return this.update<Member>(
      `${Const.GroupsCollection}/${groupId}/${
        Const.MembersCollection
      }/${memberId}`,
      {
        ...member,
        fullName: `${member.firstName} ${member.lastName}`
      }
    );
  }
}
