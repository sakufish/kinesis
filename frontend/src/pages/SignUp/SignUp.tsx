import React, { useState } from 'react';
import Cookies from 'js-cookie';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    try {
      // Make a request to the backend to create a user and get the user ID
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      const { userId } = data; // Assuming backend returns userId

      // Store the userId in a cookie
      Cookies.set('userId', userId, { expires: 365, path: '/' });

      // You can now link the user account with this ID
      console.log('User ID stored in cookie:', userId);
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-white text-5xl font-semibold italic">SIGN UP</h1>
      <h2 className="text-orange-400 text-3xl font-bold mt-6 italic">JIMBRO3Z</h2>

      <input
        className="mt-8 w-64 p-3 text-center text-white bg-[#2B191D] placeholder-[#4F494B] focus:outline-none"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={handleSignUp}
        className="mt-4 px-4 py-2 rounded-md bg-black text-orange-600 border border-orange-600 text-sm shadow-[0px_4px_0px_0px_rgba(255,140,0,1)] hover:shadow-none transition duration-200"
      >
        Enter
      </button>
    </div>
  );
};

export default SignUp;
