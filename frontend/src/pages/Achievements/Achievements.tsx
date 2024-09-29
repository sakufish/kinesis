import Spline from '@splinetool/react-spline';
import { Link } from 'react-router-dom';
import home from './assets/home.png';

const Achievements = () => {
  return (
    <div>
        <div className='absolute z-10 w-[10rem] h-[4rem] bottom-0 right-0 bg-black'></div>
        
        <div className='absolute z-10 w-8 h-auto top-6 left-6'>
            <Link to="/dash">
                <img src={home} alt="home icon" className='cursor-pointer'/>
            </Link>
        </div>

        <div style={{ width: '100vw', height: '100vh' }} className='z-[-1]'>
            <Spline scene="https://prod.spline.design/w-76n014wJ8ERV50/scene.splinecode" />
        </div>
    </div>
  );
};

export default Achievements;
