import { useState, useMemo } from 'react';
import { sortByDate, sortByString, isDateInRange, formatDate } from '../lib/dateUtils';
import ImageWithFallback from './ImageWithFallback';
import '../styles/table.css';

export default function TableComponent({ columns, data, onCheckout }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({
        name: '',
        timeRegisterStart: '',
        timeRegisterEnd: '',
        timeOutStart: '',
        timeOutEnd: ''
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            timeRegisterStart: '',
            timeRegisterEnd: '',
            timeOutStart: '',
            timeOutEnd: ''
        });
    };

    const processedData = useMemo(() => {
        let filteredData = [...data];

        if (filters.name) {
            filteredData = filteredData.filter(item =>
                item.name_animal?.toLowerCase().includes(filters.name.toLowerCase()) ||
                item.name_owner?.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        if (filters.timeRegisterStart || filters.timeRegisterEnd) {
            filteredData = filteredData.filter(item =>
                isDateInRange(item.time_register, filters.timeRegisterStart, filters.timeRegisterEnd)
            );
        }

        if (filters.timeOutStart || filters.timeOutEnd) {
            filteredData = filteredData.filter(item =>
                isDateInRange(item.time_out, filters.timeOutStart, filters.timeOutEnd)
            );
        }

        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                if (sortConfig.key === 'time_register' || sortConfig.key === 'time_out') {
                    return sortByDate(a, b, sortConfig.key, sortConfig.direction);
                } else if (sortConfig.key === 'name_animal' || sortConfig.key === 'name_owner') {
                    return sortByString(a, b, sortConfig.key, sortConfig.direction);
                }
                return 0;
            });
        }

        return filteredData;
    }, [data, filters, sortConfig]);

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return '↕️';
        }
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filter & Search</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search by Name (Animal/Owner)
                        </label>
                        <input
                            type="text"
                            value={filters.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                            placeholder="Enter name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Register Time Range
                        </label>
                        <div className="space-y-2">
                            <input
                                type="datetime-local"
                                value={filters.timeRegisterStart}
                                onChange={(e) => handleFilterChange('timeRegisterStart', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="datetime-local"
                                value={filters.timeRegisterEnd}
                                onChange={(e) => handleFilterChange('timeRegisterEnd', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-out Time Range
                        </label>
                        <div className="space-y-2">
                            <input
                                type="datetime-local"
                                value={filters.timeOutStart}
                                onChange={(e) => handleFilterChange('timeOutStart', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="datetime-local"
                                value={filters.timeOutEnd}
                                onChange={(e) => handleFilterChange('timeOutEnd', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Clear All Filters
                    </button>
                    <span className="ml-4 text-sm text-gray-600">
                        Showing {processedData.length} of {data.length} records
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.accessor}
                                    className={`px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${['name_animal', 'name_owner', 'time_register', 'time_out'].includes(column.accessor)
                                        ? 'cursor-pointer hover:bg-gray-100'
                                        : ''
                                        }`}
                                    onClick={() => {
                                        if (['name_animal', 'name_owner', 'time_register', 'time_out'].includes(column.accessor)) {
                                            handleSort(column.accessor);
                                        }
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        {column.header}
                                        {['name_animal', 'name_owner', 'time_register', 'time_out'].includes(column.accessor) && (
                                            <span className="ml-2">{getSortIcon(column.accessor)}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {processedData.length > 0 ? (
                            processedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    {columns.map((column) => (
                                        <td
                                            key={column.accessor}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200"
                                        >
                                            {column.accessor === 'image' ? (
                                                <ImageWithFallback
                                                    src={row[column.accessor]}
                                                    alt="Animal"
                                                    className="w-16 h-16 object-cover rounded-md"
                                                    fallbackText="No Image"
                                                />
                                            ) : column.accessor === 'time_register' || column.accessor === 'time_out' ? (
                                                formatDate(row[column.accessor])
                                            ) : (
                                                row[column.accessor]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}