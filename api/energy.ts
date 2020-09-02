export interface EnergySnapshot{
    current: number;
    voltage: number;
    power: number;
    total: number;
    err_code: number;
}

export class EnergyReading implements EnergySnapshot{
    current: number;
    voltage: number;
    power: number;
    total: number;
    err_code: number;
    deviceName: string;
    constructor(reading: EnergySnapshot, name: string){
        Object.assign(this, reading);
        this.deviceName = name;
    }
}

export class EnergyEntry extends EnergyReading{
    ip: string;
    timestamp: number;

    constructor(reading: EnergySnapshot, name: string, ip: string, timestamp: number){
        super(reading, name);
        this.ip = ip;
        this.timestamp = timestamp;
    }
}