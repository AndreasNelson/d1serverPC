import koffi from 'koffi';
import * as path from 'path';

// Load the Oodle DLL
const dllPath = path.join(process.cwd(), 'oo2core_3_win64.dll');
const lib = koffi.load(dllPath);

/**
 * int OodleLZ_Decompress(
 *   const void * srcBuf,
 *   size_t srcLen,
 *   void * dstBuf,
 *   size_t dstLen,
 *   int fuzz,
 *   int crc,
 *   int verbose,
 *   void * dstBase,
 *   size_t e,
 *   void * cb,
 *   void * cbCtx,
 *   void * scratch,
 *   size_t scratchSize,
 *   int threadPhase
 * )
 */
const OodleLZ_Decompress = lib.func('int OodleLZ_Decompress(const void *srcBuf, size_t srcLen, void *dstBuf, size_t dstLen, int fuzz, int crc, int verbose, void *dstBase, size_t e, void *cb, void *cbCtx, void *scratch, size_t scratchSize, int threadPhase)');

export function decompress(src: Buffer, dstLen: number): Buffer {
    const dst = Buffer.alloc(dstLen);
    
    const result = OodleLZ_Decompress(
        src, src.length, 
        dst, dstLen,
        0, 0, 0, null, 0, null, null, null, 0, 0
    );

    if (result <= 0) {
        throw new Error(`Oodle decompression failed with code: ${result}`);
    }

    return dst;
}
