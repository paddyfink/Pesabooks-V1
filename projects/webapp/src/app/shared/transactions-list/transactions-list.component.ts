import { SelectionModel } from '@angular/cdk/collections';
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
import { Group, Transaction } from '@app/models';
import { orderTransactions } from '@app/utils/helpers';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent extends BaseComponent
  implements OnInit, OnChanges {
  @Input() transactions: Transaction[];
  @Input()
  columns = [
    'select',
    'date',
    'type',
    'member',
    'category',
    'total',
    'dueDate',
    'status',
    'actions'
  ];
  @Input() showTotal = true;
  @Input() clickable = true;
  @Input() currentGroup: Group;
  @Output() select = new EventEmitter<Transaction>();
  @Output() duplicate = new EventEmitter<Transaction>();
  @Output() saveTemplate = new EventEmitter<Transaction>();
  @Output() markAsPaid = new EventEmitter<Transaction>();
  @Output() markAsUnpaid = new EventEmitter<Transaction>();
  @Output() copyTransactionsToOtherDate = new EventEmitter<Transaction[]>();
  @Output() delete = new EventEmitter<Transaction>();
  @Output() deleteMany = new EventEmitter<Transaction[]>();

  TODAY = Date.now();
  dataSource = new MatTableDataSource<Transaction>();
  selection: SelectionModel<Transaction>;
  totalInput = 0;
  totalOutput = 0;

  constructor() {
    super();
  }

  ngOnInit() {
    const allowMultiSelect = true;
    this.selection = new SelectionModel<Transaction>(allowMultiSelect, []);
  }

  getLinesCategories(transaction: Transaction): string {
    return transaction.lines.map(t => t.categoryName).join(', ');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByFn(index, item) {
    return item.id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selection) {
      this.selection.clear();
    }
    this.dataSource = new MatTableDataSource<Transaction>(
      orderTransactions(this.transactions)
    );

    let accTotalInput = 0;
    let accOutputTotal = 0;
    if (this.transactions) {
      this.transactions.forEach(t => {
        if (t.direction === 'input') {
          accTotalInput += t.total;
        } else if (t.direction === 'output') {
          accOutputTotal += t.total;
        }
      });
    }
    this.totalInput = accTotalInput;
    this.totalOutput = accOutputTotal;
  }
}
