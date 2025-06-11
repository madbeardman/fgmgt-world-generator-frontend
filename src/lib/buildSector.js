import { fetchSectorMetadata } from '../fetch/fetchSector.js';
import { fetchSubsector } from '../fetch/fetchSubsector.js';
import { readLine } from '../format/readLine.js';
import { systemFormatter } from '../format/systemFormatter.js';
import { xmlFormatter } from '../format/xmlFormatter.js';
import { createXMLDefinitionFile } from '../format/createXMLDefinitionFile.js';
import { createZipArchive } from '../format/createZipArchive.js';

import fs from 'fs/promises';
import path from 'path';

function splitIntoWorldLines(raw) {
    const lines = [];
    const lineLength = 74;

    for (let i = 0; i + lineLength <= raw.length; i += lineLength) {
        lines.push(raw.slice(i, i + lineLength));
    }

    return lines;
}

/**
 * Build a sector from the TravellerMap API.
 * 
 * @param {string} sectorName - The name of the sector (e.g. "Spinward Marches")
 * @param {string} format - One of: "module", "system"
 * @param {(line: string) => void} [onMessage] - Optional callback for progress messages
 */
export async function buildSector(sectorName, format, onMessage = () => { }) {
    const cleanName = sectorName.trim();
    const formatLower = format.toLowerCase();

    const supportedFormats = ['module', 'system'];
    if (!supportedFormats.includes(formatLower)) {
        throw new Error(`Unsupported format: ${format}`);
    }

    const metadata = await fetchSectorMetadata(cleanName);
    const allLines = [];

    for (const subsector of metadata.subsectors) {
        onMessage(`📦 Fetching subsector: ${subsector.name} (${subsector.index})`);

        const raw = await fetchSubsector(cleanName, subsector.index);
        const lines = raw.split('\\r\\n').filter(line => line.trim().length > 0);
        const parsed = lines
            .map(line => readLine(cleanName, subsector.name, line, subsector.index))
            .filter(Boolean);

        onMessage(`📄 ${parsed.length} systems in ${subsector.name}`);
        allLines.push(...parsed);
    }

    onMessage(`🧰 Formatting ${allLines.length} total systems`);

    const outputDir = path.resolve('output');
    await fs.mkdir(outputDir, { recursive: true });

    let outputFilePath;
    let zipName;

    switch (formatLower) {
        case 'system':
            outputFilePath = path.join(outputDir, `${cleanName} systems.txt`);
            break;
        case 'module':
        default:
            zipName = `${cleanName} Worlds Module.mod`; // final .mod output
            break;
    }


    switch (formatLower) {
        case 'system':
            await systemFormatter(allLines, outputFilePath, onMessage);
            break;
        case 'module':
        default:
            await xmlFormatter(allLines, outputDir, cleanName, onMessage);
            await createXMLDefinitionFile(outputDir, cleanName, onMessage);
            const zipPath = path.join(outputDir, zipName);
            await createZipArchive(outputDir, zipPath, onMessage);
            return zipPath; // return the .mod path
    }

    onMessage(`✅ Build complete: ${cleanName} (${formatLower})`);
    return outputFilePath;
}