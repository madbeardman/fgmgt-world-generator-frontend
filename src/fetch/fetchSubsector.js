import axios from 'axios';

/**
 * Fetch a single subsector's data from the TravellerMap API.
 *
 * @param {string} sector - The name of the sector (e.g. "Spinward Marches")
 * @param {string} subsector - The index of the subsector (e.g. "A")
 * @returns {Promise<string>} - Raw data string
 */
export async function fetchSubsector(sector, subsector) {
    const url = `https://travellermap.com/data/${encodeURIComponent(sector)}/${encodeURIComponent(subsector)}/sec?header=0&metadata=0`;

    const response = await axios.get(url, {
        responseType: 'text',
    });

    return response.data;
}