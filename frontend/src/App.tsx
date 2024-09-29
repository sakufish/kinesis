import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home';
import Pose from './pages/Pose';
import Dash from './pages/Dash/Dash';
import Solo from './pages/solo/Solo';
import Achievement from './pages/Achievements/Achievements';

import Guided from './pages/Guided/Guided';
import Chat from './pages/Chat/ChatPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/pose" element={<Pose />} />
        <Route path="/" element = {<SignUp />} />
        <Route path="/dash" element = {<Dash />} />
        <Route path="/solo" element = {<Solo />} />
        <Route path="/chat" element = {<Chat />} />
        <Route path="/achievements" element = {< Achievement/>} />
        <Route path="/guided" element = {<Guided />} />
      </Routes>
    </Router>
  );
};

export default App;
