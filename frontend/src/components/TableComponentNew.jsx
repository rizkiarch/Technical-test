import { useState, useMemo } from 'react';
import { sortByDate, sortByString, isDateInRange, formatDate } from '../lib/dateUtils';
import ImageWithFallback from './ImageWithFallback';
import '../styles/table.css';

export default function TableComponent({ columns, data, onCheckout, onDelete }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({
        name: '',
        timeRegisterStart: '',
        timeRegisterEnd: '',
        timeOutStart: '',
        timeOutEnd: ''
    });

    console.log('Data in TableComponent:', data);
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
        <div className="table-container">
            <div className="filter-section">
                <h3 className="filter-title">Filter & Search</h3>

                <div className="filter-grid">
                    <div className="form-group">
                        <label className="form-label">
                            Search by Name (Animal/Owner)
                        </label>
                        <input
                            type="text"
                            value={filters.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                            placeholder="Enter name..."
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Register Time Range
                        </label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <input
                                type="datetime-local"
                                value={filters.timeRegisterStart}
                                onChange={(e) => handleFilterChange('timeRegisterStart', e.target.value)}
                                className="form-input"
                                placeholder="Start date"
                            />
                            <input
                                type="datetime-local"
                                value={filters.timeRegisterEnd}
                                onChange={(e) => handleFilterChange('timeRegisterEnd', e.target.value)}
                                className="form-input"
                                placeholder="End date"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Check-out Time Range
                        </label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <input
                                type="datetime-local"
                                value={filters.timeOutStart}
                                onChange={(e) => handleFilterChange('timeOutStart', e.target.value)}
                                className="form-input"
                                placeholder="Start date"
                            />
                            <input
                                type="datetime-local"
                                value={filters.timeOutEnd}
                                onChange={(e) => handleFilterChange('timeOutEnd', e.target.value)}
                                className="form-input"
                                placeholder="End date"
                            />
                        </div>
                    </div>
                </div>

                <div className="filter-actions">
                    <button
                        onClick={clearFilters}
                        className="btn btn-secondary"
                    >
                        Clear All Filters
                    </button>
                    <span className="filter-count">
                        Showing {processedData.length} of {data.length} records
                    </span>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.accessor}
                                    className={
                                        ['name_animal', 'name_owner', 'time_register', 'time_out'].includes(column.accessor)
                                            ? 'sortable'
                                            : ''
                                    }
                                    onClick={() => {
                                        if (['name_animal', 'name_owner', 'time_register', 'time_out'].includes(column.accessor)) {
                                            handleSort(column.accessor);
                                        }
                                    }}
                                >
                                    <div className="sort-indicator">
                                        {column.header}
                                        {['name_animal', 'name_owner', 'time_register', 'time_out'].includes(column.accessor) && (
                                            <span className="sort-icon">{getSortIcon(column.accessor)}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedData.length > 0 ? (
                            processedData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column) => (
                                        <td key={column.accessor}>
                                            {column.accessor === 'image' ? (
                                                <ImageWithFallback
                                                    src={row[column.accessor]}
                                                    alt="Animal"
                                                    className="table-image"
                                                    fallbackText="No Image"
                                                />
                                            ) : column.accessor === 'time_register' || column.accessor === 'time_out' ? (
                                                <span className="table-date">
                                                    {row[column.accessor] ? formatDate(row[column.accessor]) : '-'}
                                                </span>
                                            ) : (
                                                row[column.accessor]
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {!row.time_out ? (
                                                <button
                                                    onClick={() => onCheckout && onCheckout(row)}
                                                    className="btn btn-success btn-small"
                                                    title="Check Out"
                                                >
                                                    Check Out
                                                </button>
                                            ) : (
                                                <span className="status-badge status-checkout">
                                                    Checked Out
                                                </span>
                                            )}

                                            <button
                                                onClick={() => onDelete && onDelete(row.id)}
                                                className="btn btn-danger btn-small"
                                                title="Delete Animal Record"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="table-empty">
                                    <div className="table-empty-icon">🐾</div>
                                    <div className="table-empty-text">No data found</div>
                                    <div className="table-empty-subtext">Try adjusting your filters</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}