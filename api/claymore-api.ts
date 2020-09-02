
import { Socket } from 'net';
import { ClaymoreSnapshot, ClaymoreRpcResponse } from './claymore';
import { ClaymoreStat } from "../models/claymore-stats";
import { ClaymoreRPC } from './claymore-rpc';
import { zip } from 'lodash';

import { uniqBy } from 'lodash';
import { TimeAliasApi, TimeAlias, aliasToTime } from './time-alias-api';
import { dataZ } from '../runseries';

const rpcQuery = '{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}\n';

export class SeriesItem {

    constructor(public value: number, public timestamp: number) { }
}

export class ClaymoreApi extends TimeAliasApi {

    constructor() {
        super();
    }

    getStats(ip: string, alias: TimeAlias): Promise<ClaymoreData[]> {
        return ClaymoreStat
            .find({
                ip
            })
            .where('timestamp')
            .gte(+new Date() - aliasToTime[alias])
            .exec()
    }

    getFans(ip: string, alias: TimeAlias): Promise<number[][]> {
        return this.getSeriesByProperty(ip, alias, 'fans');
    }

    getTemps(ip: string, alias: TimeAlias): Promise<number[][]> {
        return this.getSeriesByProperty(ip, alias, 'temps')
    }

    getEthereumHash(ip: string, alias: TimeAlias): Promise<number[][]> {
        return this.getSeriesByProperty(ip, alias, 'ethHash');
    }

    getDualHash(ip: string, alias: TimeAlias): Promise<number[][]> {
        return this.getSeriesByProperty(ip, alias, 'dcrHash');
    }

    getSeriesByProp(ip: string, alias: TimeAlias, prop: string) {
        return this.getStats(ip, alias)
            .then((clayStats) => {
                return this.getFilledSeriesByProp(clayStats, alias, prop);
            });
    }

    private getFilledSeriesByProp(clayStats: ClaymoreData[], alias: TimeAlias, prop: string) {
        let filledStats: any[] = [];
        let duration = aliasToTime[alias];
        let bucketSize = this.getBucketSize(alias);
        let now = +new Date();
        let end = now - (now % bucketSize);
        let start = end - duration + bucketSize;

        if (!clayStats.length) {
            return [];
        }

        let firstStat = clayStats[0];
        clayStats = uniqBy(clayStats, 'timestamp');

        // console.log("First Stat Time", new Date(clayStats[0].timestamp).toString())
        // console.log("Start Time", new Date(start).toString())
        // console.log('For Iterations:', (end - start) / bucketSize)

        function addFiller(expectedTimestamp) {
            let add = firstStat[prop].map(n => new SeriesItem(null, expectedTimestamp));
            filledStats.push(add);
        }

        for (let i = 0; i < (end - start) / bucketSize; i += 1) {
            let item: ClaymoreData = clayStats[i];
            let expectedTimestamp = start + i * bucketSize;

            // console.log('I:', i, 'LEN', clayStats.length)
            // out of points fill
            if (!item) {
                console.log('no item')
                // fill with same number of gps as first item;
                addFiller(expectedTimestamp);
                continue;
            }

            //console.log("Expected:", new Date(expectedTimestamp).toString(), 'I=',i)
            //console.log("Time    :", new Date(clayStats[i].timestamp).toString(), 'I=',i)

            if (item.timestamp == expectedTimestamp) {
                //  console.log('item.timestamp == expectedTimestamp')
                let add = item[prop].map(value => new SeriesItem(value, item.timestamp));
                filledStats.push(add);
                continue;
            }

            // 
            if (item.timestamp < expectedTimestamp) {
                // console.log('item time LESS THAN expected')
                while (item && item.timestamp < expectedTimestamp) {
                    clayStats.splice(i, 1);
                    item = clayStats[i];
                }
                if (item) {
                    let add = item[prop].map(value => new SeriesItem(value, item.timestamp));
                    filledStats.push(add);
                }
                continue;
            }

            if (item.timestamp > expectedTimestamp) {
                // console.log('item time > expected')
                clayStats.unshift(null);
                addFiller(expectedTimestamp);
                continue;
            }

            console.log('I shouldnt be here')
        }
        return <SeriesItem[][]>zip(...filledStats);
    }

    getTimedSeriesByProperty(ip: string, alias: TimeAlias, prop: string): Promise<SeriesItem[][]> {
        return this.getStats(ip, alias)
            .then((clayStats: ClaymoreData[]) => {
                let filledList: any[] = [];
                let duration = aliasToTime[alias];
                let bucketSize = this.getBucketSize(alias);
                let now = +new Date();
                let end = now - (now % bucketSize);
                let start = end - duration + bucketSize;

                let addItem: SeriesItem[];

                if (!clayStats.length) {
                    return [];
                }

                clayStats = uniqBy(clayStats, 'timestamp');

                // Iterate from starting time per alias through each index (time bucket) 
                for (let i = 0; i < (end - start) / bucketSize; i += 1) {
                    let item: ClaymoreData = clayStats[i];
                    let expectedTimestamp = start + i * bucketSize;

                    if (item && item.timestamp == expectedTimestamp) {
                        addItem = item[prop].map(value => new SeriesItem(value, item.timestamp));
                    } else {
                        // an item doesn not exist or match our stamp fill array

                        clayStats.unshift(null);
                        if (item) {
                            // item exists but is wrong and push empty values to filledList
                            addItem = item[prop].map(v => new SeriesItem(null, expectedTimestamp));
                        }
                    }

                    if (!addItem) {
                        addItem.push();
                    }
                    filledList.push(addItem);
                }

                return <SeriesItem[][]>zip(...filledList);
            })
    }

    getSeriesByProperty(ip: string, alias: TimeAlias, prop: string): Promise<number[][]> {
        return this.getStats(ip, alias)
            .then(clayStats => {
                console.log('get stats res', clayStats)
                let groups = clayStats.map(stat => <number[]>stat[prop]);
                return zip(...groups);
            });
    }

    getSnapshot(host?: string, port?: number) {
        return new ClaymoreRPC({ host })
            .query()
    }
}

export class ClaymoreData extends ClaymoreSnapshot {
    ip: string;
    timestamp: number;
}


