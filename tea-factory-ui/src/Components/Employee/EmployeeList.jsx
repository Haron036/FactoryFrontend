import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [editingId, setEditingId] = useState(null);
    const [editedEmployee, setEditedEmployee] = useState({});

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/employees');
            if (!response.ok) {
                console.error("Fetch Employees Error Response:", response);
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEmployees(data);
            setLoading(false);
        } catch (e) {
            console.error("Fetch Employees Error:", e);
            setError(e.message || 'Failed to load employees.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleEdit = (id, employee) => {
        setEditingId(id);
        setEditedEmployee({ ...employee });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedEmployee({});
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedEmployee(prevEmployee => ({
            ...prevEmployee,
            [name]: value,
        }));
    };

    const handleSaveEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedEmployee),
            });
            if (!response.ok) {
                console.error("Save Edit Error Response:", response);
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to update employee');
            }
            const updatedEmployees = employees.map(employee =>
                employee.id === id ? { ...editedEmployee, id } : employee
            );
            setEmployees(updatedEmployees);
            setEditingId(null);
            setEditedEmployee({});
            toast.success('Employee updated successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            console.log(`Saved edited employee with ID: ${id}`, editedEmployee);
        } catch (error) {
            console.error('Error updating employee:', error);
            toast.error(error.message || 'Failed to update employee', {
                position: "top-right",
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5173/api/employees/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.error("Delete Error Response:", response);
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to delete employee');
            }
            const updatedEmployees = employees.filter(employee => employee.id !== id);
            setEmployees(updatedEmployees);
            toast.success('Employee deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            console.log(`Deleted employee with ID: ${id}`);
            fetchEmployees(); // Re-fetch after successful delete
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast.error(error.message || 'Failed to delete employee', {
                position: "top-right",
            });
        }
    };

    if (loading) {
        return <div>Loading employees...</div>;
    }

    if (error) {
        return <div>Error loading employees: {error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Employees</h2>
            {employees.length === 0 ? (
                <p>No employees in the system.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left text-green-600">ID</th>
                            <th className="border border-gray-300 p-2 text-left text-green-600">Name</th>
                            <th className="border border-gray-300 p-2 text-left text-green-600">Position</th>
                            <th className="border border-gray-300 p-2 text-left text-green-600">Hire Date</th>
                            <th className="border border-gray-300 p-2 text-left text-green-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee.id}>
                                {editingId === employee.id ? (
                                    <>
                                        <td className="border border-gray-300 p-2">{employee.id}</td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="text"
                                                name="name"
                                                value={editedEmployee.name || ''}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="text"
                                                name="position"
                                                value={editedEmployee.position || ''}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="date"
                                                name="hireDate"
                                                value={editedEmployee.hireDate || ''}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                onClick={() => handleSaveEdit(employee.id)}
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
                                        <td className="border text-black border-gray-300 p-2">{employee.id}</td>
                                        <td className="border text-black border-gray-300 p-2">{employee.name}</td>
                                        <td className="border text-black border-gray-300 p-2">{employee.position}</td>
                                        <td className="border text-black border-gray-300 p-2">{employee.hireDate}</td>
                                        <td className="border text-black border-gray-300 p-2">
                                            <button
                                                onClick={() => handleEdit(employee.id, employee)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2 focus:outline-none focus:shadow-outline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(employee.id)}
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
            <Link to="/employees/add" className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Add New Employee
            </Link>
        </div>
    );
}

export default EmployeeList;