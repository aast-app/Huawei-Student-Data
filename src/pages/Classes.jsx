import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

function Classes() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branch = searchParams.get('branch');
  const [showModal, setShowModal] = useState(true);

  // If someone manually navigates to /classes without a branch, send them back to home
  useEffect(() => {
    if (!branch) {
      navigate('/');
    }
  }, [branch, navigate]);

  if (!branch) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      
      {/* Important Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl animate-fade-in text-center">
            <div className="flex justify-center mb-4">
              <ShieldAlert className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">IMPORTANT NOTIFICATION</h2>
            <p className="text-gray-700 mb-6 font-medium">
              Please send your certificate to <a href="mailto:admin@aast.edu" className="text-blue-600 underline">admin@aast.edu</a> once you finish the course.
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">Huawei Classes</h1>
          <p className="text-xl text-gray-600 mt-2 font-semibold bg-blue-100 inline-block px-4 py-1 rounded-full">
            Selected Branch: {branch}
          </p>
        </header>

        <div className="bg-white shadow rounded-lg p-6 text-center border-t-4 border-blue-600">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Classes for {branch}</h3>
          <p className="text-gray-600">
            More content and specific links for this branch will be added here soon.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Classes;
