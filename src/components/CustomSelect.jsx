import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({ options, value, onChange, label, className = '', error = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Determine current label logic based on our global scss colors
  let borderColor = '';
  let labelColor = '#6b7280';
  
  if (error) {
    borderColor = '#ef4444';
    labelColor = '#ef4444';
  } else if (isOpen) {
    borderColor = '#3b82f6';
    labelColor = '#3b82f6';
  } else if (value) {
    borderColor = '#10b981';
    labelColor = '#10b981';
  }

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      
      {/* Mimic the .input style from global.scss perfectly */}
      <div 
        className="w-full rounded-[1rem] bg-transparent py-[0.85rem] px-4 text-base cursor-pointer flex justify-between items-center transition-all duration-150 relative z-10"
        style={{ 
          border: `1.5px solid ${borderColor || '#d1d5db'}`,
          backgroundColor: isOpen ? '#ffffff' : 'transparent'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-900 font-medium' : 'text-transparent select-none'}>
          {value ? options.find(o => o.value === value)?.label : 'Select...'}
        </span>
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} 
        />
      </div>
      
      {/* Hard-floating label since it's a select box */}
      <label 
        className="absolute left-[0.9375rem] pointer-events-none transition-all duration-150 z-20"
        style={{ 
          transform: 'translateY(-50%) scale(0.85)', 
          top: 0,
          backgroundColor: '#ffffff', 
          padding: '0 0.4em', 
          fontWeight: 600, 
          letterSpacing: '0.5px',
          color: labelColor
        }}
      >
        {label}
      </label>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-[100] overflow-hidden py-1.5"
          >
            {options.map((option) => (
              <div 
                key={option.value}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  value === option.value 
                  ? 'bg-blue-50/50 text-[#3b82f6] font-bold border-l-2 border-[#3b82f6]' 
                  : 'text-gray-600 font-medium hover:bg-gray-50 border-l-2 border-transparent'
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
