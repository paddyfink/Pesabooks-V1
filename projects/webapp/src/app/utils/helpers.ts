import { FormGroup } from '@angular/forms';
import {
  Category,
  CategoryType,
  Group,
  Member,
  Transaction,
  TransactionLine
} from '@app/models';
import { chain, find, get, orderBy } from 'lodash';
import * as moment from 'moment';

export const markFormAsTouched = (formGroup: FormGroup) => {
  (<any>Object).values(formGroup.controls).forEach(control => {
    control.markAsTouched();

    if (control.controls) {
      markFormAsTouched(control);
    }
  });
};

export const calculateTransactionBalanceDue = (transaction: Transaction) => {
  let interestAmount;

  if (transaction.interest) {
    if (transaction.interestType === 'percent') {
      interestAmount = transaction.total * transaction.interest / 100;
    } else {
      interestAmount = transaction.interest;
    }
  }

  return transaction.total + (interestAmount || 0);
};

export const formatMonthYear = (month: number, year: number): string => {
  const monthName = moment()
    .month(month - 1)
    .format('MMM');

  const yearName = moment()
    .year(year)
    .format('YY');

  return `${monthName} ${yearName}`;
};

export const formatTransactionWithMemberAndCategory = (
  t: Transaction,
  members: Member[],
  categories: Category[]
): Transaction => {
  const member: Member = find(members, { id: t.memberId });

  return <Transaction>{
    ...t,
    date: t.date ? t.date.toDate() : null,
    dueDate: t.dueDate ? t.dueDate.toDate() : null,
    lines: t.lines.map((line: TransactionLine) => {
      return {
        ...line,
        categoryName: get(find(categories, { id: line.categoryId }), 'name')
      };
    }),
    memberFullName: member ? member.fullName : '',
    balanceDue: calculateTransactionBalanceDue(t)
  };
};

export const orderTransactions = (
  transactions: Transaction[]
): Transaction[] => {
  return chain(transactions)
    .map(trx => {
      return {
        ...trx,
        monthYearName: formatMonthYear(trx.dateMonth, trx.dateYear)
      };
    })
    .orderBy(['monthYearName', 'memberFullName'], ['desc', 'asc'])
    .value();
};

export const orderMembers = (members: Member[]): Member[] => {
  return orderBy(members, ['fullName'], ['asc']);
};

export const orderCategories = (categories: Category[]): Category[] => {
  return chain(categories)
    .map(category => {
      let order;
      switch (category.type) {
        case CategoryType.contribution:
          order = 1;
          break;
        case CategoryType.pot:
          order = 2;
          break;
        case CategoryType.loan:
          order = 3;
          break;
        case CategoryType.repayment:
          order = 4;
          break;
        case CategoryType.interestAndFee:
          order = 5;
          break;
        case CategoryType.fineAndPenalty:
          order = 6;
          break;

        default:
          order = 7;
          break;
      }
      return {
        ...category,
        order
      };
    })
    .orderBy(['order', 'name'], ['asc', 'asc'])
    .value();
};

export interface FormattedDate {
  month: number;
  year: number;
  name: string;
}

export const generateMonthsList = (group: Group): FormattedDate[] => {
  const startDate = group.startDate.toDate() as Date;

  const todayDate = new Date();
  const months = [];
  while (
    startDate < todayDate ||
    moment(startDate).format('M YYYY') === moment(todayDate).format('M YYYY')
  ) {
    months.unshift({
      month: startDate.getUTCMonth() + 1,
      year: startDate.getUTCFullYear(),
      name: moment(startDate).format('MMM YYYY')
    });
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return months;
};
