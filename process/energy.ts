
import '../models/connect';
import { EnergyApi } from '../api/energy-api';
import { EnergyEntry } from '../api/energy';
import { EnergyEntryModel } from '../models/energy-entry';
import { energyIPs } from '../config';


let ips = energyIPs;

let api = new EnergyApi();

getNextSnapshot();

function saveStat(ip, timestamp) {
    return api.getSnapshot(ip)
        .then((data: EnergyEntry) => {
            console.log('Reading:', data.power, ' W');
            data.timestamp = timestamp;
            data.ip = ip;
            return api.put(data);
        });
}

function getNextSnapshot() {
    let date = +new Date();
    let wait = 5000 - date % 5000;
    setTimeout(() => {
        saveStat(ips[0], date + wait)
            .catch(err => {
                console.error('Failed Who cares', err)
            })
            .then(getNextSnapshot);

        saveStat(ips[1], date + wait)
            .catch(err => {
                console.error('Failed Who cares', err)
            })

    }, wait);
}
