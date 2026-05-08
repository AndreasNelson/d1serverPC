import * as net from 'net';
import express from 'express';
import { Server } from 'http';

export class MissionServer {
    private tcpPort: number;
    private httpPort: number;
    private tcpServer: net.Server;
    private httpServer: Server;
    private app: express.Express;

    constructor(tcpPort: number, httpPort: number) {
        this.tcpPort = tcpPort;
        this.httpPort = httpPort;
        this.app = express();

        this.setupHttpRoutes();
        this.httpServer = new Server(this.app);

        this.tcpServer = net.createServer((socket) => {
            console.log(`[MissionServer:TCP:${this.tcpPort}] Client connected`);
            socket.on('data', (data) => {
                console.log(`[MissionServer:TCP:${this.tcpPort}] Data: ${data.toString('hex')}`);
            });
        });
    }

    private setupHttpRoutes() {
        this.app.use(express.json());
        
        // Log all requests
        this.app.use((req, res, next) => {
            console.log(`[MissionServer:HTTP] ${req.method} ${req.url}`);
            next();
        });

        // Basic Destiny API Endpoints (Stubs)
        this.app.get('/Platform/Destiny/Manifest/', (req, res) => {
            res.json({
                Response: {
                    version: "v1.0.0-custom",
                    // Add manifest details here
                },
                ErrorCode: 1,
                ThrottleSeconds: 0,
                ErrorStatus: "Success",
                Message: "Ok"
            });
        });

        this.app.get('/Platform/User/GetMembershipDataForCurrentUser/', (req, res) => {
            // Stub for current user
            res.json({
                Response: {
                    destinyMemberships: [
                        {
                            membershipType: 1, // Xbox? PSN is 2
                            membershipId: "12345",
                            displayName: "Guardian"
                        }
                    ]
                },
                ErrorCode: 1,
                ErrorStatus: "Success"
            });
        });

        // Default handler
        this.app.all('*', (req, res) => {
            console.warn(`[MissionServer:HTTP] Unhandled request: ${req.url}`);
            res.status(404).json({ ErrorCode: 0, ErrorStatus: "NotFound" });
        });
    }

    public start() {
        this.tcpServer.listen(this.tcpPort, '0.0.0.0', () => {
            console.log(`[MissionServer] TCP listening on port ${this.tcpPort}`);
        });

        this.httpServer.listen(this.httpPort, '0.0.0.0', () => {
            console.log(`[MissionServer] HTTP listening on port ${this.httpPort}`);
        });
    }
}
