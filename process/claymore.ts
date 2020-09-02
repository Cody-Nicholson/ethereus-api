

import { ClaymoreStat } from "../models/claymore-stats";
import { ClaymoreApi, ClaymoreData } from '../api/claymore-api';
import '../models/connect';
import { claymoreIPs } from "../config";

let ips = [
    '192.168.1.122',
    '192.168.1.129',
];

let api = new ClaymoreApi();

pollSnapshots();

function saveStats(timestamp) {

    let all = claymoreIPs.map(ip => {
        return saveStat(ip, timestamp);
    })
    return Promise.all(all);
}

function saveStat(ip, timestamp) {
    return api.getSnapshot(ip)
        .then((data: ClaymoreData) => {
            data.timestamp = timestamp;
            data.ip = ip;

            return new ClaymoreStat(data)
                .save()
                .then(res => {
                    console.log(`${ip} recorded snapshot for: ${res.timestamp}`);
                    return res
                })
                .catch(err => {
                    console.error('ClaymoreStat Save Err:', err);
                });
        })
        .catch(e => {
            console.log('getSnapshot Error:', e);
        })

}

function pollSnapshots() {
    let date = +new Date();
    let wait = 5000 - date % 5000;
    setTimeout(() => {
        saveStats(date + wait)
            .catch(err => {
                console.error('Failed Who cares')
            })
            .then(pollSnapshots);
    }, wait);
}
