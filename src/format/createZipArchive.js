import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

/**
 * Creates a .mod (ZIP) archive for Fantasy Grounds from XML files.
 * 
 * @param {string} outputDir - Directory containing the XML files
 * @param {string} sectorName - The name of the sector
 * @param {string} outputFilePath - Full path to the output .mod file
 * @param {(msg: string) => void} onMessage - Optional logger callback
 */
export async function createZipArchive(outputDir, sectorName, outputFilePath, onMessage = () => { }) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        console.log(`Creating ZIP archive at: ${outputFilePath}`);

        output.on('close', () => {
            onMessage(`📦 Created ZIP archive: ${outputFilePath} (${archive.pointer()} bytes)`);
            resolve();
        });

        archive.on('error', err => reject(err));

        archive.pipe(output);

        // Add expected files for Fantasy Grounds module
        archive.file(path.join(outputDir, 'definition.xml'), { name: 'definition.xml' });
        archive.file(path.join(outputDir, `${sectorName} Worlds.xml`), { name: `${sectorName} Worlds.xml` });

        archive.finalize();
    });
}