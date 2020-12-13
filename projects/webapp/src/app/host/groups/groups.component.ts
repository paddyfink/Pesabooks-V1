import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Group } from '@app/models';
import { GroupsService, UsersService } from '@app/services';
import { BaseComponent } from '@app/shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent extends BaseComponent implements OnInit {
  groups$: Observable<Group[]>;

  constructor(
    public dialog: MatDialog,
    private groupsService: GroupsService,
    private usersService: UsersService
  ) {
    super();
  }

  ngOnInit() {
    this.groups$ = this.groupsService.getAllGroups();
  }

  createGroup() {
    // this.dialog.open(GroupCreateComponent);
  }

  selectGroup(id: string) {
    this.usersService.changeUserCurrentGroup(this.currentUser.id, id);
  }
}
