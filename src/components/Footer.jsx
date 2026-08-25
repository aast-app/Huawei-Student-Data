import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  // Hide the global full-width footer on the Home page (it has its own embedded one)
  if (location.pathname === '/') return null;

  return (
    <div className="fixed bottom-0 left-0 w-full px-6 lg:px-10 py-3 flex justify-between items-center border-t border-gray-200/50 bg-white/80 backdrop-blur-md z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {/* Left: Logos */}
      <div className="flex items-center gap-4 lg:gap-6 ml-2">
        <img src="/aast-logo.png" alt="AAST" className="h-5 lg:h-6 object-contain opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100" />
        <img src="/huawei-logo.png" alt="Huawei" className="h-5 lg:h-6 object-contain opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100 scale-[1.2]" />
      </div>

      {/* Middle: Copyright */}
      <div className="text-[0.6rem] lg:text-[0.7rem] text-gray-500 font-semibold text-center hidden sm:block">
        &copy; {new Date().getFullYear()} AAST. Developed by Eng. Youssef Wael.
      </div>

      {/* Right: Server Status */}
      <div className="flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <span className="text-[0.6rem] lg:text-[0.7rem] text-gray-600 font-bold tracking-wide uppercase">Operational</span>
      </div>
    </div>
  );
};

export default Footer;
