import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import KinesisLogo from './assets/KinesisLogo.png';
import LeftWing from './assets/LeftWing.png';
import RightWing from './assets/RightWing.png';
import BottomGlow from './assets/BottomGlow.png';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/signup/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      const { userId } = data;

      Cookies.set('userId', userId, { expires: 365, path: '/' });

      navigate('/dash');

      console.log('User ID stored in cookie:', userId);
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black font-roboto-condensed">
      {}
      <motion.img
        src={KinesisLogo}
        alt="Kinesis Logo"
        className="w-8 h-auto mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {}
      <motion.h1
        className="text-white text-5xl font-medium italic"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        SIGN UP
      </motion.h1>

      {}
      <motion.h2
        className="text-orange-400 text-3xl font-bold mt-2 italic"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        KINESIS
      </motion.h2>

      {}
      <motion.input
        className="mt-12 w-64 p-3 text-center text-white border border-[#606060] bg-[#2B191D] placeholder-[#4F494B] focus:outline-none z-10"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {}
      <motion.button
        onClick={handleSignUp}
        className="mt-4 px-4 py-1 rounded-md text-[#FF833A] border border-[#FF833A] text-sm shadow-[0px_4px_0px_0px_rgba(255,140,0,1)] hover:shadow-none transition duration-200 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        ENTER
      </motion.button>

      {}
      <motion.img
        src={LeftWing}
        alt="Left Wing"
        className="absolute left-44 top-1/4 w-32 h-auto"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      <motion.img
        src={RightWing}
        alt="Right Wing"
        className="absolute right-44 top-1/4 w-32 h-auto"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {}
      <img src={BottomGlow} alt="Bottom Glow" className="absolute bottom-0 w-full z-[0]" />
    </div>
  );
};

export default SignUp;
