import React from 'react';

export const SkeletonProductCard = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-xl"></div>
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="mt-auto flex justify-between items-center pt-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-10"></div>
      </div>
    </div>
  );
};
