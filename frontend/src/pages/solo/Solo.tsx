import React, { useState } from 'react';
import BG from './assets/SOLObg.png';

const Solo: React.FC = () => {
  const [reps, setReps] = useState<number | ''>(''); 
  const [selectedOption, setSelectedOption] = useState<string | null>(null); 

  
  const workouts = ['Push Ups', 'Sit Ups', 'Squats', 'Jump Rope', 'Jumping Jacks'];
  const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Glutes'];

  return (
    <div
      className="relative h-screen text-white p-8 flex items-center justify-center"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {}
      <div className="absolute inset-0 bg-black opacity-85 z-0"></div>

      {}
      <div className="relative z-10 w-full max-w-2xl">
        {}
        <h1 className="text-white text-5xl font-bold italic mb-10 text-center">GEAR UP...</h1>

        {}
        <div className="group relative p-6 mt-10 bg-transparent hover:bg-[#1E1E1E] rounded-lg transition duration-300 mx-auto">
          {}
          <div className="absolute top-1/2 left-0 h-[10%] w-[4px] bg-orange-500 rounded-r-lg opacity-0 group-hover:opacity-100 group-hover:h-[50%] transition-all duration-300 transform -translate-y-1/2"></div>
          <h2 className="text-2xl font-semibold text-[#FF833A] mb-4">GUIDED</h2>
          <p className="text-white mb-4">
            Select muscle groups you would like to target and effectively train. An AI model will recommend you suggested stretches and exercises based on selections.
          </p>

          {}
          <div className="flex space-x-4 overflow-x-auto whitespace-nowrap">
            {muscleGroups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedOption(group)}
                className={`px-4 py-2 bg-transparent border ${
                  selectedOption === group
                    ? 'bg-orange-500 border-orange-500 text-orange-500'
                    : 'border-white text-white'
                } rounded-md hover:text-orange-500 hover:border-orange-500 transition duration-200`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {}
        <div className="group relative p-6 mt-10 bg-transparent hover:bg-[#1E1E1E] rounded-lg transition duration-300 mx-auto">
          {}
          <div className="absolute top-1/2 left-0 h-[10%] w-[4px] bg-orange-500 rounded-r-lg opacity-0 group-hover:opacity-100 group-hover:h-[50%] transition-all duration-300 transform -translate-y-1/2"></div>
          <h2 className="text-2xl font-bold text-[#FF833A] mb-4">Enter Manually</h2>
          <p className="text-white mb-4">Enter what workout, exercise, or stretch you would like to do. Monitor your form and reps alongside.</p>

          {}
          <div className="flex space-x-4 overflow-x-auto whitespace-nowrap">
            {workouts.map((workout) => (
              <button
                key={workout}
                onClick={() => setSelectedOption(workout)}
                className={`px-4 py-2 bg-transparent border ${
                  selectedOption === workout
                    ? 'bg-orange-500 border-orange-500 text-orange-500'
                    : 'border-white text-white'
                } rounded-md hover:text-orange-500 hover:border-orange-500 transition duration-200`}
              >
                {workout}
              </button>
            ))}
          </div>

          {}
          <div className="mt-6">
            <label htmlFor="reps" className="text-white font-thin text-md">Reps:</label>
            <input
              id="reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value))}
              placeholder="0"
              className="ml-4 px-4 py-2 w-20 bg-[#2B191D] text-white rounded-md focus:outline-none transition duration-200"
            />
          </div>
        </div>

        {}
        <div className="flex justify-end mt-10 text-center w-[50rem]">
          <button className="px-8 py-2 bg-[#FF833A] text-black font-bold rounded-lg hover:bg-orange-600 transition duration-300">
            Next <span className='text-xl'>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Solo;
