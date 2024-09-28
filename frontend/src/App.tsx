import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import login from './components/login/login'
import Home from './components/Home';
import Pose from './components/Pose';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pose" element={<Pose />} />
      </Routes>
    </Router>
  );
};

export default App;
