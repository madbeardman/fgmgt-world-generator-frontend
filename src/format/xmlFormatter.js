import fs from 'fs/promises';
import path from 'path';

/**
 * Creates a basic XML file for the given system data.
 *
 * @param {Array<object>} systems - Parsed systems from readLine
 * @param {string} outputDir - Directory to write the XML files to
 * @param {string} sectorName - Sector name (used in filenames/titles)
 * @param {(msg: string) => void} onMessage - Optional progress callback
 */
export async function xmlFormatter(systems, outputDir, sectorName, onMessage = () => { }) {
    const filePath = path.join(outputDir, `${sectorName} Worlds.xml`);

    const entries = systems.map(system => {
        return `  <world hex="${system.hex}" name="${system.name}" uwp="${system.uwp}" />`;
    });

    const xml = `<?xml version="1.0" encoding="utf-8"?>
<worlds>
${entries.join('\n')}
</worlds>`;

    await fs.writeFile(filePath, xml, 'utf8');
    onMessage(`🧾 XML file written to ${filePath}`);
}