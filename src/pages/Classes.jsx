import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, ExternalLink, Lock } from 'lucide-react';

const BRANCH_CLASSES = {
  'AASTMT-ALex': [
    { name: 'AI_Course_AASTMT-ALex', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787590726165&courseType=ICT&urlForm=course%2Fmanagement' },
    { name: 'BigData_Course_AASTMT-ALex', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787591685680&courseType=ICT&urlForm=course%2Fmanagement' },
    { name: 'CloudComputing_Course_AASTMT-ALex', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787591879357&courseType=ICT&urlForm=course%2Fmanagement' },
    { name: 'CloudService_Course_AASTMT-ALex', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787593556539&courseType=ICT&urlForm=course%2Fmanagement' },
    { name: '5G_Course_AASTMT-ALex', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787593859784&courseType=ICT&urlForm=course%2Fmanagement' },
    { name: 'Datacom_Course_AASTMT-ALex', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787594071855&courseType=ICT&urlForm=course%2Fmanagement' },
    { name: 'Security_Course_AASTMT-ALex', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787594258321&courseType=ICT&urlForm=course%2Fmanagement' },
  ],
  'AASTMT-Miami': [
    { name: 'AI_Course_AASTMT-Miami', url: '' },
    { name: 'BigData_Course_AASTMT-Miami', url: '' },
    { name: 'CloudComputing_Course_AASTMT-Miami', url: '' },
    { name: 'CloudService_Course_AASTMT-Miami', url: '' },
    { name: '5G_Course_AASTMT-Miami', url: '' },
    { name: 'Datacom_Course_AASTMT-Miami', url: '' },
    { name: 'Security_Course_AASTMT-Miami', url: '' },
  ]
};

function Classes() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branch = searchParams.get('branch');
  const [showModal, setShowModal] = useState(true);
  const studentName = sessionStorage.getItem('studentName');

  // Send back to home if they navigate here without a valid branch parameter
  useEffect(() => {
    if (!branch || !BRANCH_CLASSES[branch]) {
      navigate('/');
    }
  }, [branch, navigate]);

  if (!branch || !BRANCH_CLASSES[branch]) return null;

  const classesList = BRANCH_CLASSES[branch];

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      
      {/* Important Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 transition-opacity">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl text-center">
            <div className="flex justify-center mb-4">
              <ShieldAlert className="h-14 w-14 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">IMPORTANT NOTIFICATION</h2>
            <p className="text-gray-700 mb-6 font-medium text-lg leading-relaxed">
              Please send your certificate to <br/>
              <a href="mailto:admin@aast.edu" className="text-blue-600 underline font-bold">admin@aast.edu</a> 
              <br/> once you finish the course.
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded shadow-lg transition transform hover:scale-105"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          {studentName && (
            <h2 className="text-2xl font-bold text-gray-500 mb-2 tracking-wide">Welcome, {studentName}!</h2>
          )}
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Huawei ICT Courses</h1>
          <p className="text-lg text-blue-800 mt-3 font-semibold bg-blue-100 inline-block px-5 py-2 rounded-full shadow-sm border border-blue-200">
            Branch: {branch}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesList.map((course, idx) => (
            <div key={idx} className="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-600 hover:shadow-xl transition flex flex-col justify-between">
              <h3 className="text-lg font-bold text-gray-800 mb-4 break-words">{course.name}</h3>
              
              {course.url ? (
                <a 
                  href={course.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                  <ExternalLink size={18} /> Access Course
                </a>
              ) : (
                <div className="mt-auto flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded cursor-not-allowed">
                  <Lock size={18} /> Link Unavailable
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Classes;
