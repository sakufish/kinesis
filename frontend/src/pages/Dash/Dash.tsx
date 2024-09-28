import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Left from './assets/left.png';
import BottomRight from './assets/bottomRight.png';
import Preferences from './assets/settings.png';
import Solo from './assets/SOLO.png';
import SoloHover from './assets/SOLO_hover.png';
import Duo from './assets/DUO.png';
import DuoHover from './assets/DUO_hover.png';
import Achievement from './assets/Achievement.png';
import AchievementHover from './assets/Achievement_hover.png';
import Model from './assets/model.png';

const Dashboard: React.FC = () => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      const userId = Cookies.get('userId');
      if (userId) {
        try {
          const response = await fetch(`http://localhost:3000/api/user/${userId}`);
          const data = await response.json();
          if (response.ok) {
            setUserName(data.name);
          } else {
            console.error(data.error);
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      }
    };
    fetchUserName();
  }, []);

  return (
    <div className="h-screen bg-black text-white relative p-8">
      <img src={Left} alt="Left Side Graphic" className="absolute top-14 left-0 object-cover w-16 h-auto" />
      <div className="absolute top-32 left-36 w-2/3 z-20">
        <h1 className="text-4xl font-semibold italic leading-snug w-[40rem]">"THE BODY ACHIEVES WHAT THE MIND BELIEVES."</h1>
        <h2 className="text-lg mt-2 text-[#FF833A]">- NAPOLEON HILL</h2>
      </div>
      <div className="absolute top-[300px] left-48 z-20">
        <div
          className="relative flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setHoveredIcon('SOLO')}
          onMouseLeave={() => setHoveredIcon(null)}
          onClick={() => navigate('/solo')}
        >
          <div className="absolute left-[-3rem] transform -rotate-90 text-xl font-semibold z-20 italic">SOLO</div>
          <div className="w-40 h-40 bg-transparent border-2 border-[#FF3A3A] rounded-full flex items-center justify-center transition duration-200 hover:bg-[#FF3A3A] hover:z-30">
            <img
              src={hoveredIcon === 'SOLO' ? SoloHover : Solo}
              alt="SOLO Icon"
              className="w-12 h-auto"
            />
          </div>
        </div>
        <div
          className="relative flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setHoveredIcon('ACHIEVEMENTS')}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <div className="absolute top-[-3rem] left-[18rem] transform text-xl font-medium z-20 italic">MY ACHIEVEMENTS</div>
          <div className="mt-[-2rem] absolute w-40 h-40 bg-transparent border-2 border-[#FFB03A] rounded-full flex items-center justify-center transition duration-200 hover:bg-[#FFB03A] hover:z-30" style={{ left: "7rem" }}>
            <img
              src={hoveredIcon === 'ACHIEVEMENTS' ? AchievementHover : Achievement}
              alt="Achievement Icon"
              className="w-12 h-auto"
            />
          </div>
        </div>
        <div
          className="relative flex items-center justify-center mt-[-2rem] cursor-pointer"
          onMouseEnter={() => setHoveredIcon('DUO')}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <div className="absolute left-[-3rem] transform -rotate-90 text-xl font-semibold z-20 italic">DUO</div>
          <div className="w-40 h-40 bg-transparent border-2 border-[#FF833A] rounded-full flex items-center justify-center transition duration-200 hover:bg-[#FF833A] hover:z-30">
            <img
              src={hoveredIcon === 'DUO' ? DuoHover : Duo}
              alt="DUO Icon"
              className="w-16 h-auto"
            />
          </div>
        </div>
      </div>
      <img src={BottomRight} alt="Bottom Right Graphic" className="absolute bottom-0 right-0 w-[25rem] h-auto z-10" />
      <img src={Model} alt="Model" className="absolute top-0 right-20 z-30" style={{ maxHeight: '600px', maxWidth: '600px' }} />
      <div className="absolute bottom-8 right-12 flex items-center space-x-4 z-20">
        <div className="flex items-center space-x-2 mr-14 cursor-pointer">
          <span className="text-sm italic mr-1 ">Preferences</span>
          <img src={Preferences} alt="Preferences Icon" className="w-6 h-auto" />
        </div>
        <div className="text-right">
          <span className="block italic">{userName || '@username'}</span>
          <span className="block text-sm italic font-semibold text-md">WELCOME BACK</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
