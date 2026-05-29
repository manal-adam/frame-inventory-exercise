import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFrames } from '../api/frames';
import type { Frame } from '../types/frame';

export function FrameListPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getFrames()
      .then(setFrames)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function getStatusChipClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'LIVE':
        return 'chip success';
      case 'DRAFT':
        return 'chip neutral';
      case 'PENDING':
        return 'chip warning';
      case 'INACTIVE':
        return 'chip error';
      default:
        return 'chip neutral';
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--sp-4)' }}>
        <p>Loading frames...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'var(--sp-4)' }}>
        <p style={{ color: 'var(--error-main)' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--sp-4)' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--sp-3)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            Frames
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {frames.length} {frames.length === 1 ? 'frame' : 'frames'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
          <Link to="/upload" className="btn secondary">
            Upload CSV
          </Link>
          <Link to="/frames/new" className="btn primary">
            New frame
          </Link>
        </div>
      </header>

      {frames.length === 0 ? (
        <div className="surface" style={{ padding: 'var(--sp-4)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No frames yet.</p>
          <p style={{ marginTop: 'var(--sp-2)' }}>
            <Link to="/frames/new" className="btn primary">Create your first frame</Link>
            {' or '}
            <Link to="/upload" className="btn secondary">Upload a CSV</Link>
          </p>
        </div>
      ) : (
        <div className="surface" style={{ overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Frame ID</th>
                <th>Type</th>
                <th>Format</th>
                <th>Environment</th>
                <th>Status</th>
                <th>Modified</th>
              </tr>
            </thead>
            <tbody>
              {frames.map((frame) => (
                <tr
                  key={frame.frameId}
                  onClick={() => navigate(`/frames/${frame.frameId}`)}
                >
                  <td>
                    <span className="id">{frame.frameId}</span>
                  </td>
                  <td>{frame.type}</td>
                  <td>{frame.format || '—'}</td>
                  <td>{frame.environment || '—'}</td>
                  <td>
                    <span className={getStatusChipClass(frame.status)}>
                      <span className="dot"></span>
                      {frame.status}
                    </span>
                  </td>
                  <td>
                    <span className="mono">{formatDate(frame.modifiedDate)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
