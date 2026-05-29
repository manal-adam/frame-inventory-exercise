import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CsvUploadPage } from './CsvUploadPage';
import * as framesApi from '../api/frames';
import type { CsvUploadResult } from '../types/frame';

vi.mock('../api/frames');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSuccessResult: CsvUploadResult = {
  totalRows: 100,
  insertedCount: 95,
  skippedCount: 3,
  errorCount: 2,
  errors: [
    { rowNumber: 5, frameId: 'FRAME005', message: 'Invalid status' },
    { rowNumber: 12, frameId: null, message: 'Missing frame_id' },
  ],
};

const mockSuccessNoErrors: CsvUploadResult = {
  totalRows: 50,
  insertedCount: 50,
  skippedCount: 0,
  errorCount: 0,
  errors: [],
};

function renderUploadPage() {
  return render(
    <MemoryRouter initialEntries={['/upload']}>
      <Routes>
        <Route path="/upload" element={<CsvUploadPage />} />
      </Routes>
    </MemoryRouter>
  );
}

function createCsvFile(name: string = 'test.csv'): File {
  return new File(['frame_id,type,status\nFRAME001,DIGITAL,LIVE'], name, {
    type: 'text/csv',
  });
}

describe('CsvUploadPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders upload page with title', () => {
    renderUploadPage();

    expect(screen.getByText('Upload CSV')).toBeInTheDocument();
  });

  it('has back link to frames list', () => {
    renderUploadPage();

    const backLink = screen.getByRole('link', { name: '← Back to frames' });
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('shows file input', () => {
    renderUploadPage();

    expect(screen.getByLabelText('Select CSV file')).toBeInTheDocument();
  });

  it('upload button disabled when no file selected', () => {
    renderUploadPage();

    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    expect(uploadButton).toBeDisabled();
  });

  it('upload button enabled when file selected', async () => {
    const user = userEvent.setup();
    renderUploadPage();

    const fileInput = screen.getByLabelText('Select CSV file');
    await user.upload(fileInput, createCsvFile());

    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    expect(uploadButton).toBeEnabled();
  });

  it('shows selected filename', async () => {
    const user = userEvent.setup();
    renderUploadPage();

    const fileInput = screen.getByLabelText('Select CSV file');
    await user.upload(fileInput, createCsvFile('inventory.csv'));

    expect(screen.getByText('Selected: inventory.csv')).toBeInTheDocument();
  });

  it('validates file type is CSV', async () => {
    renderUploadPage();

    const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByLabelText('Select CSV file');

    // Use fireEvent to bypass accept attribute filtering in jsdom
    fireEvent.change(fileInput, { target: { files: [txtFile] } });

    expect(screen.getByText('Please select a CSV file')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled();
  });

  it('shows loading state during upload', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.uploadCsv).mockImplementation(() => new Promise(() => {}));

    renderUploadPage();

    const fileInput = screen.getByLabelText('Select CSV file');
    await user.upload(fileInput, createCsvFile());
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    expect(screen.getByRole('button', { name: 'Uploading...' })).toBeDisabled();
  });

  it('displays success results', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.uploadCsv).mockResolvedValue(mockSuccessNoErrors);

    renderUploadPage();

    const fileInput = screen.getByLabelText('Select CSV file');
    await user.upload(fileInput, createCsvFile());
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => {
      expect(screen.getByText('Upload Complete')).toBeInTheDocument();
    });

    expect(screen.getByText('50 rows processed')).toBeInTheDocument();
    expect(screen.getByText('50 frames inserted')).toBeInTheDocument();
  });

  it('displays skipped count when present', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.uploadCsv).mockResolvedValue(mockSuccessResult);

    renderUploadPage();

    const fileInput = screen.getByLabelText('Select CSV file');
    await user.upload(fileInput, createCsvFile());
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => {
      expect(screen.getByText('3 duplicates skipped')).toBeInTheDocument();
    });
  });

  it('displays error count in results', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.uploadCsv).mockResolvedValue(mockSuccessResult);

    renderUploadPage();

    const fileInput = screen.getByLabelText('Select CSV file');
    await user.upload(fileInput, createCsvFile());
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => {
      expect(screen.getByText('2 errors')).toBeInTheDocument();
    });
  });

  it('displays error details list', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.uploadCsv).mockResolvedValue(mockSuccessResult);

    renderUploadPage();

    const fileInput = screen.getByLabelText('Select CSV file');
    await user.upload(fileInput, createCsvFile());
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => {
      expect(screen.getByText('Error Details')).toBeInTheDocument();
    });

    expect(screen.getByText(/Row 5 \(FRAME005\): Invalid status/)).toBeInTheDocument();
    expect(screen.getByText(/Row 12: Missing frame_id/)).toBeInTheDocument();
  });

  it('shows error banner on upload failure', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.uploadCsv).mockRejectedValue(new Error('Network error'));

    renderUploadPage();

    const fileInput = screen.getByLabelText('Select CSV file');
    await user.upload(fileInput, createCsvFile());
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('can upload another file after success', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.uploadCsv).mockResolvedValue(mockSuccessNoErrors);

    renderUploadPage();

    const fileInput = screen.getByLabelText('Select CSV file');
    await user.upload(fileInput, createCsvFile());
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => {
      expect(screen.getByText('Upload Complete')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Upload another' }));

    expect(screen.getByLabelText('Select CSV file')).toBeInTheDocument();
    expect(screen.queryByText('Upload Complete')).not.toBeInTheDocument();
  });

  it('navigates to frames list on view frames click', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.uploadCsv).mockResolvedValue(mockSuccessNoErrors);

    renderUploadPage();

    const fileInput = screen.getByLabelText('Select CSV file');
    await user.upload(fileInput, createCsvFile());
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => {
      expect(screen.getByText('Upload Complete')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'View frames' }));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
