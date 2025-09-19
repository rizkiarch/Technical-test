// Utility functions for handling storage/image URLs

/**
 * Convert database image path to storage API URL
 * @param {string} imagePath - Image path from database (e.g., "animals/1758289705_Search-Domain-2.png")
 * @param {string} baseUrl - Base API URL (default: from env or localhost:8080)
 * @returns {string} Full storage URL or null if no image
 */
export const getStorageImageUrl = (imagePath, baseUrl = null) => {
    if (!imagePath || imagePath === '' || imagePath === null) {
        return null;
    }

    const apiBaseUrl = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:8080';
    
    // Remove "animals/" prefix if present since the endpoint already includes it
    const filename = imagePath.startsWith('animals/') 
        ? imagePath.replace('animals/', '') 
        : imagePath;
    
    return `${apiBaseUrl}/api/storage/animals/${filename}`;
};

/**
 * Extract filename from database image path
 * @param {string} imagePath - Image path from database (e.g., "animals/1758289705_Search-Domain-2.png")
 * @returns {string} Filename only (e.g., "1758289705_Search-Domain-2.png")
 */
export const getImageFilename = (imagePath) => {
    if (!imagePath) return '';
    
    return imagePath.startsWith('animals/') 
        ? imagePath.replace('animals/', '') 
        : imagePath;
};