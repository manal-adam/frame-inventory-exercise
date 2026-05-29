import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createFrame, getFrame, updateFrame } from '../api/frames';
import { FRAME_TYPES, FRAME_ENVIRONMENTS, FRAME_STATUSES } from '../constants/frame';
import type { FrameRequest } from '../types/frame';

export function FrameFormPage() {
  const { frameId } = useParams<{ frameId: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(frameId);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FrameRequest>({
    frameId: '',
    type: '',
    format: '',
    environment: '',
    status: '',
  });

  useEffect(() => {
    if (!isEdit || !frameId) return;

    getFrame(frameId)
      .then((frame) => {
        setFormData({
          frameId: frame.frameId,
          type: frame.type,
          format: frame.format || '',
          environment: frame.environment || '',
          status: frame.status,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isEdit, frameId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!formData.frameId.trim()) {
      errors.frameId = 'Frame ID is required';
    }
    if (!formData.type) {
      errors.type = 'Type is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setSubmitting(true);

    const request: FrameRequest = {
      frameId: formData.frameId.trim(),
      type: formData.type,
      format: formData.format?.trim() || null,
      environment: formData.environment || null,
      status: formData.status,
    };

    try {
      if (isEdit && frameId) {
        await updateFrame(frameId, request);
        navigate(`/frames/${frameId}`);
      } else {
        const created = await createFrame(request);
        navigate(`/frames/${created.frameId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading frame...</p>
      </div>
    );
  }

  const cancelHref = isEdit && frameId ? `/frames/${frameId}` : '/';

  return (
    <div className="page">
      <header className="page-header-start">
        <Link to={cancelHref} className="back-link">
          ← {isEdit ? 'Back to frame' : 'Back to frames'}
        </Link>
        <h1 className="page-title">
          {isEdit ? 'Edit frame' : 'New frame'}
        </h1>
      </header>

      {error && (
        <div className="error-banner">{error}</div>
      )}

      <div className="surface">
        <form onSubmit={handleSubmit} className="section-block">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="frameId">
                Frame ID <span className="req">*</span>
              </label>
              <input
                type="text"
                id="frameId"
                name="frameId"
                value={formData.frameId}
                onChange={handleChange}
                disabled={isEdit}
                placeholder="e.g. FRAME001"
              />
              {validationErrors.frameId && (
                <span className="err">{validationErrors.frameId}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="type">
                Type <span className="req">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Select type...</option>
                {FRAME_TYPES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {validationErrors.type && (
                <span className="err">{validationErrors.type}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="format">Format</label>
              <input
                type="text"
                id="format"
                name="format"
                value={formData.format || ''}
                onChange={handleChange}
                placeholder="e.g. D6"
              />
            </div>

            <div className="field">
              <label htmlFor="environment">Environment</label>
              <select
                id="environment"
                name="environment"
                value={formData.environment || ''}
                onChange={handleChange}
              >
                <option value="">Select environment...</option>
                {FRAME_ENVIRONMENTS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="status">
                Status <span className="req">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select status...</option>
                {FRAME_STATUSES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {validationErrors.status && (
                <span className="err">{validationErrors.status}</span>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn primary" disabled={submitting}>
                {submitting ? 'Saving...' : (isEdit ? 'Save changes' : 'Create frame')}
              </button>
              <Link to={cancelHref} className="btn outlined">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
