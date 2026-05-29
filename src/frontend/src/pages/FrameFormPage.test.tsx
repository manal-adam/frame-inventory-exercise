import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FrameFormPage } from './FrameFormPage';
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
  history: [],
};

function renderCreateMode() {
  return render(
    <MemoryRouter initialEntries={['/frames/new']}>
      <Routes>
        <Route path="/frames/new" element={<FrameFormPage />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderEditMode(frameId: string) {
  return render(
    <MemoryRouter initialEntries={[`/frames/${frameId}/edit`]}>
      <Routes>
        <Route path="/frames/:frameId/edit" element={<FrameFormPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('FrameFormPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Create mode', () => {
    it('shows "New frame" title in create mode', () => {
      renderCreateMode();

      expect(screen.getByText('New frame')).toBeInTheDocument();
    });

    it('renders empty form in create mode', () => {
      renderCreateMode();

      expect(screen.getByLabelText(/Frame ID/)).toHaveValue('');
      expect(screen.getByLabelText(/Type/)).toHaveValue('');
      expect(screen.getByLabelText(/Format/)).toHaveValue('');
      expect(screen.getByLabelText(/Environment/)).toHaveValue('');
      expect(screen.getByLabelText(/Status/)).toHaveValue('');
    });

    it('submits form and creates frame', async () => {
      const user = userEvent.setup();
      vi.mocked(framesApi.createFrame).mockResolvedValue(mockFrame);

      renderCreateMode();

      await user.type(screen.getByLabelText(/Frame ID/), 'FRAME001');
      await user.selectOptions(screen.getByLabelText(/Type/), 'DIGITAL');
      await user.selectOptions(screen.getByLabelText(/Status/), 'LIVE');
      await user.click(screen.getByRole('button', { name: 'Create frame' }));

      await waitFor(() => {
        expect(framesApi.createFrame).toHaveBeenCalledWith({
          frameId: 'FRAME001',
          type: 'DIGITAL',
          format: null,
          environment: null,
          status: 'LIVE',
        });
      });
    });

    it('shows validation error when required fields missing', async () => {
      const user = userEvent.setup();

      renderCreateMode();

      await user.click(screen.getByRole('button', { name: 'Create frame' }));

      expect(screen.getByText('Frame ID is required')).toBeInTheDocument();
      expect(screen.getByText('Type is required')).toBeInTheDocument();
      expect(screen.getByText('Status is required')).toBeInTheDocument();
      expect(framesApi.createFrame).not.toHaveBeenCalled();
    });

    it('navigates to detail page on successful create', async () => {
      const user = userEvent.setup();
      vi.mocked(framesApi.createFrame).mockResolvedValue(mockFrame);

      renderCreateMode();

      await user.type(screen.getByLabelText(/Frame ID/), 'FRAME001');
      await user.selectOptions(screen.getByLabelText(/Type/), 'DIGITAL');
      await user.selectOptions(screen.getByLabelText(/Status/), 'LIVE');
      await user.click(screen.getByRole('button', { name: 'Create frame' }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/frames/FRAME001');
      });
    });

    it('shows error message when create fails', async () => {
      const user = userEvent.setup();
      vi.mocked(framesApi.createFrame).mockRejectedValue(new Error('Server error'));

      renderCreateMode();

      await user.type(screen.getByLabelText(/Frame ID/), 'FRAME001');
      await user.selectOptions(screen.getByLabelText(/Type/), 'DIGITAL');
      await user.selectOptions(screen.getByLabelText(/Status/), 'LIVE');
      await user.click(screen.getByRole('button', { name: 'Create frame' }));

      await waitFor(() => {
        expect(screen.getByText('Server error')).toBeInTheDocument();
      });
    });
  });

  describe('Edit mode', () => {
    it('shows "Edit frame" title in edit mode', async () => {
      vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

      renderEditMode('FRAME001');

      await waitFor(() => {
        expect(screen.getByText('Edit frame')).toBeInTheDocument();
      });
    });

    it('shows loading state while fetching frame', () => {
      vi.mocked(framesApi.getFrame).mockImplementation(() => new Promise(() => {}));

      renderEditMode('FRAME001');

      expect(screen.getByText('Loading frame...')).toBeInTheDocument();
    });

    it('pre-populates form with frame data', async () => {
      vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

      renderEditMode('FRAME001');

      await waitFor(() => {
        expect(screen.getByLabelText(/Frame ID/)).toHaveValue('FRAME001');
      });

      expect(screen.getByLabelText(/Type/)).toHaveValue('DIGITAL');
      expect(screen.getByLabelText(/Format/)).toHaveValue('D6');
      expect(screen.getByLabelText(/Environment/)).toHaveValue('UNDERGROUND');
      expect(screen.getByLabelText(/Status/)).toHaveValue('LIVE');
    });

    it('disables frameId field in edit mode', async () => {
      vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

      renderEditMode('FRAME001');

      await waitFor(() => {
        expect(screen.getByLabelText(/Frame ID/)).toBeDisabled();
      });
    });

    it('submits form and updates frame', async () => {
      const user = userEvent.setup();
      vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);
      vi.mocked(framesApi.updateFrame).mockResolvedValue(mockFrame);

      renderEditMode('FRAME001');

      await waitFor(() => {
        expect(screen.getByLabelText(/Frame ID/)).toHaveValue('FRAME001');
      });

      await user.selectOptions(screen.getByLabelText(/Status/), 'DRAFT');
      await user.click(screen.getByRole('button', { name: 'Save changes' }));

      await waitFor(() => {
        expect(framesApi.updateFrame).toHaveBeenCalledWith('FRAME001', {
          frameId: 'FRAME001',
          type: 'DIGITAL',
          format: 'D6',
          environment: 'UNDERGROUND',
          status: 'DRAFT',
        });
      });
    });

    it('navigates to detail page on successful update', async () => {
      const user = userEvent.setup();
      vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);
      vi.mocked(framesApi.updateFrame).mockResolvedValue(mockFrame);

      renderEditMode('FRAME001');

      await waitFor(() => {
        expect(screen.getByLabelText(/Frame ID/)).toHaveValue('FRAME001');
      });

      await user.click(screen.getByRole('button', { name: 'Save changes' }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/frames/FRAME001');
      });
    });

    it('shows error message when update fails', async () => {
      const user = userEvent.setup();
      vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);
      vi.mocked(framesApi.updateFrame).mockRejectedValue(new Error('Update failed'));

      renderEditMode('FRAME001');

      await waitFor(() => {
        expect(screen.getByLabelText(/Frame ID/)).toHaveValue('FRAME001');
      });

      await user.click(screen.getByRole('button', { name: 'Save changes' }));

      await waitFor(() => {
        expect(screen.getByText('Update failed')).toBeInTheDocument();
      });
    });

    it('has cancel link back to detail page', async () => {
      vi.mocked(framesApi.getFrame).mockResolvedValue(mockFrame);

      renderEditMode('FRAME001');

      await waitFor(() => {
        expect(screen.getByText('Edit frame')).toBeInTheDocument();
      });

      const cancelLink = screen.getByRole('link', { name: 'Cancel' });
      expect(cancelLink).toHaveAttribute('href', '/frames/FRAME001');
    });
  });
});
