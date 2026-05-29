import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadCsv } from '../api/frames';
import type { CsvUploadResult } from '../types/frame';

export function CsvUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<CsvUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setError(null);
    setResult(null);

    if (selectedFile && !selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const uploadResult = await uploadCsv(file);
      setResult(uploadResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="page">
      <header className="page-header-start">
        <Link to="/" className="back-link">
          ← Back to frames
        </Link>
        <h1 className="page-title">Upload CSV</h1>
      </header>

      {error && (
        <div className="error-banner">{error}</div>
      )}

      <div className="surface">
        <div className="section-block">
          {!result ? (
            <>
              <div className="field">
                <label htmlFor="csv-file">Select CSV file</label>
                <div className="file-input-wrapper">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="csv-file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>
              </div>

              {file && (
                <div className="selected-file" style={{ marginTop: 'var(--sp-2)' }}>
                  Selected: {file.name}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn primary"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <Link to="/" className="btn outlined">
                  Cancel
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2>Upload Complete</h2>
              <div className="upload-results">
                <div className="upload-stat success">
                  <span className="icon">✓</span>
                  <span>{result.totalRows} rows processed</span>
                </div>
                <div className="upload-stat success">
                  <span className="icon">✓</span>
                  <span>{result.insertedCount} frames inserted</span>
                </div>
                {result.skippedCount > 0 && (
                  <div className="upload-stat warning">
                    <span className="icon">⚠</span>
                    <span>{result.skippedCount} duplicates skipped</span>
                  </div>
                )}
                {result.errorCount > 0 && (
                  <div className="upload-stat error">
                    <span className="icon">✗</span>
                    <span>{result.errorCount} errors</span>
                  </div>
                )}
              </div>

              {result.errors.length > 0 && (
                <div className="error-list">
                  <div className="error-list-title">Error Details</div>
                  <ul>
                    {result.errors.map((err, index) => (
                      <li key={index}>
                        Row {err.rowNumber}
                        {err.frameId && ` (${err.frameId})`}: {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => navigate('/')}
                >
                  View frames
                </button>
                <button
                  type="button"
                  className="btn outlined"
                  onClick={handleReset}
                >
                  Upload another
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
