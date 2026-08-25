import React, { useState } from 'react';
import { useFormik } from 'formik';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X, Lock, Search, LogIn, Eye, EyeOff, ShieldAlert, ShieldCheck, UserCheck, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import NetworkBackground from '../components/NetworkBackground';
import CustomSelect from '../components/CustomSelect';
import Loader from '../components/Loader';
import idImage from '../assets/id.png';
import '../styles/Home.scss';

// Zod Validation Schema
const registrationSchema = z.object({
  huaweiId: z.string().min(3, "Huawei ID is required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  branch: z.string().min(1, "Please select a valid branch")
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
      if (!errors[err.path[0]]) {
        errors[err.path[0]] = err.message;
      }
    });
  }
  return errors;
};

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showIdHelpModal, setShowIdHelpModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [studentHuaweiId, setStudentHuaweiId] = useState('');
  const [studentEmailLogin, setStudentEmailLogin] = useState('');
  
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      huaweiId: '',
      email: '',
      phoneNumber: '',
      branch: '',
    },
    validate: validateWithZod,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await axios.post('/api/students/register', values);
        sessionStorage.setItem('studentName', response.data.student.name);
        toast.success(t('access_granted'));
        navigate(`/classes?branch=${values.branch}`);
      } catch (error) {
        const msg = error.response?.data?.message || 'Something went wrong';
        // Map server errors directly to inline fields
        if (msg.toLowerCase().includes('huawei id')) {
          setFieldError('huaweiId', msg);
        } else if (msg.toLowerCase().includes('email')) {
          setFieldError('email', msg);
        } else {
          toast.error(msg);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const submitAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoadingAdmin(true);

    try {
      // Securely verify the password by pinging the backend API
      await axios.get('/api/students', {
        headers: { 'x-admin-password': adminPassword },
        params: { limit: 1 }
      });
      
      // If the backend doesn't throw a 401 Error, the password is correct!
      sessionStorage.setItem('adminPassword', adminPassword);
      navigate('/admin');
    } catch (error) {
      toast.error('Incorrect password');
      setAdminPassword('');
      setIsLoadingAdmin(false);
    }
  };

  const submitStudentLogin = async (e) => {
    e.preventDefault();
    if (!studentHuaweiId || !studentEmailLogin) return;
    
    setIsLoadingStudent(true);
    try {
      const response = await axios.post('/api/students/login', { 
        huaweiId: studentHuaweiId, 
        email: studentEmailLogin 
      });
      sessionStorage.setItem('studentName', response.data.name);
      toast.success(`${t('welcome_back')}, ${response.data.name}!`);
      navigate(`/classes?branch=${response.data.branch}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your details.');
      setIsLoadingStudent(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      
      {/* LEFT PANEL - Animated Tech Background */}
      <div className="hidden lg:flex w-1/2 h-full relative overflow-hidden flex-col justify-center items-start p-12 xl:p-16 z-10 shadow-2xl shrink-0">
        <NetworkBackground />
        <div className="relative z-20 max-w-lg xl:ms-8">
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-lg">
            {t('access_courses')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">{t('ict_courses')}</span>
          </h1>
          <p className="text-lg xl:text-xl text-blue-100 font-light tracking-wide opacity-90 leading-relaxed drop-shadow-md">
            {t('home_subtitle')}
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Form & Content */}
      <div className="w-full lg:w-1/2 h-full flex flex-col relative bg-white">
        
        {/* DYNAMIC HEIGHT FORM CONTAINER - ZERO SCROLLBARS (UNLESS NEEDED) */}
        <div className="flex-grow w-full overflow-y-auto px-6 lg:px-10">
          <div className="w-full max-w-xl mx-auto min-h-full form-container flex flex-col justify-center py-10 lg:py-[4vh]">
            
            {/* CENTERED LOGOS */}
            <div className="w-full flex justify-center items-center gap-[4vw] lg:gap-[6vw] mb-[4vh] lg:mb-[8vh] overflow-visible">
              <img src="/aast-logo.png" alt="AAST Logo" className="h-[8vh] lg:h-[12vh] min-h-[3rem] lg:min-h-[4rem] max-h-[70px] lg:max-h-[130px] object-contain drop-shadow-md scale-[1.1] lg:scale-[1.45] transform origin-center transition-all duration-300" />
              <div className="h-[5vh] lg:h-[8vh] min-h-[2rem] lg:min-h-[3rem] max-h-[50px] lg:max-h-[80px] w-[2px] bg-black opacity-30 rounded-full"></div>
              <img src="/huawei-logo.png" alt="Huawei Logo" className="h-[8vh] lg:h-[12vh] min-h-[3rem] lg:min-h-[4rem] max-h-[70px] lg:max-h-[130px] object-contain drop-shadow-md scale-[1.0] lg:scale-[1.35] transform origin-center transition-all duration-300" />
            </div>

            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-[0.5vh] tracking-tight text-center lg:text-left transition-all duration-300">Student Details</h2>
            <p className="subtitle text-sm lg:text-base mb-[3vh] text-center lg:text-left transition-all duration-300">Please enter your information to gain access</p>
            
            <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-[2vh]">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.5vh] lg:gap-[2vh]">
                <div className="w-full flex flex-col pt-[1.75rem]">
                  <div className="input-group">
                    <input 
                      type="text" 
                      name="name" 
                      className={`input ${formik.values.name ? 'has-value' : ''} ${formik.errors.name && formik.touched.name ? 'has-error' : ''}`}
                      required
                      autoComplete="off"
                      {...formik.getFieldProps('name')}
                    />
                    <label className="user-label">{t('name')}</label>
                  </div>
                  {formik.errors.name && formik.touched.name && <div className="error-text">{formik.errors.name}</div>}
                </div>

                <div className="w-full flex flex-col relative pt-[1.75rem]">
                  <button 
                    type="button"
                    onClick={() => setShowIdHelpModal(true)}
                    className="absolute top-1 end-2 text-[0.75rem] text-[#3b82f6] hover:text-[#1d4ed8] hover:underline font-semibold transition-colors z-10"
                  >
                    ({t('how_to_find_id')})
                  </button>
                  <div className="input-group">
                    <input 
                      type="text" 
                      name="huaweiId" 
                      className={`input font-mono ${formik.values.huaweiId ? 'has-value' : ''} ${formik.errors.huaweiId && formik.touched.huaweiId ? 'has-error' : ''}`}
                      required
                      autoComplete="off"
                      {...formik.getFieldProps('huaweiId')}
                    />
                    <label className="user-label">{t('huawei_id')}</label>
                  </div>
                  {formik.errors.huaweiId && formik.touched.huaweiId && <div className="error-text">{formik.errors.huaweiId}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.5vh] lg:gap-[2vh]">
                <div className="w-full flex flex-col">
                  <div className="input-group">
                    <input 
                      type="email" 
                      name="email" 
                      className={`input ${formik.values.email ? 'has-value' : ''} ${formik.errors.email && formik.touched.email ? 'has-error' : ''}`}
                      required
                      autoComplete="off"
                      {...formik.getFieldProps('email')}
                    />
                    <label className="user-label">{t('email')}</label>
                  </div>
                  {formik.errors.email && formik.touched.email && <div className="error-text">{formik.errors.email}</div>}
                </div>

                <div className="w-full flex flex-col">
                  <div className="input-group">
                    <input 
                      type="tel" 
                      name="phoneNumber" 
                      className={`input ${formik.values.phoneNumber ? 'has-value' : ''} ${formik.errors.phoneNumber && formik.touched.phoneNumber ? 'has-error' : ''}`}
                      required
                      autoComplete="off"
                      {...formik.getFieldProps('phoneNumber')}
                    />
                    <label className="user-label">{t('phone')}</label>
                  </div>
                  {formik.errors.phoneNumber && formik.touched.phoneNumber && <div className="error-text">{formik.errors.phoneNumber}</div>}
                </div>
              </div>

              <div className="w-full flex flex-col">
                <CustomSelect
                  label={t('select_branch')}
                  value={formik.values.branch}
                  onChange={(val) => {
                    formik.setFieldValue('branch', val);
                    formik.setFieldTouched('branch', true, false);
                  }}
                  error={formik.touched.branch && Boolean(formik.errors.branch)}
                  options={[
                    { value: 'AASTMT-ALex', label: 'AASTMT-ALex' },
                    { value: 'AASTMT-Miami', label: 'AASTMT-Miami' },
                    { value: 'AASTMT-Dokki', label: 'AASTMT-Dokki' },
                    { value: 'AASTMT-Fouad', label: 'AASTMT-Fouad' }
                  ]}
                />
                {formik.errors.branch && formik.touched.branch && <div className="error-text">{formik.errors.branch}</div>}
              </div>

              <div className="pt-2">
                {formik.isSubmitting ? (
                  <Loader small={true} />
                ) : (
                  <button 
                    type="submit" 
                    className="btn-primary"
                  >
                    {t('register')}
                  </button>
                )}
              </div>
            </form>

            <hr className="my-6 border-gray-100" />

            {/* Clear Returning Student Button */}
            <button 
              onClick={() => setShowStudentModal(true)}
              className="w-full border-2 border-gray-200 text-gray-700 hover:border-gray-800 hover:bg-gray-50 font-bold py-3.5 px-4 rounded-[1rem] transition-all duration-300 shadow-sm text-sm lg:text-base"
            >
              {t('login_student')}
            </button>

            {/* Subtle Admin Link */}
            <div className="mt-6 text-center pb-4">
              <button 
                onClick={() => setShowAdminModal(true)} 
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors"
              >
                {t('admin_access')}
              </button>
            </div>

          </div>
        </div>

        {/* LOCAL FOOTER FOR HOME PAGE (Right Panel Only) */}
        <div className="hidden lg:flex w-full px-6 lg:px-10 py-3 shrink-0 justify-between items-center border-t border-gray-100 bg-white z-20">
          <div className="flex items-center gap-4 lg:gap-6 ms-2">
            <img src="/aast-logo.png" alt="AAST" className="h-5 lg:h-6 object-contain opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100" />
            <img src="/huawei-logo.png" alt="Huawei" className="h-5 lg:h-6 object-contain opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100 scale-[1.2]" />
          </div>
          <div className="text-[0.6rem] lg:text-[0.7rem] text-gray-400 font-medium text-center hidden sm:block">
            &copy; {new Date().getFullYear()} AAST. Developed by Eng. Youssef Wael.
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[0.6rem] lg:text-[0.7rem] text-gray-500 font-medium">Operational</span>
          </div>
        </div>

      </div>

      {/* Modals using Framer Motion for graceful animation */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content form-container !p-8"
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <button className="close-btn" onClick={() => setShowAdminModal(false)}><X size={24} /></button>
              <h3>{t('admin_login')}</h3>
              <form onSubmit={submitAdminLogin}>
                <div className="w-full mb-6">
                  <div className="input-group">
                    <input 
                      type="password" 
                      className="input"
                      value={adminPassword} 
                      onChange={(e) => setAdminPassword(e.target.value)} 
                      autoFocus 
                      required 
                      autoComplete="off"
                    />
                    <label className="user-label">{t('admin_password')}</label>
                  </div>
                </div>
                <div className="pt-2">
                  {isLoadingAdmin ? (
                    <Loader small={true} />
                  ) : (
                    <button type="submit" className="btn-primary">
                      {t('enter_dashboard')}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStudentModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content form-container !p-8"
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <button className="close-btn" onClick={() => setShowStudentModal(false)}><X size={24} /></button>
              <h3>{t('student_access')}</h3>
              <form onSubmit={submitStudentLogin}>
                <div className="w-full mb-6">
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="input"
                      value={studentHuaweiId} 
                      onChange={(e) => setStudentHuaweiId(e.target.value)} 
                      autoFocus 
                      required 
                      autoComplete="off"
                    />
                    <label className="user-label">{t('huawei_id')}</label>
                  </div>
                </div>
                <div className="w-full mb-6">
                  <div className="input-group">
                    <input 
                      type="email" 
                      className="input"
                      value={studentEmailLogin} 
                      onChange={(e) => setStudentEmailLogin(e.target.value)} 
                      required 
                      autoComplete="off"
                    />
                    <label className="user-label">{t('email')}</label>
                  </div>
                </div>
              <div className="pt-2">
                {isLoadingStudent ? (
                  <Loader small={true} />
                ) : (
                  <button type="submit" className="btn-primary">
                    {t('access_my_classes')}
                  </button>
                )}
              </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIdHelpModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content form-container !max-w-5xl !w-11/12 !p-6"
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <button className="close-btn" onClick={() => setShowIdHelpModal(false)}><X size={24} /></button>
              <h3 className="mb-4">{t('id_help_title')}</h3>
              <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 flex justify-center p-4">
                <img 
                  src={idImage} 
                  alt={t('id_help_title')} 
                  className="w-full h-auto object-contain max-h-[70vh] rounded-lg cursor-zoom-in" 
                  onClick={() => window.open(idImage, '_blank')} 
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">{t('click_image')}</p>
              <button onClick={() => setShowIdHelpModal(false)} className="btn-primary mt-4">
                {t('got_it')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Home;
