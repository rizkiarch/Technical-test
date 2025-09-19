// Utility functions for mapping backend data to frontend format
import { getStorageImageUrl } from './storageUtils';

export const mapAnimalData = (backendData) => {
    // Handle image URL conversion
    const imageUrl = getStorageImageUrl(backendData.photo || backendData.image);

    return {
        id: backendData.id,
        image: imageUrl, // Convert database path to storage API URL
        type_animal: backendData.category?.type || 'Unknown',
        name_animal: backendData.name_animal,
        name_owner: backendData.name_owner,
        no_telp_owner: backendData.phone_owner,
        email_owner: backendData.email_owner,
        weight: backendData.weight || '-',
        time_register: backendData.time_registered,
        time_out: backendData.time_out,
        price: backendData.price || '-',
        cost_total: backendData.cost_total || 'Rp 0,00',
        created_at: backendData.created_at,
        updated_at: backendData.updated_at
    };
};

export const mapAnimalsArray = (backendArray) => {
    if (!Array.isArray(backendArray)) {
        console.warn('Expected array but got:', typeof backendArray);
        return [];
    }

    return backendArray.map(mapAnimalData);
};