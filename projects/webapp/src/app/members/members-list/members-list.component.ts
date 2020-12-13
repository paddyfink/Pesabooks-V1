import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Member } from '@app/models';
import { orderMembers } from '@app/utils/helpers';

const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit, OnChanges {
  @Input() members: Member[];
  @Output() openDialog = new EventEmitter<Member>();

  displayedColumns = ['fullName', 'email', 'phone', 'actions'];
  membersDataSource: MatTableDataSource<Member>;

  constructor() {}

  async ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.members) {
      this.membersDataSource = new MatTableDataSource(
        orderMembers(this.members)
      );
    }
  }
}
