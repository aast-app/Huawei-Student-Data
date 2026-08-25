import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';
import { X } from 'lucide-react';

// Zod Validation Schema
const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  huaweiId: z.string().min(3, 'Huawei ID must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid mobile number (10-15 digits)'),
  branch: z.enum(['AASTMT-ALex', 'AASTMT-Miami'], {
    errorMap: () => ({ message: 'Please select a valid branch' }),
  }),
});

// Adapter for Formik to use Zod safely
const validateWithZod = (values) => {
  const result = registrationSchema.safeParse(values);
  if (result.success) {
    return {};
  }
  
  const errors = {};
  if (result.error && result.error.issues) {
    result.error.issues.forEach((err) => {
      // Only keep the first error message for each field
      if (!errors[err.path[0]]) {
        errors[err.path[0]] = err.message;
      }
    });
  }
  return errors;
};

function Home() {
  const navigate = useNavigate();
  
  // Modal states
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  
  // Login input states
  const [adminPassword, setAdminPassword] = useState('');
  const [studentHuaweiId, setStudentHuaweiId] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      huaweiId: '',
      email: '',
      phoneNumber: '',
      branch: '',
    },
    validate: validateWithZod,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await axios.post('/api/students/register', values);
        toast.success('Registration successful!');
        navigate(`/classes?branch=${values.branch}`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const submitAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin1234') {
      sessionStorage.setItem('adminPassword', adminPassword);
      navigate('/admin');
    } else {
      toast.error('Incorrect password');
      setAdminPassword('');
    }
  };

  const submitStudentLogin = async (e) => {
    e.preventDefault();
    if (!studentHuaweiId) return;
    
    try {
      const response = await axios.post('/api/students/login', { huaweiId: studentHuaweiId });
      toast.success('Welcome back!');
      navigate(`/classes?branch=${response.data.branch}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Huawei ID not found. Please register.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 relative p-4">
      
      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl relative">
            <button 
              onClick={() => setShowAdminModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Access</h2>
            <form onSubmit={submitAdminLogin}>
              <input 
                type="password" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:border-gray-800 focus:ring-gray-800 shadow-sm" 
                placeholder="Enter admin password" 
                autoFocus 
              />
              <button 
                type="submit" 
                className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-900 transition shadow-sm"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Student Login Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl relative">
            <button 
              onClick={() => setShowStudentModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-blue-600 mb-4">Student Login</h2>
            <form onSubmit={submitStudentLogin}>
              <input 
                type="text" 
                value={studentHuaweiId} 
                onChange={(e) => setStudentHuaweiId(e.target.value)} 
                className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:border-blue-500 focus:ring-blue-500 shadow-sm" 
                placeholder="Enter Huawei ID (e.g. HW-12345)" 
                autoFocus 
              />
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition shadow-sm"
              >
                Access Classes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header Buttons */}
      <div className="absolute top-4 right-4 flex gap-4">
        <button 
          onClick={() => { setShowStudentModal(true); setStudentHuaweiId(''); }}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md text-sm font-bold shadow-sm transition"
        >
          Student Login
        </button>
        <button 
          onClick={() => { setShowAdminModal(true); setAdminPassword(''); }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition"
        >
          Admin Login
        </button>
      </div>

      {/* Main Registration Form */}
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl mt-12">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Huawei Registration</h1>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formik.values.name} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              required
              className={`mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formik.errors.name && formik.touched.name ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="John Doe" 
            />
            {formik.errors.name && formik.touched.name && <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Huawei ID *</label>
            <input 
              type="text" 
              name="huaweiId" 
              value={formik.values.huaweiId} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formik.errors.huaweiId && formik.touched.huaweiId ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="HW-123456" 
            />
            {formik.errors.huaweiId && formik.touched.huaweiId && <p className="text-red-500 text-xs mt-1">{formik.errors.huaweiId}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address *</label>
            <input 
              type="email" 
              name="email" 
              value={formik.values.email} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="john@example.com" 
            />
            {formik.errors.email && formik.touched.email && <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input 
              type="tel" 
              name="phoneNumber" 
              value={formik.values.phoneNumber} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formik.errors.phoneNumber && formik.touched.phoneNumber ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="01000000000" 
            />
            {formik.errors.phoneNumber && formik.touched.phoneNumber && <p className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Branch *</label>
            <select 
              name="branch" 
              value={formik.values.branch} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formik.errors.branch && formik.touched.branch ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="" disabled>Select your branch</option>
              <option value="AASTMT-ALex">AASTMT-ALex</option>
              <option value="AASTMT-Miami">AASTMT-Miami</option>
            </select>
            {formik.errors.branch && formik.touched.branch && <p className="text-red-500 text-xs mt-1">{formik.errors.branch}</p>}
          </div>

          <button 
            type="submit" 
            disabled={formik.isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition"
          >
            {formik.isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
