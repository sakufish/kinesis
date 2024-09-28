import React from 'react';

const SignUp: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-center">
        {/* Title */}
        <h1 className="text-white text-5xl font-semibold">SIGN UP</h1>

        {/* Username */}
        <h2 className="text-orange-400 text-3xl font-bold mt-6">JIMBRO3Z</h2>

        {/* Input field */}
        <input
          className="mt-8 w-64 p-3 text-center text-white bg-gray-800 rounded-md focus:outline-none"
          type="text"
          placeholder="Name"
        />

        {/* Submit Button */}
        <button className="block mx-auto mt-6 w-32 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all rounded-md">
          ENTER
        </button>
      </div>
    </div>
  );
};

export default SignUp;
