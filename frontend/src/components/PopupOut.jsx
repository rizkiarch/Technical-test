import { useState } from 'react';
import '../styles/modal.css';
import { formatRupiah } from '@/lib/formatRupiah';

const PopupOut = ({ isOpen, onClose, onSubmit, selectedAnimal }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutTime, setCheckoutTime] = useState(() => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    });

    const calculateDuration = () => {
        const timeRegister = selectedAnimal?.time_register || selectedAnimal?.time_registered;
        if (!timeRegister) return null;

        const start = new Date(timeRegister);
        const end = new Date(checkoutTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
            return null;
        }

        const diffMs = end - start;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return { days: diffDays, hours: diffHours, minutes: diffMinutes };
    };

    const calculateCost = () => {
        const timeRegister = selectedAnimal?.time_register || selectedAnimal?.time_registered;
        if (!timeRegister) return 0;

        const start = new Date(timeRegister);
        const end = new Date(checkoutTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
            return 0;
        }

        const diffMs = end - start;
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
        const ratePerHour = 100000;

        return ratePerHour * diffHours;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedAnimal) return;

        const start = new Date(selectedAnimal.time_register || selectedAnimal.time_registered);
        const end = new Date(checkoutTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
            alert('Invalid checkout time. Please select a time after the registration time.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formattedTimeOut = new Date(checkoutTime).toISOString().slice(0, 19).replace('T', ' ');

            const submitData = {
                time_out: formattedTimeOut
            };

            await onSubmit(selectedAnimal.id, submitData);
            onClose();
        } catch (error) {
            console.error('Error checking out animal:', error);
            alert('Failed to check out animal. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            const now = new Date();
            setCheckoutTime(now.toISOString().slice(0, 16));
            onClose();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen || !selectedAnimal) return null;

    const duration = calculateDuration();
    const cost = calculateCost();
    const timeRegister = selectedAnimal.time_register || selectedAnimal.time_registered;
    const registrationDate = new Date(timeRegister);

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Check Out Animal</h3>
                    <button
                        className="modal-close"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Animal Information */}
                        <div className="alert alert-info mb-4">
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: '600' }}>
                                Animal Information
                            </h4>
                            <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                                <div><strong>Name:</strong> {selectedAnimal.name_animal}</div>
                                <div><strong>Owner:</strong> {selectedAnimal.name_owner}</div>
                                <div><strong>Type:</strong> {selectedAnimal.type_animal}</div>
                                <div><strong>Weight:</strong> {selectedAnimal.weight} kg</div>
                                <div><strong>Registered:</strong> {registrationDate.toLocaleString('id-ID')}</div>
                            </div>
                        </div>

                        {/* Checkout Time */}
                        <div className="form-group">
                            <label className="form-label">Check-out Time *</label>
                            <input
                                type="datetime-local"
                                value={checkoutTime}
                                min={timeRegister?.slice(0, 16)}
                                onChange={(e) => setCheckoutTime(e.target.value)}
                                className="form-input"
                                disabled={isSubmitting}
                                required
                            />
                            <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '4px' }}>
                                Checkout time must be after: {registrationDate.toLocaleString('id-ID')}
                            </div>
                        </div>

                        {/* Duration and Cost Display */}
                        {duration && (
                            <div className="form-grid form-grid-2">
                                <div className="alert alert-success">
                                    <h5 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', fontWeight: '600' }}>
                                        Duration
                                    </h5>
                                    <div style={{ fontSize: '0.875rem' }}>
                                        {duration.days > 0 && `${duration.days} day${duration.days > 1 ? 's' : ''} `}
                                        {duration.hours > 0 && `${duration.hours} hour${duration.hours > 1 ? 's' : ''} `}
                                        {duration.minutes > 0 && `${duration.minutes} minute${duration.minutes > 1 ? 's' : ''}`}
                                        {duration.days === 0 && duration.hours === 0 && duration.minutes === 0 && 'Less than 1 minute'}
                                    </div>
                                </div>

                                <div className="alert alert-warning">
                                    <h5 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', fontWeight: '600' }}>
                                        Total Cost
                                    </h5>
                                    <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                                        {formatRupiah(cost)}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#744210', marginTop: '2px' }}>
                                        Rate: IDR 100,000/hour
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Warning for invalid time */}
                        {checkoutTime && new Date(checkoutTime) <= new Date(timeRegister) && (
                            <div className="alert alert-error">
                                ⚠️ Checkout time must be after registration time
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            {isSubmitting ? 'Processing...' : `Check Out (${formatRupiah(cost)})`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PopupOut;