import fs from 'fs';
import path from 'path';

/**
 * Create the required Fantasy Grounds definition.xml file.
 * @param {string} outputDir - Directory to write the file to
 * @param {string} name - Module name (e.g. "Spinward Marches Worlds")
 */
export function createXMLDefinitionFile(outputDir, name) {
  const xml = `<?xml version="1.0" encoding="iso-8859-1"?>
<root version="3.3" release="1|CoreRPG:4">
  <name>${name} Systems Data</name>
  <author>Sector System Data Generator</author>
  <category></category>
  <ruleset>MGT2</ruleset>
</root>
`;

  const filePath = path.join(outputDir, 'definition.xml');
  fs.writeFileSync(filePath, xml, 'latin1'); // Latin-1 encoding for FG compatibility
}