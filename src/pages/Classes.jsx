import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, ExternalLink, Lock, Brain, Database, Cloud, Server, Radio, Network, ShieldCheck, Key, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NetworkBackground from '../components/NetworkBackground';

const BRANCH_CLASSES = {
  'AASTMT-ALex': [
    { shortName: 'AI', longName: 'AI_Course_AASTMT-ALex', code: '9tWckM', icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787590726165&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: 'Big Data', longName: 'BigData_Course_AASTMT-ALex', code: 'rFlvpn', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787591685680&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: 'Cloud Computing', longName: 'CloudComputing_Course_AASTMT-ALex', code: 'iUfson', icon: Cloud, color: 'text-sky-600', bg: 'bg-sky-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787591879357&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: 'Cloud Service', longName: 'CloudService_Course_AASTMT-ALex', code: 'YkYvj3', icon: Server, color: 'text-cyan-600', bg: 'bg-cyan-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787593556539&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: '5G', longName: '5G_Course_AASTMT-ALex', code: '3mLgI3', icon: Radio, color: 'text-emerald-600', bg: 'bg-emerald-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787593859784&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: 'Datacom', longName: 'Datacom_Course_AASTMT-ALex', code: 'FXTH30', icon: Network, color: 'text-orange-600', bg: 'bg-orange-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787594071855&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: 'Security', longName: 'Security_Course_AASTMT-ALex', code: '5o3739', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787594258321&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: 'IoT', longName: 'IoT_Course_AASTMT-ALex', code: 'TBA', icon: Cpu, color: 'text-violet-600', bg: 'bg-violet-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787652885674&courseType=ICT&urlForm=course%2Fmanagement' },
  ],
  'AASTMT-Miami': [
    { shortName: 'AI', longName: 'AI_Course_AASTMT-Miami', code: 'TBA', icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-50', url: '' },
    { shortName: 'Big Data', longName: 'BigData_Course_AASTMT-Miami', code: 'TBA', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50', url: '' },
    { shortName: 'Cloud Computing', longName: 'CloudComputing_Course_AASTMT-Miami', code: 'TBA', icon: Cloud, color: 'text-sky-600', bg: 'bg-sky-50', url: '' },
    { shortName: 'Cloud Service', longName: 'CloudService_Course_AASTMT-Miami', code: 'TBA', icon: Server, color: 'text-cyan-600', bg: 'bg-cyan-50', url: '' },
    { shortName: '5G', longName: '5G_Course_AASTMT-Miami', code: 'TBA', icon: Radio, color: 'text-emerald-600', bg: 'bg-emerald-50', url: '' },
    { shortName: 'Datacom', longName: 'Datacom_Course_AASTMT-Miami', code: 'TBA', icon: Network, color: 'text-orange-600', bg: 'bg-orange-50', url: '' },
    { shortName: 'Security', longName: 'Security_Course_AASTMT-Miami', code: 'TBA', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50', url: '' },
  ],
  'AASTMT-Dokki': [
    { shortName: 'AI', longName: 'AI_COURSE_AAST-IECDokki', code: 'TBA', icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787638855079&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: 'Big Data', longName: 'BIG_DATA_AAST-IECDokki', code: 'TBA', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787639537508&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: 'Datacom', longName: 'DATACOM_COURSE_AAST-IECDokki', code: 'TBA', icon: Network, color: 'text-orange-600', bg: 'bg-orange-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787643675067&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: '5G', longName: '5G_COURSE_AAST-IECDokki', code: 'TBA', icon: Radio, color: 'text-emerald-600', bg: 'bg-emerald-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787641471243&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: 'Security', longName: 'SECURITY_COURSE_AAST-IECDokki', code: 'TBA', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787640234917&courseType=ICT&urlForm=course%2Fmanagement' },
    { shortName: 'IoT', longName: 'loT_COURSE-AAST_IECDokki', code: 'TBA', icon: Cpu, color: 'text-violet-600', bg: 'bg-violet-50', url: 'https://e.huawei.com/en/talent/#/course/course-details?applicationId=1787640503867&courseType=ICT&urlForm=course%2Fmanagement' },
  ]
};

function Classes() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branch = searchParams.get('branch');
  const [showModal, setShowModal] = useState(true);
  const studentName = sessionStorage.getItem('studentName');

  useEffect(() => {
    if (!branch || !BRANCH_CLASSES[branch]) {
      navigate('/');
    }
  }, [branch, navigate]);

  if (!branch || !BRANCH_CLASSES[branch]) return null;

  const classesList = BRANCH_CLASSES[branch];

  return (
    <div className="relative min-h-screen w-full bg-[#0f172a] flex items-center justify-center py-12 px-4 sm:px-8">
      {/* Background layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NetworkBackground />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 w-full max-w-[90rem]">
        
        {/* Important Notification Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="modal-content !max-w-md text-center flex flex-col items-center"
                initial={{ scale: 0.9, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <div className="bg-red-50 p-4 rounded-full mb-4 mt-2">
                  <ShieldAlert className="h-10 w-10 text-[#e61d2b]" />
                </div>
                <h3 className="mb-2 text-[#e61d2b]">Important Notice</h3>
                <p className="text-gray-600 mb-6 font-medium text-sm leading-relaxed px-4">
                  Upon completing your course, you must immediately forward your certificate to <br/>
                  <a href="mailto:iasc.huawei@aast.edu" className="text-[#3b82f6] hover:underline font-bold text-base mt-1 inline-block">iasc.huawei@aast.edu</a>
                </p>
                <button onClick={() => setShowModal(false)} className="btn-primary w-full">
                  I Understand
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard Card */}
        <div className="glass-panel p-6 lg:p-8 xl:p-10 w-full">
          
          <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 gap-4">
            <div>
              {studentName && (
                <p className="text-gray-500 font-bold tracking-wide uppercase text-sm mb-2">
                  Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e61d2b] to-[#ff4b58] font-black tracking-wider text-base">{studentName}</span>
                </p>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Available Classes</h1>
            </div>
            <div className="shrink-0 mt-2 md:mt-0">
              <span className="inline-flex items-center gap-2 bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#1d4ed8] px-5 py-2.5 rounded-full font-bold text-sm tracking-wide">
                <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse"></div>
                {branch} Branch
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classesList.map((course, idx) => {
              const Icon = course.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 lg:p-7 min-h-[14rem] shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
                  
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 lg:p-4 rounded-xl ${course.bg} ${course.color} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[1.15rem] lg:text-[1.35rem] font-black text-gray-900 leading-tight break-words">{course.shortName}</h3>
                      <p className="text-[0.6rem] lg:text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mt-1.5 break-words" title={course.longName}>{course.longName}</p>
                    </div>
                  </div>
                  
                  {course.url ? (
                    <a 
                      href={course.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center justify-center gap-2 w-full bg-[#111827] hover:bg-[#3b82f6] text-white font-bold py-3.5 px-4 rounded-xl transition-colors duration-300 shadow-md text-base"
                    >
                      Launch Course <ExternalLink size={18} strokeWidth={2.5} />
                    </a>
                  ) : (
                    <div className="mt-auto flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-400 font-bold py-3.5 px-4 rounded-xl cursor-not-allowed text-base">
                      <Lock size={18} strokeWidth={2.5} /> Locked
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Classes;
