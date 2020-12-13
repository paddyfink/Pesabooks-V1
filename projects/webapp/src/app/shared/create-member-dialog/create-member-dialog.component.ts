import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Member } from '@app/models';
import { MembersService } from '@app/services';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-create-member-dialog',
  templateUrl: './create-member-dialog.component.html',
  styleUrls: ['./create-member-dialog.component.scss']
})
export class CreateMemberDialogComponent extends BaseComponent
  implements OnInit {
  memberForm: FormGroup;
  member: Member;

  constructor(
    public dialogRef: MatDialogRef<CreateMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private membersService: MembersService
  ) {
    super();
    this.member = data.member;
  }

  ngOnInit() {
    this.currentGroup$.pipe(takeUntil(this.ngUnsubscribe)).subscribe();

    this.memberForm = this.fb.group({
      firstName: [
        this.member ? this.member.firstName : '',
        Validators.required
      ],
      lastName: [
        this.member ? this.member.lastName : null,
        Validators.required
      ],
      email: [this.member ? this.member.email : null, Validators.email],
      phone: [this.member ? this.member.phone : null]
    });
  }

  async save() {
    this.memberForm.markAsTouched();
    if (this.memberForm.valid) {
      if (this.member) {
        await this.membersService.updateMember(
          this.currentGroup.id,
          this.member.id,
          this.memberForm.value
        );
        this.dialogRef.close(this.member.id);
      } else {
        const newMemberId = await this.membersService.create(
          this.currentGroup.id,
          this.memberForm.value
        );
        this.dialogRef.close(newMemberId);
      }
    }
  }
}
