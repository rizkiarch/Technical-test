import { useState, useEffect, useCallback } from 'react';
import TableComponentNew from "../../components/TableComponentNew";
import PopupRegister from "../../components/PopupRegister";
import PopupOut from "../../components/PopupOut";
import '../../styles/global.css';
import { formatRupiah } from '@/lib/formatRupiah';
import { mapAnimalsArray } from '../../lib/dataMapper';
import { encodeAnimalId } from '../../lib/animalIdUtils';

export default function Animals() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    const calculateCostTotal = (timeRegister, timeOut, ratePerHour = 100000) => {
        if (!timeRegister || !timeOut) return 0;

        const start = new Date(timeRegister);
        const end = new Date(timeOut);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

        const diffMs = end - start;
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
        return ratePerHour * diffHours;
    };

    const getList = useCallback(async () => {
        try {
            setLoading(true);
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

            // Add cache-busting timestamp to prevent caching
            const timestamp = new Date().getTime();
            const response = await fetch(`${baseUrl}/api/animals?_t=${timestamp}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Raw API Response:', result);

            let rawData = [];
            if (result.data?.data) {
                rawData = result.data.data;
            } else if (result.data) {
                rawData = result.data;
            } else if (Array.isArray(result)) {
                rawData = result;
            }

            const mappedData = mapAnimalsArray(rawData);

            const processedData = mappedData.map(animal => ({
                ...animal,
                cost_total: formatRupiah(calculateCostTotal(animal.time_register, animal.time_out))
            }));

            setAnimals(processedData);
            setError(null);
        } catch (error) {
            console.error('Error fetching animals:', error);
            setError(error.message);

            setAnimals([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getList();
    }, [getList]);

    const handleRegisterAnimal = async (formData) => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

            // Send FormData to API
            const response = await fetch(`${baseUrl}/api/animals`, {
                method: 'POST',
                body: formData // FormData automatically sets correct headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Animal registered:', result);

            // Refresh the list to get updated data from server
            await getList();

            alert('Animal registered successfully!');
        } catch (error) {
            console.error('Error registering animal:', error);
            alert(`Failed to register animal: ${error.message}`);
            throw error;
        }
    };

    const handleCheckoutAnimal = async (animalId, checkoutData) => {
        try {
            // Use port 8080 (KrakenD) with base64 encoding for IDs with special characters
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

            // Encode the animalId using base64 to handle slashes and special characters
            const encodedId = encodeAnimalId(animalId);

            // Send checkout request to API
            const response = await fetch(`${baseUrl}/api/animals/${encodedId}/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkoutData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Animal checked out:', result);

            // Refresh the list to get updated data from server
            await getList();

            alert('Animal checked out successfully!');
        } catch (error) {
            console.error('Error checking out animal:', error);
            alert(`Failed to check out animal: ${error.message}`);
            throw error;
        }
    };

    const handleDeleteAnimal = async (animalId) => {
        // Confirm deletion
        const isConfirmed = window.confirm(
            'Are you sure you want to delete this animal record? This action cannot be undone.'
        );

        if (!isConfirmed) return;

        try {
            // Use port 8080 (KrakenD) with base64 encoding for IDs with special characters
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

            // Encode the animalId using base64 to handle slashes and special characters
            const encodedId = encodeAnimalId(animalId);

            // Send delete request to API
            const response = await fetch(`${baseUrl}/api/animals/${encodedId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            console.log('Animal deleted:', animalId);

            // Refresh the list to get updated data from server
            await getList();

            alert('Animal record deleted successfully!');
        } catch (error) {
            console.error('Error deleting animal:', error);
            alert(`Failed to delete animal: ${error.message}`);
            throw error;
        }
    };

    const handleOpenCheckout = (animal) => {
        setSelectedAnimal(animal);
        setShowCheckoutModal(true);
    };

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Image', accessor: 'image' },
        { header: 'Type', accessor: 'type_animal' },
        { header: 'Animal Name', accessor: 'name_animal' },
        { header: 'Owner Name', accessor: 'name_owner' },
        { header: 'Phone', accessor: 'no_telp_owner' },
        { header: 'Email', accessor: 'email_owner' },
        { header: 'Register Time', accessor: 'time_register' },
        { header: 'Check-out Time', accessor: 'time_out' },
        { header: 'Price', accessor: 'price' },
        { header: 'Total Cost', accessor: 'cost_total' },
    ];

    if (loading) {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div className="spinner"></div>
                    <p className="mt-4">Loading pet records...</p>
                </div>
            </div>
        );
    }

    if (error && animals.length === 0) {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 className="mb-2">Error Loading Data</h2>
                    <p className="mb-4">{error}</p>
                    <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>Using mock data for demonstration</p>
                    <button
                        onClick={getList}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div className="mb-8">
                    <h1>Pet Care Management System</h1>
                    <p>Manage and track pet registrations, check-ins, and check-outs with advanced sorting and filtering</p>

                    {error && (
                        <div className="alert alert-warning mt-4">
                            <p style={{ fontSize: '0.875rem' }}>
                                ⚠️ API connection failed. Using mock data for demonstration. Error: {error}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
                    <div className="flex justify-between align-center mb-6">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                            Pet Records ({animals.length} total)
                        </h2>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowRegisterModal(true)}
                                className="btn btn-success"
                            >
                                Add New Animal
                            </button>
                            <button
                                onClick={getList}
                                className="btn btn-primary"
                            >
                                Refresh Data
                            </button>
                        </div>
                    </div>

                    <TableComponentNew
                        columns={columns}
                        data={animals}
                        onCheckout={handleOpenCheckout}
                        onDelete={handleDeleteAnimal}
                    />
                </div>
            </div>

            {/* Register Modal */}
            <PopupRegister
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSubmit={handleRegisterAnimal}
            />

            {/* Checkout Modal */}
            <PopupOut
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                onSubmit={handleCheckoutAnimal}
                selectedAnimal={selectedAnimal}
            />
        </div>
    );
}