import * as fs from 'fs';
import * as path from 'path';

export interface PkgHeader {
    magic: number;
    elementCount: number;
    version: number;
    stamp: string;
}

export interface TagEntry {
    hash: number;
    offset: number;
    size: number;
    compressedSize: number;
    isCompressed: boolean;
    // New fields for the 48-byte structure
    raw?: string;
}

export class PackageExplorer {
    constructor(private pkgPath: string) {}

    public async readHeader(): Promise<PkgHeader> {
        const handle = await fs.promises.open(this.pkgPath, 'r');
        const buffer = Buffer.alloc(256);
        await handle.read(buffer, 0, 256, 0);
        await handle.close();

        // PS3 is Big Endian
        const magic = buffer.readUInt32BE(0);
        const elementCount = buffer.readUInt16BE(4);
        const version = buffer.readUInt16BE(6);
        
        const stamp = buffer.toString('utf8', 0x20, 0xA4).replace(/\0/g, '').trim();

        return {
            magic,
            elementCount,
            version,
            stamp
        };
    }

    public async findTagTable(): Promise<number> {
        const handle = await fs.promises.open(this.pkgPath, 'r');
        const buffer = Buffer.alloc(100 * 1024);
        await handle.read(buffer, 0, buffer.length, 0);
        await handle.close();

        // The scan showed patterns like [8080....] repeating every 16 or 48 bytes.
        // Let's re-examine 0x1000 area.
        // It looks like entries are 16 bytes, but there are multiple tables or blocks.
        // Let's try 16 bytes starting at 0x1000 (after the padding).
        return 0x1000;
    }

    public async readTagTable(): Promise<TagEntry[]> {
        const header = await this.readHeader();
        // The header dump at 0xA4 showed repeating 16-byte patterns:
        // 00a0: 00000000 03ae0000 ccffcfca 00000002
        // 00b0: 00000800 00002000 00001000 3a288dfd
        
        const tableOffset = 0xA4; 
        const entrySize = 16;
        
        const handle = await fs.promises.open(this.pkgPath, 'r');
        const buffer = Buffer.alloc(header.elementCount * entrySize);
        await handle.read(buffer, 0, buffer.length, tableOffset);
        await handle.close();

        const entries: TagEntry[] = [];
        for (let i = 0; i < header.elementCount; i++) {
            const pos = i * entrySize;
            
            // Re-evaluating structure at 0xA4:
            // [Tag/Flag 4] [Unknown/Ver 4] [Offset/Index 4] [Size/CompSize 4]
            // Or maybe [Hash 4] [Offset 4] [Size 4] [CompSize 4] but Big Endian
            
            const hash = buffer.readUInt32BE(pos);
            const unknown = buffer.readUInt32BE(pos + 4);
            const offset = buffer.readUInt32BE(pos + 8);
            const size = buffer.readUInt32BE(pos + 12);

            if (offset === 0 && size === 0) continue;

            entries.push({
                hash,
                offset,
                size,
                compressedSize: 0, // Need to determine which field is which
                isCompressed: false,
                raw: buffer.toString('hex', pos, pos + 16)
            });
        }

        return entries;
    }

    public async readTagData(entry: TagEntry): Promise<Buffer> {
        const handle = await fs.promises.open(this.pkgPath, 'r');
        const readSize = entry.isCompressed ? entry.compressedSize : entry.size;
        const buffer = Buffer.alloc(readSize);
        await handle.read(buffer, 0, readSize, entry.offset);
        await handle.close();
        return buffer;
    }
}
