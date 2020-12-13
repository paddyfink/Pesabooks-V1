import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Const, Invitation, statusInvitation } from '@app/models';
import { Store } from '@ngxs/store';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService extends FirebaseService {
  constructor(
    afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public store: Store
  ) {
    super(afAuth, afs);
  }

  getInvitation(invitationId: string): Observable<Invitation> {
    return this.doc$<Invitation>(
      `${Const.InvitationsCollection}/${invitationId}`
    );
  }

  deactivateInvitation(invitationId: string, status: statusInvitation) {
    this.update(`${Const.InvitationsCollection}/${invitationId}`, <Invitation>{
      active: false,
      status: status
    });
  }

  getActiveInvitations(groupId: string): Observable<Invitation[]> {
    if (!groupId) {
      throw new Error('Must provide a group');
    }

    return this.col$<Invitation>(`${Const.InvitationsCollection}`, ref =>
      ref.where('groupId', '==', groupId).where('active', '==', true)
    );
  }

  async createInvitation(invitation: Invitation): Promise<Invitation> {
    if (!invitation.groupId) {
      throw new Error('Must provide a group');
    }

    const docRef = await this.add(`${Const.InvitationsCollection}`, {
      ...invitation,
      active: true
    });

    return <Invitation>{
      id: docRef.id,
      ...invitation
    };
  }

  sendInvitation(invitation: Invitation) {
    this.doc$(`${Const.GroupsCollection}/${invitation.groupId}`).subscribe(
      async group => {
        const sendInvitationFn = firebase
          .functions()
          .httpsCallable('sendInvitation');
        await sendInvitationFn({ group, invitation });
      }
    );
  }
}
