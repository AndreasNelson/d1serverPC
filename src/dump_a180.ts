import * as fs from 'fs';
import * as path from 'path';

const PKG_PATH = path.join(__dirname, '..', 'Destiny (USA, Korea) (En,Fr,De,Es,It,Pt)', 'PS3_GAME', 'USRDIR', 'packages', 'ps3_globals_0151_0.pkg');

async function dumpTable() {
    const handle = await fs.promises.open(PKG_PATH, 'r');
    const start = 0xA180;
    const count = 337;
    const entrySize = 16;
    const buffer = Buffer.alloc(count * entrySize);
    await handle.read(buffer, 0, buffer.length, start);
    await handle.close();

    console.log(`--- Table Dump at 0x${start.toString(16)} ---`);
    for (let i = 0; i < 20; i++) {
        const pos = i * entrySize;
        const row = buffer.toString('hex', pos, pos + entrySize);
        console.log(`${(start + pos).toString(16).padStart(5, '0')}: ${row}`);
    }
}

dumpTable();
