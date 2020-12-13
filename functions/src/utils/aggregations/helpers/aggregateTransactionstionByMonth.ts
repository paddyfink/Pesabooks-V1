// tslint:disable-next-line:no-implicit-dependencies
import { AggregationPerMonth, Transaction } from '@app/models';
import { get, set } from 'lodash';

export const aggregateTransactionstionByMonth = (
  transactions: Transaction[],
  dateMonth: number,
  dateYear: number
): AggregationPerMonth => {
  const transactionPerMonth: AggregationPerMonth = {
    input: {
      total: 0,
      perCategory: {},
      payment: {
        total: 0,
        perCategory: {}
      },
      loan: {
        total: 0,
        perCategory: {},
        perStatus: {}
      }
    },
    output: {
      total: 0,
      perCategory: {},
      payment: {
        total: 0,
        perCategory: {}
      },
      loan: {
        total: 0,
        perCategory: {},
        perStatus: {}
      }
    },
    transactionsCount: transactions.length,
    dateMonth: dateMonth,
    dateYear: dateYear
  };

  for (const transaction of transactions) {
    const { direction, type, total, status } = transaction;

    const currentTotal = get(transactionPerMonth, `${direction}.${type}.total`);
    set(
      transactionPerMonth,
      `${direction}.${type}.total`,
      currentTotal + total
    );

    if (type === 'loan') {
      const statusValue =
        get(transactionPerMonth, `${direction}.${type}.perStatus.${status}`) ||
        0;

      set(
        transactionPerMonth,
        `${direction}.${type}.perStatus.${status}`,
        statusValue + total
      );
    }

    transaction.lines.forEach(line => {
      const categoryValueForType =
        get(
          transactionPerMonth,
          `${direction}.${type}.perCategory.${line.categoryId}`
        ) || 0;

      const categoryValue =
        get(
          transactionPerMonth,
          `${direction}.perCategory.${line.categoryId}`
        ) || 0;

      set(
        transactionPerMonth,
        `${direction}.${type}.perCategory.${line.categoryId}`,
        categoryValueForType + line.amount
      );

      set(
        transactionPerMonth,
        `${direction}.perCategory.${line.categoryId}`,
        categoryValue + line.amount
      );
    });
  }

  return {
    ...transactionPerMonth,
    input: {
      ...transactionPerMonth.input,
      total:
        transactionPerMonth.input.payment.total +
        transactionPerMonth.input.loan.total
    },
    output: {
      ...transactionPerMonth.output,
      total:
        transactionPerMonth.output.payment.total +
        transactionPerMonth.output.loan.total
    }
  };
};
