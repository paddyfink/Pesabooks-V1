import { OnDestroy } from '@angular/core';
import { Group, User } from '@app/models';
import { AuthService, ServiceLocator } from '@app/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

export class BaseComponent implements OnDestroy {
  currentUser$ = new ReplaySubject<User>(1);
  currentGroup$ = new ReplaySubject<Group>(1);
  currentGroup: Group;
  currentUser: User;
  ngUnsubscribe = new Subject();
  isAdmin: boolean;

  constructor() {
    const authService = ServiceLocator.injector.get(AuthService);
    const permissionsService = ServiceLocator.injector.get(
      NgxPermissionsService
    );

    authService.currentuser
      .pipe(
        tap(user => {
          this.currentUser$.next(user);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(user => {
        this.currentUser = user;
      });

    authService.currentGroup
      .pipe(
        filter(
          group => !this.currentGroup || group.id !== this.currentGroup.id
        ),
        tap(group => {
          this.currentGroup$.next(group);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(group => {
        this.currentGroup = group;
      });

    permissionsService.permissions$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        permissionsService.hasPermission('admin').then(permission => {
          this.isAdmin = permission;
        });
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
