import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Invitation, statusInvitation, User } from '@app/models';
import { AuthService, GroupsService, InvitationsService } from '@app/services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {
  currentUser: User;
  invitation: Invitation;
  isInvitationCodeInvalid: boolean;
  errorMessage = 'The invite link you followed is not valid.';
  next: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupsService,
    private invitationsService: InvitationsService
  ) {}

  ngOnInit() {
    this.authService.currentuser.pipe(first()).subscribe(user => {
      this.currentUser = user;
      this.processInvitation();
    });

    this.route.queryParams.subscribe(async params => {
      const invitationCode = params['code'];

      if (invitationCode) {
        this.checkInvitationCode(invitationCode);
      } else {
        this.isInvitationCodeInvalid = true;
      }
    });
  }

  async checkInvitationCode(invitationCode) {
    const invitation = await this.invitationsService
      .getInvitation(invitationCode)
      .pipe(first())
      .toPromise();

    if (!invitation) {
      this.isInvitationCodeInvalid = true;
    } else if (!invitation.active) {
      this.isInvitationCodeInvalid = true;
    } else {
      this.next = this.router.url;
      this.invitation = invitation;
      this.processInvitation();
    }
  }

  async processInvitation() {
    if (this.currentUser && this.invitation) {
      await this.groupService.AddUserToGroup(
        this.invitation.groupId,
        this.currentUser.id,
        this.invitation.role
      );

      await this.invitationsService.deactivateInvitation(
        this.invitation.id,
        statusInvitation.accepted
      );

      this.router.navigate(['/']);
    }
  }
}
