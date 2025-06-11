import axios from 'axios';

/**
 * Fetch sector metadata (subsector list).
 */
export async function fetchSectorMetadata(sectorName) {
    const url = `https://travellermap.com/api/metadata?sector=${encodeURIComponent(sectorName)}`;
    const res = await axios.get(url);
    const subsectors = res.data.Subsectors || [];

    return {
        subsectors: subsectors.map((s) => ({
            name: s.Name,
            index: s.Index,
        })),
    };
}