import * as path from 'path';
import * as fs from 'fs';
import { PackageExplorer } from './common/package';
import { decompress } from './common/oodle';

const PKG_PATH = path.join(__dirname, '..', 'Destiny (USA, Korea) (En,Fr,De,Es,It,Pt)', 'PS3_GAME', 'USRDIR', 'packages', 'ps3_globals_0151_0.pkg');

async function main() {
    const handle = await fs.promises.open(PKG_PATH, 'r');
    
    const regions = [
        { offset: 0x1000, size: 64, name: 'Table 1' },
        { offset: 0x2000, size: 64, name: 'Table 2' },
        { offset: 0x21000, size: 128, name: 'Data 1' }
    ];

    for (const region of regions) {
        const buffer = Buffer.alloc(region.size);
        await handle.read(buffer, 0, region.size, region.offset);
        console.log(`\n--- ${region.name} (0x${region.offset.toString(16)}) ---`);
        console.log(buffer.toString('hex'));
    }

    await handle.close();
}

main();
