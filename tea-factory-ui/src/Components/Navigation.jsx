import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/Homepage.jpeg';


function Navigation() {
    return (
        <nav className={`bg-[url('${backgroundImage}')] bg-cover bg-no-repeat bg-center text-white p-4`}>
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="text-xl font-bold">Tea Factory System</Link>
                <div>
                    <Link to="/inventory" className="mr-4 hover:text-gray-300">Inventory</Link>
                    <Link to="/employees" className="hover:text-gray-300">Employees</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;