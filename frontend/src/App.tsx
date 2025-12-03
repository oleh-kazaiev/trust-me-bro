import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MinerMeme from './components/MinerMeme';
import Dashboard from './components/Dashboard';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/:shortCode" element={<MinerMeme />} />
      </Routes>
    </Router>
  );
}

export default App;
