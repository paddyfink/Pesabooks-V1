import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Group, User } from '@app/models';
import { AuthService, GroupsService, UsersService } from '@app/services';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';
import { GroupCreateDialogComponent } from '../group-create/group-create.component';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent extends BaseComponent implements OnInit {
  user: User;
  showGroupsList = false;
  public groups$: Observable<Group[]>;

  constructor(
    private authService: AuthService,
    private groupService: GroupsService,
    private usersService: UsersService,
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.groups$ = this.groupService.getGroups();
    this.currentUser$.pipe(takeUntil(this.ngUnsubscribe)).subscribe();
  }

  logout() {
    this.authService.logOut();
  }

  changeGroup(group: Group) {
    this.usersService.changeUserCurrentGroup(this.currentUser.id, group.id);
  }

  openCreateGroupDialog() {
    this.dialog.open(GroupCreateDialogComponent, {
      data: { canClose: true }
    });
  }
}
