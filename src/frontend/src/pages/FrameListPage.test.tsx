import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FrameListPage } from './FrameListPage';
import * as framesApi from '../api/frames';
import type { Frame } from '../types/frame';

vi.mock('../api/frames');

const mockFrames: Frame[] = [
  {
    id: '1',
    frameId: 'FRAME001',
    type: 'DIGITAL',
    format: 'D6',
    environment: 'UNDERGROUND',
    status: 'LIVE',
    createdDate: '2024-01-01T10:00:00Z',
    modifiedDate: '2024-01-15T14:30:00Z',
    history: [],
  },
  {
    id: '2',
    frameId: 'FRAME002',
    type: 'CLASSIC',
    format: null,
    environment: null,
    status: 'DRAFT',
    createdDate: '2024-01-02T10:00:00Z',
    modifiedDate: '2024-01-16T09:00:00Z',
    history: [],
  },
];

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <FrameListPage />
    </MemoryRouter>
  );
}

describe('FrameListPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows loading state initially', () => {
    vi.mocked(framesApi.getFrames).mockImplementation(() => new Promise(() => {}));

    renderWithRouter();

    expect(screen.getByText('Loading frames...')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    vi.mocked(framesApi.getFrames).mockRejectedValue(new Error('Network error'));

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  it('shows empty state when no frames exist', async () => {
    vi.mocked(framesApi.getFrames).mockResolvedValue([]);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No frames yet.')).toBeInTheDocument();
    });
    expect(screen.getByText('Create your first frame')).toBeInTheDocument();
  });

  it('displays frames in table', async () => {
    vi.mocked(framesApi.getFrames).mockResolvedValue(mockFrames);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('FRAME001')).toBeInTheDocument();
    });

    expect(screen.getByText('FRAME002')).toBeInTheDocument();
    expect(screen.getByText('DIGITAL')).toBeInTheDocument();
    expect(screen.getByText('CLASSIC')).toBeInTheDocument();
    expect(screen.getByText('D6')).toBeInTheDocument();
    expect(screen.getByText('UNDERGROUND')).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });

  it('shows correct frame count text', async () => {
    // Plural for multiple frames
    vi.mocked(framesApi.getFrames).mockResolvedValue(mockFrames);
    const { unmount } = renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('2 frames')).toBeInTheDocument();
    });

    // Singular for single frame
    unmount();
    vi.mocked(framesApi.getFrames).mockResolvedValue([mockFrames[0]]);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('1 frame')).toBeInTheDocument();
    });
  });

  it('has link to upload CSV page', async () => {
    vi.mocked(framesApi.getFrames).mockResolvedValue(mockFrames);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Frames')).toBeInTheDocument();
    });

    const uploadLink = screen.getByRole('link', { name: 'Upload CSV' });
    expect(uploadLink).toHaveAttribute('href', '/upload');
  });

  it('has link to new frame page', async () => {
    vi.mocked(framesApi.getFrames).mockResolvedValue(mockFrames);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Frames')).toBeInTheDocument();
    });

    const newFrameLink = screen.getByRole('link', { name: 'New frame' });
    expect(newFrameLink).toHaveAttribute('href', '/frames/new');
  });

  it('applies correct chip class for LIVE status', async () => {
    vi.mocked(framesApi.getFrames).mockResolvedValue([mockFrames[0]]);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('LIVE')).toBeInTheDocument();
    });

    const chip = screen.getByText('LIVE').closest('span');
    expect(chip).toHaveClass('chip', 'success');
  });

  it('applies correct chip class for DRAFT status', async () => {
    vi.mocked(framesApi.getFrames).mockResolvedValue([mockFrames[1]]);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('DRAFT')).toBeInTheDocument();
    });

    const chip = screen.getByText('DRAFT').closest('span');
    expect(chip).toHaveClass('chip', 'neutral');
  });

  it('renders table with correct column headers', async () => {
    vi.mocked(framesApi.getFrames).mockResolvedValue(mockFrames);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Frame ID')).toBeInTheDocument();
    });

    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Format')).toBeInTheDocument();
    expect(screen.getByText('Environment')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Modified')).toBeInTheDocument();
  });
});
