import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FrameDetailPage } from './FrameDetailPage';
import * as framesApi from '../api/frames';
import type { Frame } from '../types/frame';

vi.mock('../api/frames');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockFrame: Frame = {
  id: '1',
  frameId: 'FRAME001',
  type: 'DIGITAL',
  format: 'D6',
  environment: 'UNDERGROUND',
  status: 'LIVE',
  createdDate: '2024-01-01T10:00:00Z',
  modifiedDate: '2024-01-15T14:30:00Z',
  history: [
    {
      timestamp: '2024-01-01T10:00:00Z',
      action: 'CREATE',
      user: 'admin',
      changes: [],
    },
    {
      timestamp: '2024-01-15T14:30:00Z',
      action: 'UPDATE',
      user: 'editor',
      changes: [
        {
          field: 'status',
          oldValue: 'DRAFT',
          newValue: 'LIVE',
        },
      ],
    },
  ],
};

const mockFrameWithNulls: Frame = {
  id: '2',
  frameId: 'FRAME002',
  type: 'CLASSIC',
  format: null,
  environment: null,
  status: 'DRAFT',
  createdDate: '2024-01-02T10:00:00Z',
  modifiedDate: '2024-01-16T09:00:00Z',
  history: [],
};

function renderWithRouter(frameId: string) {
  return render(
    <MemoryRouter initialEntries={[`/frames/${frameId}`]}>
      <Routes>
        <Route path="/frames/:frameId" element={<FrameDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('FrameDetailPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows loading state initially', () => {
    vi.mocked(framesApi.getFrame).mockImplementation(() => new Promise(() => {}));

    renderWithRouter('FRAME001');

    expect(screen.getByText('Loading frame...')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    vi.mocked(framesApi.getFrame).mockRejectedValue(new Error('Network error'));

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Back to list' })).toHaveAttribute('href', '/');
  });

  it('displays frame details', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    expect(screen.getByText('DIGITAL')).toBeInTheDocument();
    expect(screen.getByText('D6')).toBeInTheDocument();
    expect(screen.getByText('UNDERGROUND')).toBeInTheDocument();
  });

  it('displays em dash for null values', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrameWithNulls);

    renderWithRouter('FRAME002');

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    const emDashes = screen.getAllByText('—');
    expect(emDashes.length).toBeGreaterThanOrEqual(2);
  });

  it('applies correct chip class for status', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    const statusChip = screen.getAllByText('LIVE')[0].closest('span');
    expect(statusChip).toHaveClass('chip', 'success');
  });

  it('has link to edit frame', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    const editLink = screen.getByRole('link', { name: 'Edit frame' });
    expect(editLink).toHaveAttribute('href', '/frames/FRAME001/edit');
  });

  it('has back link to frame list', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    const backLink = screen.getByRole('link', { name: '← Back to frames' });
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('displays history section', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('displays history entries with user and action', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
    });

    expect(screen.getByText('created this frame')).toBeInTheDocument();
    expect(screen.getByText('editor')).toBeInTheDocument();
    expect(screen.getByText('updated this frame')).toBeInTheDocument();
  });

  it('displays field changes in history', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('status')).toBeInTheDocument();
    });

    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });

  it('shows empty history message when no history', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrameWithNulls);

    renderWithRouter('FRAME002');

    await waitFor(() => {
      expect(screen.getByText('No history recorded.')).toBeInTheDocument();
    });
  });

  it('sorts history entries newest first', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('editor')).toBeInTheDocument();
    });

    const timelineItems = document.querySelectorAll('.tl-item');
    expect(timelineItems.length).toBe(2);

    const firstItem = timelineItems[0];
    expect(firstItem.textContent).toContain('editor');
    expect(firstItem.textContent).toContain('updated this frame');
  });

  it('has delete button', async () => {
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('deletes frame and navigates to list on confirm', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);
    vi.mocked(framesApi.deleteFrame).mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(framesApi.deleteFrame).toHaveBeenCalledWith('FRAME001');
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('does not delete frame when confirm is cancelled', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(framesApi.deleteFrame).not.toHaveBeenCalled();
  });

  it('shows error when delete fails', async () => {
    const user = userEvent.setup();
    vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);
    vi.mocked(framesApi.deleteFrame).mockRejectedValue(new Error('Delete failed'));
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithRouter('FRAME001');

    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.getByText('Error: Delete failed')).toBeInTheDocument();
    });
  });
});
