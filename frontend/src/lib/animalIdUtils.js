// Utility functions for base64 encoding/decoding animal IDs

/**
 * Encode animal ID to base64 for safe URL usage
 * @param {string} animalId - Original animal ID (e.g., "250919/Anjing/003")
 * @returns {string} base64 encoded ID
 */
export const encodeAnimalId = (animalId) => {
    try {
        return btoa(animalId);
    } catch (error) {
        console.error('Error encoding animal ID:', error);
        return animalId;
    }
};

/**
 * Decode base64 animal ID back to original format
 * @param {string} encodedId - Base64 encoded animal ID
 * @returns {string} original animal ID
 */
export const decodeAnimalId = (encodedId) => {
    try {
        return atob(encodedId);
    } catch (error) {
        console.error('Error decoding animal ID:', error);
        return encodedId;
    }
};