import fs from 'fs';
import path from 'path';

/**
 * Create the required Fantasy Grounds definition.xml file.
 * @param {string} outputDir - Directory to write the file to
 * @param {string} name - Module name (e.g. "Spinward Marches Worlds")
 */
export function createXMLDefinitionFile(outputDir, name) {
    const xml = `<?xml version="1.0" encoding="iso-8859-1"?>
<root>
  <name>${name}</name>
  <author>Traveller Data Generator</author>
  <category>Traveller</category>
  <ruleset>Traveller</ruleset>
</root>
`;

    const filePath = path.join(outputDir, 'definition.xml');
    fs.writeFileSync(filePath, xml, 'latin1'); // Latin-1 encoding for FG compatibility
}