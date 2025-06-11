import fs from 'fs/promises';
import path from 'path';

/**
 * Formats a parsed system as a Fantasy Grounds-compatible XML node.
 * @param {object} data - Parsed system data from readLine
 * @param {number} index - Position in the list (used for unique ID tag)
 * @returns {string}
 */
function formatAsXml(data, index) {
    const nodeId = `id-${(index + 1).toString().padStart(5, '0')}`;
    return (
        `     <${nodeId}>\r\n` +
        `       <sector type="string">${data.sector}</sector>\r\n` +
        `       <subsector type="string">${data.subsector}</subsector>\r\n` +
        `       <atmosphere_type type="string">${data.atmosphere}</atmosphere_type>\r\n` +
        `       <atmosphere_type_text type="string">${data.atmosphereText}</atmosphere_type_text>\r\n` +
        `       <bases type="string">${data.bases}</bases>\r\n` +
        `       <goodslist>\r\n` +
        `       </goodslist>\r\n` +
        `       <government_type type="string">${data.government}</government_type>\r\n` +
        `       <government_type_text type="string">${data.governmentText}</government_type_text>\r\n` +
        `       <hexlocation type="string">${data.hex}</hexlocation>\r\n` +
        `       <hydrographics type="string">${data.hydro}</hydrographics>\r\n` +
        `       <hydrographics_text type="string">${data.hydroText}</hydrographics_text>\r\n` +
        `       <law_level type="string">${data.law}</law_level>\r\n` +
        `       <law_level_text type="string">${data.lawText}</law_level_text>\r\n` +
        `       <name type="string">${data.name}</name>\r\n` +
        `       <population type="string">${data.population}</population>\r\n` +
        `       <population_text type="string">${data.populationText}</population_text>\r\n` +
        `       <size type="string">${data.size}</size>\r\n` +
        `       <size_text type="string">${data.sizeText}</size_text>\r\n` +
        `       <starport_quality type="string">${data.starport}</starport_quality>\r\n` +
        `       <starport_quality_text type="string">${data.starportText}</starport_quality_text>\r\n` +
        `       <tech_level type="string">${data.tech}</tech_level>\r\n` +
        `       <tech_level_text type="string">${data.techText}</tech_level_text>\r\n` +
        `       <trade_codes type="string">${data.tradeCodes}</trade_codes>\r\n` +
        `       <travel_code type="string">${data.zone}</travel_code>\r\n` +
        `       <uwp type="string">${data.uwp}</uwp>\r\n` +
        `     </${nodeId}>\r\n`
    );
}

/**
 * Writes a Fantasy Grounds-compatible XML database for the systems list.
 *
 * @param {Array<object>} systems - Parsed systems from readLine
 * @param {string} outputDir - Directory to write db.xml to
 * @param {string} sectorName - Sector name for context
 * @param {(msg: string) => void} onMessage - Optional log callback
 */
export async function xmlFormatter(systems, outputDir, sectorName, onMessage = () => { }) {
    const filePath = path.join(outputDir, 'db.xml');
    const name = sectorName.replace(/\s/g, '').toLowerCase() + 'worldsdata';

    const entries = systems.map((system, i) => formatAsXml(system, i));

    const xml = `<?xml version="1.0" encoding="iso-8859-1"?>\r\n` +
        `<root version="3.3" release="1|CoreRPG:4">\r\n` +
        `  <library>\r\n` +
        `    <worldsdata static="true">\r\n` +
        `      <categoryname type="string"></categoryname>\r\n` +
        `      <name type="string">${name}</name>\r\n` +
        `      <entries>\r\n` +
        `        <worlds>\r\n` +
        `          <librarylink type="windowreference">\r\n` +
        `            <class>reference_list</class>\r\n` +
        `            <recordname>..</recordname>\r\n` +
        `          </librarylink>\r\n` +
        `          <name type="string">Worlds</name>\r\n` +
        `          <recordtype type="string">worlds</recordtype>\r\n` +
        `        </worlds>\r\n` +
        `      </entries>\r\n` +
        `    </worldsdata>\r\n` +
        `  </library>\r\n` +
        `  <worlds>\r\n` +
        `  <category name="" baseicon="0" decalicon="0">\r\n` +
        `${entries.join('')}` +
        `    </category>\r\n` +
        `  </worlds>\r\n` +
        `</root>\r\n`

    await fs.writeFile(filePath, xml, 'latin1'); // iso-8859-1 encoding
    onMessage(`🧾 XML file written to ${filePath}`);
}