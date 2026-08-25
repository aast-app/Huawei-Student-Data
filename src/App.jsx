import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home.jsx';
import Classes from './pages/Classes.jsx';
import Admin from './pages/Admin.jsx';
import Footer from './components/Footer';

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

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <Toaster position="top-center" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
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
      <AppContent />
    </Router>
  );
}

export default App;
