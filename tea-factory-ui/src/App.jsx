import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./Components/Navigation";
import AddTeaBatch from "./Components/Inventory/AddTeaBatch";
import AddEmployee from "./Components/Employee/AddEmployee";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./Components/Authcontext/Authcontext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();
  return isAuthenticated && userRole === "admin" ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

// Styled placeholder components
const HomePage = () => (
  <div className="flex items-center justify-center flex-grow">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <h1 className="text-4xl font-bold text-green-600 mb-6 text-center">
        Welcome to the Tea Factory System
      </h1>
      <p className="text-xl text-green-600 whitespace-nowrap animate-slideLoop">
        Your complete solution for tea production management
      </p>
    </div>
  </div>
);

const InventoryPage = () => (
  <div className="flex flex-col items-center flex-grow p-6">
    <h2 className=" text-green-600 text-2xl font-semibold mb-4 text-center">
      Inventory Management
    </h2>
    
    <AddTeaBatch />
  </div>
);

const EmployeesPage = () => (
  <div className="flex flex-col items-center flex-grow p-6">
    <h2 className="text-2xl font-semibold mb-4 text-center text-green-600">
      Employee Management
    </h2>

    <AddEmployee />
  </div>
);

function App() {
  return (
    <AuthProvider>
    <Router>
      <div>
        <Navigation />
        <main className="flex-grow flex items-center justify-center w-full">
          {" "}
          {/* Added w-full here */}
          <div className="px-4 py-8 w-full h-full flex items-center justify-center">
            {" "}
            {/* Removed container, added w-full */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/inventory/*" element={<InventoryPage />} />
              <Route
                path="/employees/add"
                element={
                  <AdminRoute>
                    <AddEmployee />
                  </AdminRoute>
                }
              />
              <Route path="/employees/*" element={<EmployeesPage />} />
            </Routes>
            <ToastContainer />
          </div>
        </main>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
