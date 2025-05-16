import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Authcontext/Authcontext';


function AddTeaBatch() {
    const [formData, setFormData] = useState({
        teaType: '',
        weightInKg: '',
        arrivalDate: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { token } = useAuth(); // Get the authentication token from the AuthContext

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Clear any previous error for this field on change
        setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.teaType.trim()) {
            newErrors.teaType = 'Tea Type is required';
            isValid = false;
        }

        if (!formData.weightInKg.trim()) {
            newErrors.weightInKg = 'Weight is required';
            isValid = false;
        } else if (isNaN(parseFloat(formData.weightInKg)) || parseFloat(formData.weightInKg) <= 0) {
            newErrors.weightInKg = 'Weight must be a positive number';
            isValid = false;
        }

        if (!formData.arrivalDate.trim()) {
            newErrors.arrivalDate = 'Arrival Date is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:8080/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the Authorization header with the token
                },
                body: JSON.stringify({
                    teaType: formData.teaType,
                    weightInKg: parseFloat(formData.weightInKg),
                    arrivalDate: formData.arrivalDate,
                    processingStage: 'Raw',
                }),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to add tea batch';
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    console.error("Error parsing error response:", e);
                }
                throw new Error(errorMessage);
            }

            toast.success('Tea batch added successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            navigate('/inventory', { state: { refresh: true } });
        } catch (error) {
            console.error('Error adding tea batch:', error);
            toast.error(error.message || 'An unexpected error occurred', {
                position: "top-right",
            });
            setErrors({ submit: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-md shadow-md mt-4 max-w-md mx-auto">
            <h2 className="text-green-500 text-xl font-semibold mb-4">Add New Tea Batch</h2>
            {errors.submit && <p className="text-red-500 text-xs italic mb-4">{errors.submit}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="teaType" className="block text-gray-700 text-sm font-bold mb-2">
                        Tea Type:
                    </label>
                    <input
                        type="text"
                        id="teaType"
                        className={`shadow appearance-none border ${errors.teaType ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        value={formData.teaType}
                        onChange={handleChange}
                    />
                    {errors.teaType && <p className="text-red-500 text-xs italic">{errors.teaType}</p>}
                </div>
                <div>
                    <label htmlFor="weightInKg" className="block text-gray-700 text-sm font-bold mb-2">
                        Weight (in Kg):
                    </label>
                    <input
                        type="number"
                        id="weightInKg"
                        className={`shadow appearance-none border ${errors.weightInKg ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        value={formData.weightInKg}
                        onChange={handleChange}
                    />
                    {errors.weightInKg && <p className="text-red-500 text-xs italic">{errors.weightInKg}</p>}
                </div>
                <div>
                    <label htmlFor="arrivalDate" className="block text-gray-700 text-sm font-bold mb-2">
                        Arrival Date:
                    </label>
                    <input
                        type="date"
                        id="arrivalDate"
                        className={`shadow appearance-none border ${errors.arrivalDate ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        value={formData.arrivalDate}
                        onChange={handleChange}
                    />
                    {errors.arrivalDate && <p className="text-red-500 text-xs italic">{errors.arrivalDate}</p>}
                </div>
                <button
                    type="submit"
                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Batch'}
                </button>
            </form>
        </div>
    );
}

export default AddTeaBatch;