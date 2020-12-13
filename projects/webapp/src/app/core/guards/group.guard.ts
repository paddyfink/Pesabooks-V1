import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { User } from '@app/models';
import { AuthService } from '@app/services';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GroupCreateDialogComponent } from '../../shared/group-create/group-create.component';

@Injectable()
export class GroupGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.currentuser.pipe(
      // map((user: User) => !isEmpty(user.groups)),
      map((user: User) => !!user.lastGroupId),
      tap(hasGroups => {
        if (!hasGroups) {
          const ref = this.dialog.open(GroupCreateDialogComponent, {
            hasBackdrop: true,
            minWidth: '300px',
            data: { canClose: false }
          });

          ref.afterClosed().subscribe(() => {
            this.router.navigate(['/']);
          });
        }
      })
    );
  }
}
