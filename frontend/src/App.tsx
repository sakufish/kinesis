import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home';
import Pose from './pages/Pose';
import Dash from './pages/Dash/Dash';
import Solo from './pages/solo/Solo';
// import Achievement from './pages/Achievements/Achievements';
// import Workout from './pages/workout/workout';
import Guided from './pages/Guided/Guided';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pose" element={<Pose />} />
        <Route path="/signup" element = {<SignUp />} />
        <Route path="/dash" element = {<Dash />} />
        <Route path="/solo" element = {<Solo />} />

        {/* <Route path="/Achievements" element = {< Achievement/>} />
        <Route path="/workout" element = {<Workout />} /> */}


        <Route path="/guided" element = {<Guided />} />
      </Routes>
    </Router>
  );
};

export default App;
