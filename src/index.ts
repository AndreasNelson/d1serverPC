import { MissionServer } from './mission';
import { ZoneServer } from './zone';
import { PhysicsServer } from './physics';

const MISSION_TCP_PORT = 5223;
const MISSION_HTTP_PORT = 8080;
const ZONE_PORTS = [3478, 3479];
const PHYSICS_PORT = 3074;

console.log('Starting Destiny 1 Custom Server...');

// Start Mission Server
const missionServer = new MissionServer(MISSION_TCP_PORT, MISSION_HTTP_PORT);
missionServer.start();

// Start Zone Servers (UDP)
ZONE_PORTS.forEach(port => {
    const server = new ZoneServer(port);
    server.start();
});

// Start Physics Server (UDP)
const physicsServer = new PhysicsServer(PHYSICS_PORT);
physicsServer.start();

console.log('All servers initialized and listening.');
