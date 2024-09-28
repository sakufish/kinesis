import React from 'react';
import BG from './assets/SOLObg.png';

const Solo: React.FC = () => {
  return (
    <div
      className="relative h-screen text-white p-8 flex items-center justify-center"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-85 z-0"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Title */}
        <h1 className="text-white text-5xl font-bold italic mb-10 text-center">GEAR UP...</h1>

        {/* First Section */}
        <div className="group relative p-6 mt-10 bg-transparent hover:bg-[#1E1E1E] rounded-lg transition duration-300 mx-auto">
          {/* Orange Bar - Growing effect */}
          <div className="absolute top-1/2 left-0 h-[10%] w-[4px] bg-orange-500 rounded-r-lg opacity-0 group-hover:opacity-100 group-hover:h-[50%] transition-all duration-300 transform -translate-y-1/2"></div>
          <h2 className="text-2xl font-semibold text-[#FF833A] mb-4">GUIDED</h2>
          <p className="text-white">
            Select muscle groups you would like to target and effectively train. Our AI model will recommend exercises based on your selection.
          </p>
        </div>

        {/* Second Section */}
        <div className="group relative p-6 mt-10 bg-transparent hover:bg-[#1E1E1E] rounded-lg transition duration-300 mx-auto">
          {/* Orange Bar - Growing effect */}
          <div className="absolute top-1/2 left-0 h-[10%] w-[4px] bg-orange-500 rounded-r-lg opacity-0 group-hover:opacity-100 group-hover:h-[50%] transition-all duration-300 transform -translate-y-1/2"></div>
          <h2 className="text-2xl font-bold text-[#FF833A] mb-4">Enter Manually</h2>
          <p className="text-white mb-4">Pick a workout from the following options:</p>

          {/* Continuous Row of List Items */}
          <div className="flex space-x-4 overflow-x-auto whitespace-nowrap">
            <button className="px-4 py-2 bg-transparent border border-white text-white rounded-md hover:text-orange-500 hover:border-orange-500 transition duration-200">
              Push Ups
            </button>
            <button className="px-4 py-2 bg-transparent border border-white text-white rounded-md hover:text-orange-500 hover:border-orange-500 transition duration-200">
              Sit Ups
            </button>
            <button className="px-4 py-2 bg-transparent border border-white text-white rounded-md hover:text-orange-500 hover:border-orange-500 transition duration-200">
              Squats
            </button>
            <button className="px-4 py-2 bg-transparent border border-white text-white rounded-md hover:text-orange-500 hover:border-orange-500 transition duration-200">
              Jump Rope
            </button>
            <button className="px-4 py-2 bg-transparent border border-white text-white rounded-md hover:text-orange-500 hover:border-orange-500 transition duration-200">
              Jumping Jacks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solo;
    