import { useState } from 'react';
import '../styles/modal.css';

const PopupRegister = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name_animal: '',
        name_owner: '',
        type_animal: '',
        no_telp_owner: '',
        email_owner: '',
        time_register: '',
        photo: null
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'photo') {
            const file = files[0];
            if (file) {
                const maxSize = 2 * 1024 * 1024;
                if (file.size > maxSize) {
                    setErrors(prev => ({
                        ...prev,
                        photo: 'File size must be less than 2MB'
                    }));
                    return;
                }

                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    setErrors(prev => ({
                        ...prev,
                        photo: 'Only JPEG, PNG, and GIF files are allowed'
                    }));
                    return;
                }

                setFormData(prev => ({
                    ...prev,
                    photo: file
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    photo: null
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name_animal.trim()) {
            newErrors.name_animal = 'Animal name is required';
        }

        if (!formData.name_owner.trim()) {
            newErrors.name_owner = 'Owner name is required';
        }

        if (!formData.type_animal.trim()) {
            newErrors.type_animal = 'Animal type is required';
        }

        if (!formData.no_telp_owner.trim()) {
            newErrors.no_telp_owner = 'Phone number is required';
        } else if (!/^[0-9+\-\s()]+$/.test(formData.no_telp_owner)) {
            newErrors.no_telp_owner = 'Invalid phone number format';
        }

        if (!formData.email_owner.trim()) {
            newErrors.email_owner = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_owner)) {
            newErrors.email_owner = 'Invalid email format';
        }

        if (!formData.time_register.trim()) {
            newErrors.time_register = 'Registration time is required';
        }

        if (formData.photo && formData.photo.size > 2 * 1024 * 1024) {
            newErrors.photo = 'Photo size must be less than 2MB';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();

            submitData.append('name_animal', formData.name_animal);
            submitData.append('name_owner', formData.name_owner);
            submitData.append('category', formData.type_animal); // API expects 'category' not 'type_animal'
            submitData.append('phone_owner', formData.no_telp_owner); // API expects 'phone_owner'
            submitData.append('email_owner', formData.email_owner);

            if (formData.time_register) {
                const dateTime = new Date(formData.time_register);
                const formattedDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');
                submitData.append('time_registered', formattedDateTime);
            }

            if (formData.photo) {
                submitData.append('photo', formData.photo);
            }

            await onSubmit(submitData);

            setFormData({
                name_animal: '',
                name_owner: '',
                type_animal: '',
                no_telp_owner: '',
                email_owner: '',
                time_register: '',
                photo: null
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ submit: 'Failed to register animal. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                name_animal: '',
                name_owner: '',
                type_animal: '',
                no_telp_owner: '',
                email_owner: '',
                time_register: '',
                photo: null
            });
            setErrors({});
            onClose();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Register New Animal</h3>
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
                        {errors.submit && (
                            <div className="alert alert-error mb-4">
                                {errors.submit}
                            </div>
                        )}

                        <div className="form-grid form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Animal Name *</label>
                                <input
                                    type="text"
                                    name="name_animal"
                                    value={formData.name_animal}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.name_animal ? 'error' : ''}`}
                                    placeholder="Enter animal name"
                                    disabled={isSubmitting}
                                />
                                {errors.name_animal && (
                                    <div className="form-error">{errors.name_animal}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Owner Name *</label>
                                <input
                                    type="text"
                                    name="name_owner"
                                    value={formData.name_owner}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.name_owner ? 'error' : ''}`}
                                    placeholder="Enter owner name"
                                    disabled={isSubmitting}
                                />
                                {errors.name_owner && (
                                    <div className="form-error">{errors.name_owner}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Animal Type *</label>
                                <select
                                    name="type_animal"
                                    value={formData.type_animal}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.type_animal ? 'error' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select animal type</option>
                                    <option value="Anjing">Anjing</option>
                                    <option value="Kucing">Kucing</option>
                                    <option value="Kelinci">Kelinci</option>
                                    <option value="Reptil">Reptil</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                                {errors.type_animal && (
                                    <div className="form-error">{errors.type_animal}</div>
                                )}
                            </div>



                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="no_telp_owner"
                                    value={formData.no_telp_owner}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.no_telp_owner ? 'error' : ''}`}
                                    placeholder="Enter phone number"
                                    disabled={isSubmitting}
                                />
                                {errors.no_telp_owner && (
                                    <div className="form-error">{errors.no_telp_owner}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    name="email_owner"
                                    value={formData.email_owner}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.email_owner ? 'error' : ''}`}
                                    placeholder="Enter email address"
                                    disabled={isSubmitting}
                                />
                                {errors.email_owner && (
                                    <div className="form-error">{errors.email_owner}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Registration Time *</label>
                                <input
                                    type="datetime-local"
                                    name="time_register"
                                    value={formData.time_register}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.time_register ? 'error' : ''}`}
                                    disabled={isSubmitting}
                                    required
                                />
                                {errors.time_register && (
                                    <div className="form-error">{errors.time_register}</div>
                                )}
                            </div>

                            <div className="form-group form-group-full">
                                <label className="form-label">Photo (Max 2MB)</label>
                                <div className="file-upload-container">
                                    <input
                                        type="file"
                                        name="photo"
                                        onChange={handleInputChange}
                                        className={`form-input file-input ${errors.photo ? 'error' : ''}`}
                                        accept="image/jpeg,image/jpg,image/png,image/gif"
                                        disabled={isSubmitting}
                                    />
                                    <div className="file-upload-info">
                                        {formData.photo ? (
                                            <div className="file-preview">
                                                <span className="file-name">📁 {formData.photo.name}</span>
                                                <span className="file-size">
                                                    ({(formData.photo.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="file-placeholder">Choose a photo file (JPEG, PNG, GIF)</span>
                                        )}
                                    </div>
                                </div>
                                {errors.photo && (
                                    <div className="form-error">{errors.photo}</div>
                                )}
                            </div>
                        </div>
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
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Registering...' : 'Register Animal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PopupRegister;