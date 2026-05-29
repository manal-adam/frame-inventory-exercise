import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFrames } from '../api/frames';
import type { Frame } from '../types/frame';
import { getStatusChipClass } from '../utils/statusChip';

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

  if (loading) {
    return (
      <div className="page">
        <p>Loading frames...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Frames</h1>
          <p className="page-subtitle">
            {frames.length} {frames.length === 1 ? 'frame' : 'frames'}
          </p>
        </div>
        <div className="btn-group">
          <Link to="/upload" className="btn secondary">
            Upload CSV
          </Link>
          <Link to="/frames/new" className="btn primary">
            New frame
          </Link>
        </div>
      </header>

      {frames.length === 0 ? (
        <div className="surface empty">
          <p className="text-muted">No frames yet.</p>
          <p className="mt-2">
            <Link to="/frames/new" className="btn primary">Create your first frame</Link>
            {' or '}
            <Link to="/upload" className="btn secondary">Upload a CSV</Link>
          </p>
        </div>
      ) : (
        <div className="surface overflow-hidden">
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
