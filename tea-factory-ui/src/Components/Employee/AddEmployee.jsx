import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddEmployee() {
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        hireDate: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.position.trim()) {
            newErrors.position = 'Position is required';
            isValid = false;
        }

        if (!formData.hireDate.trim()) {
            newErrors.hireDate = 'Hire Date is required';
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
            const response = await fetch('http://localhost:5173/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add employee');
            }

            toast.success('Employee added successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            navigate('/employees', { state: { refresh: true } });
        } catch (error) {
            console.error('Error adding employee:', error);
            toast.error(error.message || 'An error occurred', {
                position: "top-right",
            });
            setErrors({ submit: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-md shadow-md mt-4 max-w-md mx-auto">
            <h2 className="text-blue-500 text-xl font-semibold mb-4">Add New Employee</h2>
            {errors.submit && <p className="text-red-500 text-xs italic mb-4">{errors.submit}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.name ? 'border-red-500' : ''
                        }`}
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="position" className="block text-gray-700 text-sm font-bold mb-2">
                        Position:
                    </label>
                    <input
                        type="text"
                        id="position"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.position ? 'border-red-500' : ''
                        }`}
                        value={formData.position}
                        onChange={handleChange}
                    />
                    {errors.position && (
                        <p className="text-red-500 text-xs italic mt-1">{errors.position}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="hireDate" className="block text-gray-700 text-sm font-bold mb-2">
                        Hire Date:
                    </label>
                    <input
                        type="date"
                        id="hireDate"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.hireDate ? 'border-red-500' : ''
                        }`}
                        value={formData.hireDate}
                        onChange={handleChange}
                    />
                    {errors.hireDate && (
                        <p className="text-red-500 text-xs italic mt-1">{errors.hireDate}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Employee'}
                </button>
            </form>
        </div>
    );
}

export default AddEmployee;