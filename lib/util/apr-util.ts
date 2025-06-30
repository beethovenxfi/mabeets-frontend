import numeral from 'numeral';
import { GqlPoolAprItem, GqlPoolAprItemType } from '~/apollo/generated/graphql-codegen-generated';

export const formatApr = (apr: string) => {
    if (parseFloat(apr) < 0.0000001) {
        return '0.00%';
    }

    return numeral(apr).format('0.00%');
};

// export function getApr(apr: GqlPoolAprItem[]): string {
//     if (apr.__typename === 'GqlPoolAprRange') {
//         return `${formatApr(apr.min)} - ${formatApr(apr.max)}`;
//     } else {
//         return formatApr(apr.total);
//     }
// }

/**
 * Calculates the total APR based on the array of APR items and an optional boost value.
 *
 * @param {GqlPoolAprItem[]} aprItems - The array of APR items to calculate the total APR from.
 * @returns {[number, number]} The total APR range.
 */
export function getTotalApr(aprItems: GqlPoolAprItem[]): [number, number] {
    let minTotal = 0;
    let maxTotal = 0;

    aprItems
        // Filter known APR types to avoid including new unknown API types that are not yet displayed in the APR tooltip
        //.filter(item => TOTAL_APR_TYPES.includes(item.type))
        .forEach((item) => {
            if (item.type === 'STAKING_BOOST') {
                maxTotal = item.apr + maxTotal;
                return;
            }

            if (item.type === 'MABEETS_EMISSIONS') {
                minTotal = item.apr + minTotal;
                maxTotal = item.apr + maxTotal;
                return;
            }

            minTotal = item.apr + minTotal;
            maxTotal = item.apr + maxTotal;
        });

    return [minTotal, maxTotal];
}

/**
 * Calculates the total APR label based on the array of APR items and an optional boost value.
 *
 * @param {GqlPoolAprItem[]} aprItems - The array of APR items to calculate the total APR label from.
 * @returns {string} The formatted total APR label.
 */
export function getTotalAprLabel(aprItems: GqlPoolAprItem[]): string {
    const [minTotal, maxTotal] = getTotalApr(aprItems);

    if (minTotal === maxTotal) {
        return formatApr(minTotal.toString());
    } else {
        return `${formatApr(minTotal.toString())} - ${formatApr(maxTotal.toString())}`;
    }
}
