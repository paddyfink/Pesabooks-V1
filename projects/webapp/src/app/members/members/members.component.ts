import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Member } from '@app/models';
import { MembersService, NavigationService } from '@app/services';
import { BaseComponent, CreateMemberDialogComponent } from '@app/shared';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent extends BaseComponent implements OnInit {
  members$: Observable<Member[]>;

  constructor(
    private membersService: MembersService,
    private navigationService: NavigationService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.navigationService.setPageTitle('app.common.members');
    this.members$ = this.currentGroup$.pipe(
      switchMap(group => this.membersService.getMembers(group.id))
    );
  }

  openMemberDialog(member) {
    this.dialog.open(CreateMemberDialogComponent, {
      data: { member: member }
    });
  }
}
