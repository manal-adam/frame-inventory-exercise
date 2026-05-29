import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { FrameListPage } from './pages/FrameListPage';
import { FrameDetailPage } from './pages/FrameDetailPage';
import { FrameFormPage } from './pages/FrameFormPage';
import { CsvUploadPage } from './pages/CsvUploadPage';

// Mock the API to prevent actual fetch calls
vi.mock('./api/frames', () => ({
  getFrames: vi.fn(() => new Promise(() => {})),
  getFrame: vi.fn(() => new Promise(() => {})),
}));

function renderWithRouter(initialRoute: string) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<FrameListPage />} />
        <Route path="/frames/new" element={<FrameFormPage />} />
        <Route path="/frames/:frameId" element={<FrameDetailPage />} />
        <Route path="/frames/:frameId/edit" element={<FrameFormPage />} />
        <Route path="/upload" element={<CsvUploadPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('App routing', () => {
  it('renders FrameListPage at /', () => {
    renderWithRouter('/');
    expect(screen.getByText('Loading frames...')).toBeInTheDocument();
  });

  it('renders FrameFormPage at /frames/new', () => {
    renderWithRouter('/frames/new');
    expect(screen.getByText('New frame')).toBeInTheDocument();
  });

  it('renders FrameDetailPage at /frames/:frameId', () => {
    renderWithRouter('/frames/FRAME001');
    expect(screen.getByText('Loading frame...')).toBeInTheDocument();
  });

  it('renders FrameFormPage at /frames/:frameId/edit', () => {
    renderWithRouter('/frames/FRAME001/edit');
    expect(screen.getByText('Edit frame')).toBeInTheDocument();
  });

  it('renders CsvUploadPage at /upload', () => {
    renderWithRouter('/upload');
    expect(screen.getByText('Upload CSV')).toBeInTheDocument();
  });
});
