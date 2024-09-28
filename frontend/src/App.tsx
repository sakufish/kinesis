import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home';
import Pose from './pages/Pose';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pose" element={<Pose />} />
        <Route path="/signup" element = {<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
