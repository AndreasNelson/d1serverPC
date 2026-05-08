export enum ProtocolType {
    TCP = 'TCP',
    UDP = 'UDP'
}

export interface PacketMetadata {
    type: ProtocolType;
    port: number;
    timestamp: number;
    remoteAddress: string;
    remotePort: number;
}

export class Packet {
    constructor(
        public readonly data: Buffer,
        public readonly metadata: PacketMetadata
    ) {}

    public toJSON() {
        return {
            metadata: this.metadata,
            length: this.data.length,
            hex: this.data.toString('hex')
        };
    }

    // TODO: Add methods for parsing common Tiger Engine headers
}
