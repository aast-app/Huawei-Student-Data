import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LanguageToggle = ({ onToggle, targetLang }) => {
  const isArabic = targetLang.startsWith('ar');

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="fixed top-4 start-4 md:top-6 md:start-6 z-50 flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 text-gray-800 font-bold py-1.5 px-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      title={isArabic ? "Switch to English" : "التبديل للعربية"}
    >
      <span className="text-lg">🌍</span>
      <span className="text-xs tracking-wide font-black">
        {isArabic ? "EN" : "عربي"}
      </span>
    </motion.button>
  );
};

export default LanguageToggle;
