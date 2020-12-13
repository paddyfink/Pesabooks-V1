import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category, Const } from '../models';
import { FirebaseService } from './firebase.service';

@Injectable()
export class CategoriesService extends FirebaseService {
  constructor(afAuth: AngularFireAuth, public afs: AngularFirestore) {
    super(afAuth, afs);
  }

  getCategories(groupId: string): Observable<Category[]> {
    return this.col$<Category>(
      `${Const.GroupsCollection}/${groupId}/${Const.CategoriesCollection}`
    );
  }

  async create(groupId: string, category: Category): Promise<string> {
    const ref = await this.add<Category>(
      `${Const.GroupsCollection}/${groupId}/${Const.CategoriesCollection}`,
      { ...category }
    );

    return ref.id;
  }

  async updateCategory(
    groupId: string,
    cateoryId: string,
    category: Category
  ): Promise<any> {
    return await this.update<Category>(
      `${Const.GroupsCollection}/${groupId}/${
        Const.CategoriesCollection
      }/${cateoryId}`,
      category
    );
  }
}
