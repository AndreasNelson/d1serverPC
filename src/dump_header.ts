import * as fs from 'fs';
import * as path from 'path';

const PKG_PATH = path.join(__dirname, '..', 'Destiny (USA, Korea) (En,Fr,De,Es,It,Pt)', 'PS3_GAME', 'USRDIR', 'packages', 'ps3_globals_0151_0.pkg');

async function dumpHeader() {
    const handle = await fs.promises.open(PKG_PATH, 'r');
    const buffer = Buffer.alloc(100 * 1024); // 100KB
    await handle.read(buffer, 0, buffer.length, 0);
    await handle.close();

    console.log('--- Deep Header Scan ---');
    
    // Look for repeating 16-byte patterns that look like [Hash][Offset][Size][CompSize]
    for (let i = 0; i < buffer.length - 256; i += 4) {
        let matches = 0;
        for (let j = 0; j < 5; j++) {
            const pos = i + (j * 16);
            const offset = buffer.readUInt32BE(pos + 4);
            const size = buffer.readUInt32BE(pos + 8);
            
            // Heuristic: Offset should be increasing or pointing into data, size shouldn't be zero
            if (offset > 0x1000 && offset < 0xFFFFFFFF && size > 0 && size < 0x10000000) {
                matches++;
            }
        }
        
        if (matches >= 4) {
            console.log(`Found potential table at 0x${i.toString(16)}`);
            for (let k = 0; k < 3; k++) {
                const p = i + (k * 16);
                console.log(`  ${(i+k*16).toString(16)}: ${buffer.toString('hex', p, p+16)}`);
            }
            // Skip ahead
            i += 16 * 5;
        }
    }
}

dumpHeader();
