
export type TimeAlias = '10M' | '30M' | '1H' | '2H' | '6H' | '12H' | '24H' | '2D' | '7D';

const oneMin = 1000 * 60;
export const aliasToTime = {
    '10M': oneMin * 10,
    '30M': oneMin * 30,
    '1H': oneMin * 60,
    '2H': oneMin * 60 * 2,
    '6H': oneMin * 60 * 6,
    '12H': oneMin * 60 * 12,
    '24H': oneMin * 60 * 24,
    '2D': oneMin * 60 * 24 * 2,
    '7D': oneMin * 60 * 24 * 7
}

export class TimeAliasApi{

    protected getStartingTime(alias: TimeAlias){
        return +new Date() - aliasToTime[alias];
    }

    protected getBucketSize(alias: TimeAlias): number {
        return {
            '10M': 5000,
            '1H': 5000,
            '6H': 5000 * 6,
            '12H': 5000 * 12,
            '24H': 5000 * 24,
            '2D': 5000 * 48,
            '7D': 5000 * 24 * 7,
        }[alias];
    }
}