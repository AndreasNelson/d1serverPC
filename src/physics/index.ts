import * as dgram from 'dgram';

export class PhysicsServer {
    private port: number;
    private socket: dgram.Socket;

    constructor(port: number) {
        this.port = port;
        this.socket = dgram.createSocket('udp4');

        this.socket.on('message', (msg, rinfo) => {
            // High-frequency telemetry logic
            // console.log(`[PhysicsServer:${this.port}] Telemetry from ${rinfo.address}:${rinfo.port}`);
            // TODO: Validate positional telemetry and broadcast state acknowledgments
        });

        this.socket.on('listening', () => {
            const address = this.socket.address();
            console.log(`[PhysicsServer] Listening on ${address.address}:${address.port}`);
        });

        this.socket.on('error', (err) => {
            console.error(`[PhysicsServer:${this.port}] Socket error:`, err);
        });
    }

    public start() {
        this.socket.bind(this.port);
    }
}
