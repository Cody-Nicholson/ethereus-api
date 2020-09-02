import { getEnergy } from "./device";
import { EnergyEntry } from "./energy";
import { EnergyEntryModel } from "../models/energy-entry";
import { TimeAlias, TimeAliasApi, aliasToTime } from "./time-alias-api";
import { SeriesItem } from "./claymore-api";
import { zip } from 'lodash';
import { uniqBy } from 'lodash';

export class EnergyApi extends TimeAliasApi {

    constructor() {
        super();
    }

    getPowerSeries(ip: string, alias: TimeAlias): Promise<number[]> {
        return this.getStats(ip, alias)
            .then(data => {
                return data.map(data => data.power);
            })
    }

    getStats(ip: string, alias: TimeAlias): Promise<EnergyEntry[]> {
        return EnergyEntryModel.find({ ip })
            .where('timestamp')
            .gte(this.getStartingTime(alias))
            .exec()
    }

    getSnapshot(ip: string) {
        return getEnergy(ip);
    }
    
    getSeriesByProp(ip: string, alias: TimeAlias, prop: string) {
        return this.getStats(ip, alias)
            .then((energyStats) => {
                return this.getFilledSeriesByProp(energyStats, alias, prop);
            });
    }

    getFilledSeriesByProp(energyStats, alias: TimeAlias, prop: string) {
        let filledStats: any[] = [];
        let duration = aliasToTime[alias];
        let bucketSize = this.getBucketSize(alias);
        let now = +new Date();
        let end = now - (now % bucketSize);
        let start = end - duration + bucketSize;

        if(!energyStats.length){
            return [];
        }

        energyStats = uniqBy(energyStats, 'timestamp');

        console.log('Start Time       :', (new Date(start).toString()))
        console.log('First Bucket Time:', (new Date(energyStats[0].timestamp).toString()))
        console.log('Estats len:', energyStats.length)

        function addFiller(expectedTimestamp){
            filledStats.push(new SeriesItem(null, expectedTimestamp));
        }

        for (let i = 0; i < (end - start) / bucketSize; i += 1) {
            let item: EnergyEntry = energyStats[i];
            let expectedTimestamp = start + i * bucketSize;

            // out of points fill
            if(!item){
                addFiller(expectedTimestamp);
                continue;
            }

            if(item.timestamp == expectedTimestamp){
                filledStats.push(new SeriesItem(item[prop], expectedTimestamp));
                continue;
            }

            if(item.timestamp < expectedTimestamp){
                console.log('item.timestamp < expectedTimestamp (LESS THAN)')
                while(item.timestamp < expectedTimestamp){
                    item = energyStats.splice(i, 1)[0];
                }
                filledStats.push(new SeriesItem(item[prop], expectedTimestamp));
                continue;
            }

            if(item.timestamp > expectedTimestamp){
                energyStats.unshift(null);
                addFiller(expectedTimestamp);
                continue;
            }
        }
        return [filledStats];
    }

    getTimedSeriesByProperty(ip: string, alias: TimeAlias, prop: string): Promise<SeriesItem[][]> {
        return this.getStats(ip, alias)
            .then((energyStats: EnergyEntry[]) => {
                let filledList: any[] = [];
                let duration = aliasToTime[alias];
                let now = +new Date();
                let end = now - (now % 5000);
                let start = end - duration + 5000;
                let addItem: SeriesItem[];

                console.log('Start Time:', (new Date(start).toString()))
                console.log('First Bucket Time:', (new Date(energyStats[0].timestamp).toString()))
                
                energyStats = uniqBy(energyStats, 'timestamp');

                for (let i = 0; i < (end - start) / 5000; i += 1) {
                    let item = energyStats[i];
                    let expectedTimestamp = start + i * 5000;


                    if (item.timestamp == expectedTimestamp) {
                        console.log('found expected')
                        addItem = [{
                            value: item[prop],
                            timestamp: item.timestamp
                        }]

                    } else {
                        // an item doesn not exist fill array and push empty values to filledList
                        energyStats.unshift(null);
                        addItem = [{
                            value: null,
                            timestamp: expectedTimestamp,
                        }]

                    }
                    filledList.push(addItem);
                }
                return <SeriesItem[][]>zip(...filledList);
            });
    }

    put(entry: EnergyEntry) {
        return new EnergyEntryModel(entry).save()
            .then(res => {
                console.log('saved bucket:', res.timestamp)
                return res
            })
            .catch(err => {
                console.error(err);
            });
    }

}