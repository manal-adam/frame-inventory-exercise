import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteFrame, getFrame } from '../api/frames';
import type { Frame, FrameHistoryEntry } from '../types/frame';
import { getStatusChipClass } from '../utils/statusChip';

export function FrameDetailPage() {
  const { frameId } = useParams<{ frameId: string }>();
  const navigate = useNavigate();
  const [frame, setFrame] = useState<Frame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!frameId) return;

    getFrame(frameId)
      .then(setFrame)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [frameId]);

  function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getTimelineItemClass(entry: FrameHistoryEntry): string {
    return entry.action === 'CREATE' ? 'tl-item create' : 'tl-item';
  }

  function getActionVerb(action: string): string {
    return action === 'CREATE' ? 'created this frame' : 'updated this frame';
  }

  async function handleDelete() {
    if (!frameId) return;
    if (!window.confirm('Are you sure you want to delete this frame?')) return;

    setDeleting(true);
    try {
      await deleteFrame(frameId);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete frame');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading frame...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-text">Error: {error}</p>
        <Link to="/" className="btn outlined mt-2">
          Back to list
        </Link>
      </div>
    );
  }

  if (!frame) {
    return (
      <div className="page">
        <p>Frame not found</p>
        <Link to="/" className="btn outlined mt-2">
          Back to list
        </Link>
      </div>
    );
  }

  const sortedHistory = [...frame.history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <Link to="/" className="back-link">
            ← Back to frames
          </Link>
          <h1 className="page-title-inline">
            <span className="id">{frame.frameId}</span>
            <span className={getStatusChipClass(frame.status)}>
              <span className="dot"></span>
              {frame.status}
            </span>
          </h1>
        </div>
        <div className="btn-group">
          <Link to={`/frames/${frame.frameId}/edit`} className="btn primary">
            Edit frame
          </Link>
          <button
            type="button"
            className="btn danger-ghost"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </header>

      <div className="surface">
        <div className="section-block">
          <h2>Details</h2>
          <div className="kv">
            <div>
              <span className="k">Frame ID</span>
              <span className="v mono">{frame.frameId}</span>
            </div>
            <div>
              <span className="k">Type</span>
              <span className="v">{frame.type}</span>
            </div>
            <div>
              <span className="k">Format</span>
              <span className={`v ${!frame.format ? 'muted' : ''}`}>
                {frame.format || '—'}
              </span>
            </div>
            <div>
              <span className="k">Environment</span>
              <span className={`v ${!frame.environment ? 'muted' : ''}`}>
                {frame.environment || '—'}
              </span>
            </div>
            <div>
              <span className="k">Status</span>
              <span className="v">{frame.status}</span>
            </div>
            <div>
              <span className="k">Created</span>
              <span className="v mono">{formatDateTime(frame.createdDate)}</span>
            </div>
            <div>
              <span className="k">Last Modified</span>
              <span className="v mono">{formatDateTime(frame.modifiedDate)}</span>
            </div>
          </div>
        </div>

        <div className="section-block">
          <h2>History</h2>
          {sortedHistory.length === 0 ? (
            <p className="text-muted">No history recorded.</p>
          ) : (
            <div className="timeline">
              {sortedHistory.map((entry, index) => (
                <div key={index} className={getTimelineItemClass(entry)}>
                  <div className="tl-meta">
                    <span className="who">{entry.user}</span>
                    <span className="verb">{getActionVerb(entry.action)}</span>
                    <span className="when">{formatDateTime(entry.timestamp)}</span>
                  </div>
                  {entry.changes.length > 0 && (
                    <div className="tl-body">
                      {entry.changes.map((change, changeIndex) => (
                        <div key={changeIndex} className="diff-row">
                          <span className="field-name">{change.field}</span>
                          <span className="from">{change.oldValue || '(empty)'}</span>
                          <span className="arrow">→</span>
                          <span className="to">{change.newValue || '(empty)'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
