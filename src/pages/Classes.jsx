import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, ExternalLink, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import NetworkBackground from '../components/NetworkBackground';
import Loader from '../components/Loader';

function Classes() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branchName = searchParams.get('branch');
  const [showModal, setShowModal] = useState(true);
  const [hasAgreed, setHasAgreed] = useState(false);
  const studentName = sessionStorage.getItem('studentName');
  const [branchData, setBranchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!branchName) {
      navigate('/');
      return;
    }
    
    // Fetch dynamic branch data
    fetch('/api/students/branches')
      .then(res => res.json())
      .then(data => {
        const branch = data.find(b => b.name === branchName);
        if (!branch) {
          navigate('/');
        } else {
          setBranchData(branch);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [branchName, navigate]);

  if (loading) return <Loader />;
  if (!branchData) return null;

  const classesList = branchData.courses;

  return (
    <div className="relative h-screen w-full overflow-y-auto overflow-x-hidden bg-[#0f172a]">
      {/* Background layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NetworkBackground />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 w-full min-h-full flex flex-col items-center justify-start lg:justify-center py-[6vh] lg:py-12 px-4 sm:px-8 mx-auto">
        <div className="w-full max-w-[90rem]">
        
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
                className="modal-content !max-w-2xl text-center flex flex-col items-center w-full mx-4"
                initial={{ scale: 0.9, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <div className="bg-red-50 p-4 rounded-full mb-3 mt-2 shadow-sm">
                  <ShieldAlert className="h-10 w-10 text-[#e61d2b]" />
                </div>
                <h3 className="mb-5 text-[#e61d2b] text-2xl font-black tracking-tight">Important Notice</h3>
                
                <div dir="rtl" className="text-end w-full px-2 md:px-6 mb-6">
                  <p className="text-gray-800 font-bold text-base md:text-lg mb-5 leading-relaxed text-center">
                    📜 يرجى إرسال شهادة إتمام الكورس إلينا، حيث سيتم الاعتماد عليها في متابعة واستكمال ملفكم التدريبي.
                  </p>
                  
                  <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 mb-5 shadow-sm">
                    <p className="text-blue-900 font-bold mb-4 text-sm md:text-base border-b border-blue-200/60 pb-3">
                      ✨ إتمام الكورس وإرسال الشهادة يتيح لكم فرصة الاستفادة من العديد من المزايا:
                    </p>
                    <ul className="space-y-3 text-gray-700 font-medium text-sm md:text-base pe-2">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-sm"></div>
                        <span>🎓 الأولوية في منح تدريبية مجانية أخرى من هواوي</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-sm"></div>
                        <span>💰 خصومات مميزة على اختبارات وشهادات هواوي الدولية</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-sm"></div>
                        <span>💼 فرص حضور معارض التوظيف الخاصة بهواوي HIRE</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-sm"></div>
                        <span>🏆 الأولوية في الالتحاق والمشاركة في المسابقات والبرامج الدولية الخاصة بهواوي، ومنها Talent Care Program</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-5 border border-emerald-100 shadow-sm text-center">
                    <p className="text-emerald-800 font-bold text-sm md:text-base">
                      🚀 كل كورس تنجحون في إتمامه هو خطوة جديدة نحو فرص تدريبية ومهنية أكبر مع Huawei & AAST.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200 mb-5 shadow-sm">
                    <p className="text-gray-600 text-sm font-bold mb-2">
                      يرجى إرسال الشهادة فور إتمامكم الكورس على البريد التالي:
                    </p>
                    <a href="mailto:iasc.huawei@aast.edu" dir="ltr" className="text-[#3b82f6] hover:text-blue-700 hover:underline font-black text-lg md:text-xl inline-block transition-colors tracking-wide break-all">
                      iasc.huawei@aast.edu
                    </a>
                  </div>

                  <p className="text-[#e61d2b] font-bold text-xs md:text-sm text-center bg-red-50/50 p-3 rounded-lg border border-red-100">
                    ⚠️ تنبيه: نرجو التأكد من صحة البيانات المرسلة ومطابقتها للبيانات المسجلة على حساب Huawei الخاص بكم.
                  </p>
                </div>

                <div className="w-full max-w-sm mb-5 flex items-center justify-center gap-3 bg-gray-50/80 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setHasAgreed(!hasAgreed)}>
                  <input 
                    type="checkbox" 
                    id="agreeCheck"
                    className="w-5 h-5 accent-[#e61d2b] cursor-pointer shrink-0"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor="agreeCheck" className="text-gray-700 font-bold text-sm md:text-base cursor-pointer select-none pointer-events-none" dir="rtl">
                    أتعهد بإرسال الشهادة فور إتمام الكورس.
                  </label>
                </div>

                <button 
                  onClick={() => setShowModal(false)} 
                  disabled={!hasAgreed}
                  className={`btn-primary w-full max-w-sm text-lg py-3.5 shadow-lg transition-all duration-300 ${!hasAgreed ? 'opacity-50 cursor-not-allowed grayscale' : 'shadow-red-500/20 hover:-translate-y-1'}`}
                >
                  I Understand / أوافق
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
                <p className="text-gray-600 font-bold tracking-wide uppercase text-xs sm:text-sm mb-2 md:mb-3">
                  Welcome back, <span className="text-[#e61d2b] font-black tracking-wider text-base sm:text-lg md:text-xl inline-block ms-1">{studentName}</span>
                </p>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Available Classes</h1>
            </div>
            <div className="shrink-0 mt-2 md:mt-0">
              <span className="inline-flex items-center gap-2 bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#1d4ed8] px-5 py-2.5 rounded-full font-bold text-sm tracking-wide">
                <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse"></div>
                {branchName} Branch
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classesList.map((course, idx) => {
              const Icon = LucideIcons[course.icon] || LucideIcons.BookOpen;
              const currentUrl = course.url;

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
                  
                  {currentUrl ? (
                    <a 
                      href={currentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-auto group/btn flex items-center justify-between w-full bg-[#f8fafc] hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white px-5 py-4 rounded-xl font-bold transition-all duration-300 border border-[#e2e8f0] hover:border-transparent"
                    >
                      <span>Course Link</span>
                      <ExternalLink size={20} className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                  ) : (
                    <div className="mt-auto flex items-center justify-between w-full bg-gray-50 text-gray-400 px-5 py-4 rounded-xl font-bold border border-gray-200 cursor-not-allowed opacity-70">
                      <span>Course Link</span>
                      <ExternalLink size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Classes;
