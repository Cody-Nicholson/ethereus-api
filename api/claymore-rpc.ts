
import { Socket } from 'net';
import { ClaymoreRpcResponse, ClaymoreSnapshot } from './claymore';

const rpcQuery = '{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}\n';

export class ClaymoreRPC {
    host: string;
    port: number;
    socket: Socket;
    timeout: number;
    promise: Promise<ClaymoreSnapshot>;
    res: (any) => void;
    rej: (any) => void;

    constructor(config: any = {}) {
        this.host = config.host || 'localhost';
        this.port = config.port || '3333';
        this.timeout = config.timeout || 5000;
    }

    query() {
        return Promise.resolve()
            .then(() => {
                this.socket = new Socket();
                this.createPromise();
                this.connect();
                return this.promise;
            })
    }

    onData(data) {
        this.socket.setTimeout(0);
        let response: ClaymoreRpcResponse = JSON.parse(data);
        this.res(new ClaymoreSnapshot(response));
    }

    createPromise() {
        this.promise = new Promise<any>((res, rej) => {
            this.res = res;
            this.rej = rej;
        });
    }

    connect() {
        this.socket.connect(this.port, this.host);
        this.socket
            .on('connect', () => { this.onConnect() })
            .on('timeout', () => { this.onTimeout() })
            .on('data', (data) => { this.onData(data) })
            .on('error', (error) => { this.onError(error) })
    }

    onError(err) {
        console.error('Socket err', err)
        this.rej(err);
    }

    onConnect = function () {
        // console.log(`Connected to ${this.socket.remoteAddress}:${this.socket.remotePort}`);
        this.socket.write(rpcQuery);
        this.socket.setTimeout(this.timeout);
    }

    onTimeout() {
        this.socket.destroy();
        console.log('Lost connection to claymore, reconnecting in 10s');
        setTimeout(() => {
            this.connect();
        }, 10000)
        //throw Error('Socket timed out');
    }

}


