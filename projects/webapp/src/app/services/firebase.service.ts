import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryFn
} from '@angular/fire/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

export class FirebaseService {
  userId: any;
  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore) {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.userId = auth.uid;
      }
    });
  }

  /// **************
  /// Get a Reference
  /// **************
  protected col<T>(
    ref: CollectionPredicate<T>,
    queryFn?
  ): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  protected doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  /// **************
  /// Get Data
  /// **************
  protected doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const data = doc.payload.data() as any;
          const id = doc.payload.id;
          if (data) {
            return {
              id,
              ...data
            };
          } else {
            return null;
          }
        })
      );
  }

  protected col$<T>(
    ref: CollectionPredicate<T>,
    queryFn?: QueryFn
  ): Observable<T[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return {
              id,
              ...data
            };
          });
        })
      );
  }

  /// **************
  /// Write Data
  /// **************
  /// Firebase Server Timestamp
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  protected set<T>(ref: DocPredicate<T>, data: any) {
    return this.doc(ref).set({
      ...data,
      createdAt: this.timestamp,
      createdById: this.userId,
      modifiedAt: this.timestamp,
      modifiedById: this.userId
    });
  }

  protected update<T>(ref: DocPredicate<T>, data: any) {
    return this.doc(ref).update({
      ...data,
      modifiedAt: this.timestamp,
      modifiedById: this.userId
    });
  }

  protected delete<T>(ref: DocPredicate<T>) {
    return this.doc(ref).delete();
  }

  protected add<T>(
    ref: CollectionPredicate<T>,
    data
  ): Promise<DocumentReference> {
    const timestamp = this.timestamp;
    return this.col(ref).add({
      ...data,
      createdAt: this.timestamp,
      createdById: this.userId,
      modifiedAt: this.timestamp,
      modifiedById: this.userId
    });
  }
}
