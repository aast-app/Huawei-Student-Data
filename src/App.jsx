import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home.jsx';
import Classes from './pages/Classes.jsx';
import Admin from './pages/Admin.jsx';
import Footer from './components/Footer';
import LanguageToggle from './components/LanguageToggle';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.4, type: 'spring', bounce: 0, ease: 'easeOut' }}
    className="w-full h-full min-h-screen"
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [targetLang, setTargetLang] = useState(i18n.language);

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  const handleLanguageToggle = () => {
    setTargetLang(i18n.language.startsWith('ar') ? 'en' : 'ar');
  };

  const handleExitComplete = () => {
    if (targetLang !== i18n.language) {
      i18n.changeLanguage(targetLang);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <LanguageToggle onToggle={handleLanguageToggle} targetLang={targetLang} />
      <Toaster position="top-center" />
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        <Routes location={location} key={`${location.pathname}-${targetLang}`}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/classes" element={<PageWrapper><Classes /></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
