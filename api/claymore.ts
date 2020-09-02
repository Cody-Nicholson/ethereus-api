export interface ClaymoreRpcResponse {
    id: number,
    error: any,
    result: string[];
}

export class ClaymoreSnapshot {
    ethShares: number;
    dcrShares: number;
    ethRejects: number;
    dcrRejects: number;
    ethInvalid: number;
    dcrInvalid: number;
    ethHash: number[];
    dcrHash: number[];
    temps: number[];
    fans: number[];
    pools: string;
    ver: string;
    uptime: number;

    constructor(res: ClaymoreRpcResponse) {
        let r = res.result;
        let eth = r[2].split(';');
        let dec = r[4].split(';');

        this.ethShares = +eth[1];
        this.dcrShares = +dec[1];

        this.ethRejects = +eth[2];
        this.dcrRejects = +dec[2];

        this.ethHash = r[3].split(';').map(Number);
        this.dcrHash = r[5].split(';').map(h => h == 'off' ? 0 : +h);

        this.temps = r[6].split(';').filter((v, i) => (i + 1) % 2).map(Number);
        this.fans = r[6].split(';').filter((v, i) => i % 2).map(Number);

        this.pools = r[7];
        this.ver = r[0];
        this.uptime = +r[1];
        this.ethInvalid = +r[8].split(';')[1];
        this.dcrInvalid = +r[8].split(';')[3];
    }
}