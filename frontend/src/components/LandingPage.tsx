import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">🔗 Trust Me Bro</h1>
        <p className="landing-subtitle">The most suspicious URL shortener on the internet</p>

        <div className="landing-features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Lightning fast redirects</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎭</span>
            <span>Definitely not a miner</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🤝</span>
            <span>Trust me bro</span>
          </div>
        </div>

        <div className="landing-cta">
          <p className="cta-text">Want to create your own suspicious links?</p>
          <button className="admin-button" onClick={() => navigate('/admin')}>
            Go to Admin Dashboard
          </button>
        </div>

        <div className="landing-footer">
          <p>Made with 💀 for maximum suspicion</p>
          <p className="disclaimer">* No actual miners were harmed in the making of this website</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
