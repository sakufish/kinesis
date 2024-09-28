import React, { useState, useEffect } from 'react';
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

const Modal: React.FC<{ onClose: () => void; userId: string }> = ({ onClose, userId }) => {
  const [injuries, setInjuries] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [details, setDetails] = useState<string>(''); 

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setInjuries(data.injuries || []);
          setDifficulty(data.difficulty || 'Medium');
          setDetails(data.details || '');
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, [userId]);

  const handleAddInjury = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setInjuries((prevInjuries) => [...prevInjuries, inputValue.trim()]);
      setInputValue(''); 
    }
  };

  const handleRemoveInjury = (index: number) => {
    setInjuries((prevInjuries) => prevInjuries.filter((_, i) => i !== index));
  };

  const handleSavePreferences = async () => {
    try {
      await fetch(`http://localhost:3000/api/user/${userId}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ injuries, difficulty, details }),
      });
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50 p-8 font-roboto-condensed">
      <div className="bg-[#241919] text-white p-8 rounded-lg w-[600px] relative">
        <button
          className="absolute top-2 right-2 text-white text-2xl hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>

        <h1 className="text-2xl font-bold tracking-wide mb-6 text-center italic">PREFERENCES</h1>

        <h2 className="text-xl font-semibold mb-2 italic">INJURIES</h2>
        <p className="mb-4 italic text-[#888888]">Jimbro3z will help you come up with exercises without influencing injuries. Enter to add.</p>

        <div className="flex flex-wrap gap-2 items-center border border-[#5F5F5F] rounded mb-4 bg-[#D9D9D9] bg-opacity-5 shadow-inner-top px-3 py-1">
          {injuries.map((injury, index) => (
            <div
              key={index}
              className="flex my-[3px] text-white items-center bg-[#241919] border border-[#5F5F5F] p-1 rounded"
            >
              <span>{injury}</span>
              <button
                onClick={() => handleRemoveInjury(index)}
                className="ml-2 text-red-500 font-bold hover:text-red-700"
              >
                X
              </button>
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddInjury}
            placeholder="Type and press Enter"
            className="flex-grow p-2 bg-transparent text-white outline-none"
          />
        </div>

        <h2 className="text-xl font-semibold mb-2 italic">DIFFICULTY</h2>
        <p className="mb-4 italic text-[#888888]">Your difficulty level will help us recommend you appropriate exercises.</p>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-2 rounded text-white text-sm border border-[#5F5F5F] bg-[#241919] shadow-inner-top"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <h2 className="text-xl font-semibold mt-6 mb-2 italic">DETAILS</h2>
        <p className="mb-4 italic text-[#888888]">Add in details to help Jimbro3z understand your lifestyle.</p>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Enter details here..."
          className="w-full p-2 rounded bg-[#241919] text-white border border-[#5F5F5F] shadow-inner-top"
          rows={4}
        ></textarea>

        <button onClick={handleSavePreferences} className="mt-6 w-full py-2 bg-orange-500 text-white rounded">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const id = Cookies.get('userId');
      if (id) {
        setUserId(id);
        try {
          const response = await fetch(`http://localhost:3000/api/user/${id}`);
          const data = await response.json();
          if (response.ok) {
            setUserName(data.name);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="h-screen bg-black text-white relative p-8 font-roboto-condensed">
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
        <div
          className="flex items-center space-x-2 mr-14 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="text-sm italic mr-1 ">Preferences</span>
          <img src={Preferences} alt="Preferences Icon" className="w-6 h-auto" />
        </div>
        <div className="text-right">
          <span className="block italic">{userName || '@username'}</span>
          <span className="block text-sm italic font-semibold text-md">WELCOME BACK</span>
        </div>
      </div>

      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} userId={userId || ''} />}
    </div>
  );
};

export default Dashboard;
