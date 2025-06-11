import {
    ATMOSPHERE_TYPE,
    GOVERNMENT_TYPE,
    LAW_LEVEL_TYPE,
    STARPORT_TYPE,
    TECH_LEVEL_TYPE,
} from '../utils/lookup.js';

/**
 * Parses a single T5SS data line.
 * @param {string} line
 * @returns {object|null}
 */
export function readLine(line) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 10) return null;

    const [name, hex, uwp, base, zone, popMult, allegiance, stellar] = parts;

    return {
        name: name.replace(/_/g, ' '),
        hex,
        uwp,
        base,
        zone,
        popMult,
        allegiance,
        stellar,

        // Derived values
        starport: STARPORT_TYPE[uwp[0]] || 'Unknown',
        atmosphere: ATMOSPHERE_TYPE[uwp[1]] || 'Unknown',
        hydrographics: uwp[3] !== 'X' ? parseInt(uwp[3], 16) : null,
        population: uwp[4] !== 'X' ? parseInt(uwp[4], 16) : null,
        government: GOVERNMENT_TYPE[uwp[5]] || 'Unknown',
        law: LAW_LEVEL_TYPE[uwp[6]] || 'Unknown',
        tech: TECH_LEVEL_TYPE[uwp[8]] || 'Unknown',
    };
}