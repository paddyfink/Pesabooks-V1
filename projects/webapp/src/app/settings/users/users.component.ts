import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Group, Invitation, statusInvitation, User } from '@app/models';
import { GroupsService, InvitationsService, UsersService } from '@app/services';
import { BaseComponent } from '@app/shared';
import { TdDialogService } from '@covalent/core';
import { combineLatest } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { InviteUserDialogComponent } from './invite-user-dialog/invite-user-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent implements OnInit {
  usersDisplayedColumns = ['fullName', 'email', 'roles', 'actions'];
  invitationsDisplayedColumns = ['email', 'role', 'status', 'actions'];
  usersDataSource: MatTableDataSource<User>;
  invitationsDataSource: MatTableDataSource<Invitation>;
  currentGroup: Group;

  constructor(
    private usersService: UsersService,
    private invitationService: InvitationsService,
    public dialog: MatDialog,
    private dialogService: TdDialogService,
    private groupsService: GroupsService
  ) {
    super();
  }

  ngOnInit() {
    this.currentGroup$
      .pipe(
        switchMap(group =>
          combineLatest(
            this.usersService.getUsers(group.id),
            this.invitationService.getActiveInvitations(group.id)
          )
        ),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(([users, invitations]) => {
        const formattedUsers = users.map(user => {
          return {
            ...user,
            role: user.groups[this.currentGroup.id].role
          };
        });
        this.usersDataSource = new MatTableDataSource(formattedUsers);

        this.invitationsDataSource = new MatTableDataSource(invitations);
      });
  }

  openInviteUserDialog(): void {
    const dialogRef = this.dialog.open(InviteUserDialogComponent, {
      width: '300px'
    });
  }

  deleteUser(user: User) {
    this.dialogService
      .openConfirm({
        message: `Are you sure you want to remove ${user.fullName} from ${
          this.currentGroup.name
        }?`,
        title: 'Confirm',
        cancelButton: 'Cancel',
        acceptButton: 'Remove'
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          this.groupsService.removeUserFromGroup(user.id, this.currentGroup.id);
        }
      });
  }

  revokeInvitation(inviation: Invitation) {
    this.dialogService
      .openConfirm({
        message: 'Are you sure you want to revoke the invitation?',
        title: 'Confirm',
        cancelButton: 'Cancel',
        acceptButton: 'Revoke'
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          this.invitationService.deactivateInvitation(
            inviation.id,
            statusInvitation.revoked
          );
        }
      });
  }

  sendInvitation(invitation) {
    this.dialogService
      .openConfirm({
        message: 'Are you sure you want to resend the invitation?',
        title: 'Confirm',
        cancelButton: 'Cancel',
        acceptButton: 'Resend'
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          this.invitationService.sendInvitation(invitation);
        }
      });
  }
}
