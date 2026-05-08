import * as dgram from 'dgram';

export class ZoneServer {
    private port: number;
    private socket: dgram.Socket;

    constructor(port: number) {
        this.port = port;
        this.socket = dgram.createSocket('udp4');

        this.socket.on('message', (msg, rinfo) => {
            console.log(`[ZoneServer:${this.port}] Received ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`);
            // TODO: Implement matchmaking and routing logic
        });

        this.socket.on('listening', () => {
            const address = this.socket.address();
            console.log(`[ZoneServer] Listening on ${address.address}:${address.port}`);
        });

        this.socket.on('error', (err) => {
            console.error(`[ZoneServer:${this.port}] Socket error:`, err);
        });
    }

    public start() {
        this.socket.bind(this.port);
    }
}
