import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import {
  AggregationPerMonth,
  AggregationPerMonthPerMember,
  Const
} from '@app/models';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AggregationService extends FirebaseService {
  constructor(
    afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public store: Store
  ) {
    super(afAuth, afs);
  }

  getTransactionsPerMonth(groupId): Observable<AggregationPerMonth[]> {
    return this.col$<AggregationPerMonth>(
      `${Const.GroupsCollection}/${groupId}/${
        Const.TransactionsPerMonthCollection
      }`
    );
  }

  getTransactionsPerMonthPerMember(
    groupId,
    queryFn: QueryFn = null
  ): Observable<AggregationPerMonthPerMember[]> {
    return this.col$<AggregationPerMonthPerMember>(
      `${Const.GroupsCollection}/${groupId}/${
        Const.TransactionsPerMonthPerMemberCollection
      }`,
      queryFn
    );
  }
}
