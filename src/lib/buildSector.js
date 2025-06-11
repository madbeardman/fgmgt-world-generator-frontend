import { fetchSectorMetadata } from '../fetch/fetchSector.js';
import { fetchSubsector } from '../fetch/fetchSubsector.js';
import { readLine } from '../format/readLine.js';
import { systemFormatter } from '../format/systemFormatter.js';
import { xmlFormatter } from '../format/xmlFormatter.js';
import { refManualFormatter } from '../format/refManualFormatter.js';
import { createXMLDefinitionFile } from '../format/createXMLDefinitionFile.js';
import { createZipArchive } from '../format/createZipArchive.js';

import fs from 'fs/promises';
import path from 'path';

/**
 * Build a sector from the TravellerMap API.
 * 
 * @param {string} sectorName - The name of the sector (e.g. "Spinward Marches")
 * @param {string} format - One of: "module", "system", "refmanual"
 * @param {(line: string) => void} [onMessage] - Optional callback for progress messages
 */
export async function buildSector(sectorName, format, onMessage = () => { }) {
    const cleanName = sectorName.trim();
    const formatLower = format.toLowerCase();

    const supportedFormats = ['module', 'system', 'refmanual'];
    if (!supportedFormats.includes(formatLower)) {
        throw new Error(`Unsupported format: ${format}`);
    }

    const metadata = await fetchSectorMetadata(cleanName);
    const allLines = [];

    for (const subsector of metadata.subsectors) {
        onMessage(`📦 Fetching subsector: ${subsector.name} (${subsector.index})`);

        const raw = await fetchSubsector(cleanName, subsector.index);
        const lines = raw.split('\n').filter(Boolean);
        const parsed = lines.map(readLine).filter(Boolean);

        onMessage(`📄 ${parsed.length} systems in ${subsector.name}`);
        allLines.push(...parsed);
    }

    onMessage(`🧰 Formatting ${allLines.length} total systems`);

    const outputDir = path.resolve('output');
    await fs.mkdir(outputDir, { recursive: true });

    const outputFileName = `${cleanName} Worlds ${formatLower.charAt(0).toUpperCase() + formatLower.slice(1)}.mod`;
    const outputFilePath = path.join(outputDir, outputFileName);

    switch (formatLower) {
        case 'system':
            await systemFormatter(allLines, outputFilePath, onMessage);
            break;
        case 'refmanual':
            await refManualFormatter(allLines, outputFilePath, onMessage);
            break;
        case 'module':
        default:
            await xmlFormatter(allLines, outputDir, cleanName, onMessage);
            await createXMLDefinitionFile(outputDir, cleanName, onMessage);
            await createZipArchive(outputDir, cleanName, outputFilePath, onMessage);
            break;
    }

    onMessage(`✅ Build complete: ${cleanName} (${formatLower})`);
    return outputFilePath;
}