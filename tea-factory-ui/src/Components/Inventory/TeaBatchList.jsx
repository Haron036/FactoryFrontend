import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TeaBatchList() {
    const [teaBatches, setTeaBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [editingId, setEditingId] = useState(null);
    const [editedBatch, setEditedBatch] = useState({});

    useEffect(() => {
        if (location.state?.refresh) {
            setRefresh(prev => !prev);
            navigate(location.pathname, { replace: true, state: {} });
        } else {
            fetchTeaBatches();
        }
    }, [location.state?.refresh, navigate, refresh]);
    const fetchTeaBatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
        const token = localStorage.getItem('token');
        console.log("Token being sent:", token);
        
        const response = await fetch('http://localhost:5173/api/inventory', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                navigate('/login');
                return;
            }
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch tea batches');
        }
        const data = await response.json();
        setTeaBatches(data);
    } catch (error) {
        setError(error);
        console.error('Error fetching tea batches:', error);
        toast.error(error.message || 'Failed to fetch tea batches', {
            position: "top-right",
        });
    } finally {
        setLoading(false);
    }
};
    const handleEdit = (id, batch) => {
        setEditingId(id);
        setEditedBatch({ ...batch });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedBatch({});
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedBatch(prevBatch => ({
            ...prevBatch,
            [name]: value,
        }));
    };

    const handleSaveEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:5173/api/inventory/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedBatch),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update tea batch');
            }
            const updatedBatches = teaBatches.map(batch =>
                batch.id === id ? { ...editedBatch, id } : batch
            );
            setTeaBatches(updatedBatches);
            setEditingId(null);
            setEditedBatch({});
            toast.success('Tea batch updated successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            console.log(`Saved edited batch with ID: ${id}`, editedBatch);
        } catch (error) {
            console.error('Error updating tea batch:', error);
            toast.error(error.message || 'Failed to update tea batch', {
                position: "top-right",
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5173/api/inventory/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete tea batch');
            }
            const updatedBatches = teaBatches.filter(batch => batch.id !== id);
            setTeaBatches(updatedBatches);
            toast.success('Tea batch deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            console.log(`Deleted batch with ID: ${id}`);
        } catch (error) {
            console.error('Error deleting tea batch:', error);
            toast.error(error.message || 'Failed to delete tea batch', {
                position: "top-right",
            });
        }
    };

    if (loading) {
        return <div>Loading tea batches...</div>;
    }

    if (error) {
        return <div>Error loading tea batches: {error.message}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tea Batches</h2>
            {teaBatches.length === 0 ? (
                <p>No tea batches in inventory.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-green-600 text-left">ID</th>
                            <th className="border border-gray-300 p-2 text-green-600 text-left">Tea Type</th>
                            <th className="border border-gray-300 p-2 text-green-600 text-left">Weight (kg)</th>
                            <th className="border border-gray-300 p-2 text-green-600 text-left">Arrival Date</th>
                            <th className="border border-gray-300 p-2 text-green-600 text-left">Processing Stage</th>
                            <th className="border border-gray-300 p-2 text-green-600 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teaBatches.map(batch => (
                            <tr key={batch.id}>
                                {editingId === batch.id ? (
                                    <>
                                        <td className="border border-gray-300 p-2">{batch.id}</td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="text"
                                                name="teaType"
                                                value={editedBatch.teaType || ''}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="number"
                                                name="weightInKg"
                                                value={editedBatch.weightInKg || ''}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="date"
                                                name="arrivalDate"
                                                value={editedBatch.arrivalDate || ''}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="text"
                                                name="processingStage"
                                                value={editedBatch.processingStage || ''}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                onClick={() => handleSaveEdit(batch.id)}
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm mr-2 focus:outline-none focus:shadow-outline"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded text-sm focus:outline-none focus:shadow-outline"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="border text-black border-gray-300 p-2">{batch.id}</td>
                                        <td className="border text-black border-gray-300 p-2">{batch.teaType}</td>
                                        <td className="border text-black border-gray-300 p-2">{batch.weightInKg}</td>
                                        <td className="border text-black border-gray-300 p-2">{batch.arrivalDate}</td>
                                        <td className="border text-black border-gray-300 p-2">{batch.processingStage}</td>
                                        <td className="border text-black border-gray-300 p-2">
                                            <button
                                                onClick={() => handleEdit(batch.id, batch)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2 focus:outline-none focus:shadow-outline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(batch.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm focus:outline-none focus:shadow-outline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Link to="/inventory/add" className="inline-block mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Add New Tea Batch
            </Link>
        </div>
    );
}

export default TeaBatchList;