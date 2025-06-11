import {
    TRADE_CODES,
    STARPORT_TYPE,
    SIZE,
    ATMOSPHERE_TYPE,
    HYDROGRAPHICS_TYPE,
    POPULATION_TYPE,
    GOVERNMENT_TYPE,
    LAW_LEVEL_TYPE,
    TECH_LEVEL_TYPE,
    ALLEGIANCES
} from '../utils/lookup.js';

/**
 * Maps base codes and handles special comment-based overrides.
 * @param {string} bases - Single-letter base code from the T5SS line.
 * @param {string} commentField - Comments field from the line, used to detect special flags like "RsE".
 * @returns {string} - Normalised base description (e.g. 'N S', 'Z M', or with 'RS' if RsE is present).
 */
function mapBases(bases, commentField) {
    if (bases === 'A') return 'N S';
    if (bases === 'F') return 'Z M';

    let result = bases;
    if (commentField.includes('RsE')) {
        result = result.trim() + ' RS';
    }
    return result.trim();
}

/**
 * Parses a single fixed-width T5SS data line into a structured world object.
 * 
 * @param {string} sector - The sector name (e.g. "Chronor").
 * @param {string} subsector - The subsector name (e.g. "Delta").
 * @param {string} line - A single 74-character data line from a .sec file.
 * @param {number} subsectorIndex - The numeric index of the subsector (0–15).
 * @returns {object|null} - Parsed world data object or null if invalid line.
 */
export function readLine(sector, subsector, line, subsectorIndex) {


    if (!line || line.length < 73) return null;

    const name = line.substring(0, 13).trim().replace(/_/g, ' ');
    const hex = line.substring(14, 18).trim();
    const uwp = line.substring(19, 28).trim();
    const bases = line.substring(30, 31).trim();
    const comments = line.substring(32, 47).trim();
    const zone = line.substring(48, 49).trim();
    const pbg = line.substring(51, 54).trim();
    const allegianceCode = line.substring(55, 57).trim();
    const stellar = line.substring(58, 73).trim();

    let gasGiants = parseInt(pbg.substring(2, 3));
    let gasGiant = gasGiants > 0 ? 'G' : '';

    if (!uwp || typeof uwp !== 'string' || uwp.length !== 9) return null;

    const starport = uwp[0];
    const size = uwp[1];
    const atmosphere = uwp[2];
    const hydro = uwp[3];
    const population = uwp[4];
    const government = uwp[5];
    const law = uwp[6];
    const tech = uwp[8];

    // Decode allegiance and trade codes
    const allegiance = ALLEGIANCES[allegianceCode] || '';
    const tradeCodes = comments.split(' ').filter(code => TRADE_CODES[code]).join(' ');

    return {
        name: /^[0-9]/.test(name) ? `_${name}` : name,
        sector,
        subsector,
        hex,
        uwp,
        bases: mapBases(bases, comments),
        zone,
        gasGiant,
        tradeCodes,
        allegiance,
        stellar,
        starport,
        starportText: STARPORT_TYPE[starport] || 'Unknown',
        atmosphere,
        atmosphereText: ATMOSPHERE_TYPE[atmosphere] || 'Unknown',
        size,
        sizeText: SIZE[size] || 'Unknown',
        hydro,
        hydroText: HYDROGRAPHICS_TYPE[hydro] || 'Unknown',
        population,
        populationText: POPULATION_TYPE[population] || 'Unknown',
        government,
        governmentText: GOVERNMENT_TYPE[government] || 'Unknown',
        law,
        lawText: LAW_LEVEL_TYPE[law] || 'Unknown',
        tech,
        techText: TECH_LEVEL_TYPE[tech] || 'Unknown',
        subsectorIndex,
    };
}