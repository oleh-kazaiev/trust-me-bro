import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './MinerMeme.css';

const STATUS_MESSAGES = [
  'Initializing crypto miner...',
  'Borrowing a bit of your GPU...',
  'Hashing for friendship... (jk)',
];

const DISPLAY_DURATION_MS = 3200;
const STATUS_ROTATE_MS = DISPLAY_DURATION_MS / STATUS_MESSAGES.length;

const MinerMeme: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchOriginalUrl = useCallback(async () => {
    if (!shortCode) return;

    try {
      const response = await fetch(`${API_BASE_URL}/redirect/${shortCode}`);
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else if (response.status === 404) {
        setError('Link not found. Trust issues? 🤔');
      } else {
        setError('Something went wrong. Try again?');
      }
    } catch {
      setError('Failed to connect. The miner ate your connection.');
    }
  }, [shortCode]);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 300);

    // Status message rotation
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => Math.min(prev + 1, STATUS_MESSAGES.length - 1));
    }, STATUS_ROTATE_MS);

    // Fetch URL after ~3 seconds of "mining"
    const redirectTimeout = setTimeout(() => {
      fetchOriginalUrl();
    }, DISPLAY_DURATION_MS);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      clearTimeout(redirectTimeout);
    };
  }, [fetchOriginalUrl]);

  return (
    <div className="miner-container">
      {/* VHS noise overlay */}
      <div className="vhs-noise" />

      {/* Horizontal tear lines */}
      <div className="tear-line" />
      <div className="tear-line" />
      <div className="tear-line" />
      <div className="tear-line" />

      {/* Random glitch blocks */}
      <div className="glitch-block" />
      <div className="glitch-block" />
      <div className="glitch-block" />

      <h1 className="glitch-title" data-text="⚠️ WARNING: SYSTEM COMPROMISED ⚠️">
        ⚠️ WARNING: SYSTEM COMPROMISED ⚠️
      </h1>

      <p className="glitch-subtitle">Definitely not a crypto miner... trust me bro 😏</p>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>

      <p className="status-text">{error || STATUS_MESSAGES[statusIndex]}</p>

      <p className="percentage">{Math.round(Math.min(progress, 100))}%</p>

      {error && (
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default MinerMeme;
