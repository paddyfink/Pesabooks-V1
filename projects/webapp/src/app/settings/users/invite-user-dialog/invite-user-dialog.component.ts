import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Const, Invitation, statusInvitation } from '@app/models';
import { InvitationsService } from '@app/services';
import { BaseComponent } from '@app/shared';
import { TdLoadingService } from '@covalent/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-invite-user-dialog',
  templateUrl: './invite-user-dialog.component.html',
  styleUrls: ['./invite-user-dialog.component.scss']
})
export class InviteUserDialogComponent extends BaseComponent implements OnInit {
  formGroup: FormGroup;
  roles = Const.rolesNames;
  sendingInvite = true;

  constructor(
    public dialogRef: MatDialogRef<InviteUserDialogComponent>,
    private fb: FormBuilder,
    private invitationService: InvitationsService,
    private loadingService: TdLoadingService
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      role: ['', Validators.required],
      email: ['', Validators.required]
    });
  }
  async invite() {
    this.loadingService.register('actions');
    const value = this.formGroup.value;

    const invitation = await this.invitationService.createInvitation(
      <Invitation>{
        ...value,
        groupId: this.currentGroup.id,
        groupName: this.currentGroup.name,
        inviter: _.pick(this.currentUser, ['id', 'fullName', 'email']),
        status: statusInvitation.pending
      }
    );

    this.invitationService.sendInvitation(invitation);

    this.sendingInvite = false;
    this.dialogRef.close();
  }
}
