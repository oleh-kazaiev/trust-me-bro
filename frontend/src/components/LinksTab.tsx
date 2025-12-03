import React from 'react';
import type { Link } from '../types';

interface LinksTabProps {
  links: Link[];
  url: string;
  setUrl: (url: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  generatedLink: string;
  copiedCode: string | null;
  copyToClipboard: (shortCode: string) => void;
  formatDate: (dateString: string) => string;
  truncateUrl: (url: string, maxLength?: number) => string;
}

const LinksTab: React.FC<LinksTabProps> = ({
  links,
  url,
  setUrl,
  handleSubmit,
  isLoading,
  error,
  generatedLink,
  copiedCode,
  copyToClipboard,
  formatDate,
  truncateUrl,
}) => {
  return (
    <>
      <div className="card">
        <h2>Create New Link</h2>
        <form onSubmit={handleSubmit} className="create-form">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to shorten"
            required
            className="url-input"
          />
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Creating...' : 'Shorten'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {generatedLink && (
          <div className="success-message">
            <strong>Generated Link: </strong>
            <a href={generatedLink} target="_blank" rel="noopener noreferrer">
              {generatedLink}
            </a>
          </div>
        )}
      </div>

      <div className="card">
        <h2>📊 Statistics ({links.length} links)</h2>

        {links.length === 0 ? (
          <p className="empty-state">
            No links created yet. Create your first suspicious link above! 😈
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-container desktop-only">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Short Code</th>
                    <th>Original URL</th>
                    <th>Clicks</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.short_code}>
                      <td>
                        <code className="short-code">{link.short_code}</code>
                      </td>
                      <td>
                        <a
                          href={link.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link.original_url}
                          className="url-link"
                        >
                          {truncateUrl(link.original_url)}
                        </a>
                      </td>
                      <td className={`clicks ${link.clicks > 0 ? 'has-clicks' : ''}`}>
                        {link.clicks}
                      </td>
                      <td className="date">{formatDate(link.created_at)}</td>
                      <td>
                        <button
                          onClick={() => copyToClipboard(link.short_code)}
                          className={`copy-btn ${copiedCode === link.short_code ? 'copied' : ''}`}
                        >
                          {copiedCode === link.short_code ? '✓ Copied!' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-cards mobile-only">
              {links.map((link) => (
                <div key={link.short_code} className="link-card">
                  <div className="link-card-header">
                    <code className="short-code">{link.short_code}</code>
                    <span className={`clicks-badge ${link.clicks > 0 ? 'has-clicks' : ''}`}>
                      {link.clicks} clicks
                    </span>
                  </div>
                  <a
                    href={link.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-link"
                  >
                    {truncateUrl(link.original_url, 50)}
                  </a>
                  <div className="link-card-footer">
                    <span className="date">{formatDate(link.created_at)}</span>
                    <button
                      onClick={() => copyToClipboard(link.short_code)}
                      className={`copy-btn ${copiedCode === link.short_code ? 'copied' : ''}`}
                    >
                      {copiedCode === link.short_code ? '✓ Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LinksTab;
