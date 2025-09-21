import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaLock, FaIdCard, FaUserTag, FaUserPlus, FaExclamationCircle } from "react-icons/fa";

function AddEmployers() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    nic: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Validation rules
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!inputs.name.trim()) {
      newErrors.name = "Name is required";
    } else if (inputs.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(inputs.name)) {
      newErrors.name = "Name can only contain letters and spaces";
    }
    
    // Contact validation
    if (!inputs.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[0-9+]{10,11}$/.test(inputs.contact)) {
      newErrors.contact = "Enter a valid contact number (10-15 digits)";
    }
    
    // Email validation
    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      newErrors.email = "Enter a valid email address";
    }
    
    // Password validation
    if (!inputs.password) {
      newErrors.password = "Password is required";
    } else if (inputs.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(inputs.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }
    
    // NIC validation (Sri Lankan format)
    if (!inputs.nic.trim()) {
      newErrors.nic = "NIC is required";
    } else if (!/^([0-9]{9}[xXvV]|[0-9]{12})$/.test(inputs.nic)) {
      newErrors.nic = "Enter a valid NIC number (old: 9 digits + V/X, new: 12 digits)";
    }
    
    // Role validation
    if (!inputs.role) {
      newErrors.role = "Please select a role";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage("Please fix the validation errors");
      return;
    }
    
    setIsLoading(true);
    setMessage("");
    
    sendRequest()
      .then(() => {
        setMessage("Employer added successfully!");
        setTimeout(() => navigate("/EmployerDetails"), 1500);
      })
      .catch(err => {
        setMessage("Error: " + (err.response?.data?.message || err.message));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const sendRequest = async () => {
    return await axios
      .post("http://localhost:5000/employers", {
        name: String(inputs.name.trim()),
        contact: String(inputs.contact.trim()),
        email: String(inputs.email.trim().toLowerCase()),
        password: String(inputs.password),
        nic: String(inputs.nic.trim().toUpperCase()),
        role: String(inputs.role),
      })
      .then((res) => res.data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8" style={{ 
      backgroundColor: '#e9fbfd',
      backgroundImage: 'radial-gradient(#00c2c9 0.5px, transparent 0.5px), radial-gradient(#00c2c9 0.5px, #e9fbfd 0.5px)',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 10px 10px'
    }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-400 to-cyan-500 py-6 px-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <FaUserPlus className="text-white text-2xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Add Employer</h2>
          <p className="text-blue-100 mt-2">Register a new employer account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-8 py-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition duration-300 ${
                    errors.name 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errors.name}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  name="contact"
                  value={inputs.contact}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition duration-300 ${
                    errors.contact 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.contact && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errors.contact}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition duration-300 ${
                    errors.email 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition duration-300 ${
                    errors.password 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errors.password}
                </p>
              )}
            </div>

            {/* NIC */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  name="nic"
                  value={inputs.nic}
                  onChange={handleChange}
                  placeholder="Enter NIC number"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition duration-300 ${
                    errors.nic 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.nic && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errors.nic}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserTag className="h-5 w-5 text-blue-500" />
                </div>
                <select
                  name="role"
                  value={inputs.role}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition duration-300 appearance-none ${
                    errors.role 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                >
                  <option value="">-- Select Role --</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Stock Manager">Stock Manager</option>
                  <option value="Order Manager">Order Manager</option>
                </select>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errors.role}
                </p>
              )}
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes("Error") 
                  ? "bg-red-100 text-red-700" 
                  : "bg-blue-100 text-blue-700"
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? "Processing..." : (
                <>
                  <span>Register Employer</span>
                  <FaUserPlus className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployers;