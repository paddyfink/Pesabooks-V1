import { Aggregation, AggregationPerMonthPerMember } from '@app/models';

export interface AggregationPerMember {
  [memberId: string]: Aggregation;
}
export const generateBilanPerMember = (
  transactionsPerMonths: AggregationPerMonthPerMember[]
): any => {
  let result = {};

  for (const transactionsPerMonth of transactionsPerMonths) {
    let aggregation = {
      input: {
        total: 0,
        perCategory: {}
      },
      output: {
        total: 0,
        perCategory: {}
      },
      transactionsCount: 0
    };

    if (result[transactionsPerMonth.memberId]) {
      aggregation = { ...result[transactionsPerMonth.memberId] };
    }

    aggregation.transactionsCount =
      aggregation.transactionsCount + transactionsPerMonth.transactionsCount;
    aggregation.input.total =
      aggregation.input.total + transactionsPerMonth.input.total;
    aggregation.output.total =
      aggregation.output.total + transactionsPerMonth.output.total;

    // tslint:disable-next-line:forin
    for (const inputCatId in transactionsPerMonth.input.perCategory) {
      const categoryValue = aggregation.input.perCategory[inputCatId] || 0;

      aggregation.input.perCategory[inputCatId] =
        categoryValue + transactionsPerMonth.input.perCategory[inputCatId];
    }

    // tslint:disable-next-line:forin
    for (const outputCatId in transactionsPerMonth.output.perCategory) {
      const categoryValue = aggregation.output.perCategory[outputCatId] || 0;

      aggregation.output.perCategory[outputCatId] =
        categoryValue + transactionsPerMonth.output.perCategory[outputCatId];
    }

    result = {
      ...result,
      [transactionsPerMonth.memberId]: { ...aggregation }
    };
  }

  return result;
};
