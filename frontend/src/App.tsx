import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MinerMeme from './components/MinerMeme';
import AdminDashboard from './components/AdminDashboard';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/:shortCode" element={<MinerMeme />} />
      </Routes>
    </Router>
  );
}

export default App;
