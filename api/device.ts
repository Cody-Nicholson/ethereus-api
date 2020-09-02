import { EnergySnapshot, EnergyReading, EnergyEntry } from "./energy";

//const { Client } = require('tplink-smarthome-api');
import {Client } from 'tplink-smarthome-api';
// const client = new Client({ logLevel: 'debug' });
const client = new Client();


export function getEnergy(ip: string) {
    let deviceName;
    return getDevice(ip)
        .then(device => {
            deviceName = device.name;
            console.log('device Name', deviceName);
            return <EnergySnapshot>device.emeter.getRealtime();
        })
        .then(reading => {
            return new EnergyReading(reading, deviceName);
        })
}

export function getDevice(ip: string): Promise<any> {
    return client.getDevice({ host: ip });
}

export function discoverDevice() {
    return new Promise((res, rej) => {
        client.startDiscovery()
            .on('device-new', (device) => {
                res(device);
                //device.getSysInfo().then(console.log);
            })
            .on('error', err => {
                rej(err);
            });
    });
}

export function showDeviceIps() {
    client.startDiscovery()
        .on('device-new', (device) => {
          console.log(device.host);
          device.getSysInfo().then(d => console.log(device.host, ':', d.model, d.alias));
        });

}
