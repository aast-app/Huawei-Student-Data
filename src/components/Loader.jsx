import React from 'react';

const Loader = ({ small = false }) => {
  if (small) {
    return (
      <div className="flex-col w-full flex items-center justify-center py-1">
        <div className="w-8 h-8 border-[3px] border-transparent text-[#3b82f6] animate-spin flex items-center justify-center border-t-[#3b82f6] rounded-full">
          <div className="w-5 h-5 border-[3px] border-transparent text-[#e61d2b] animate-spin flex items-center justify-center border-t-[#e61d2b] rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col gap-4 w-full flex items-center justify-center py-8">
      <div className="w-20 h-20 border-4 border-transparent text-[#3b82f6] text-4xl animate-spin flex items-center justify-center border-t-[#3b82f6] rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-[#e61d2b] text-2xl animate-spin flex items-center justify-center border-t-[#e61d2b] rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;
