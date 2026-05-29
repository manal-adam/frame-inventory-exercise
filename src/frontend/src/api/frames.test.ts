import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getFrames,
  getFrame,
  createFrame,
  updateFrame,
  deleteFrame,
  uploadCsv,
} from './frames';
import type { Frame, FrameRequest } from '../types/frame';

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

describe('frames API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getFrames', () => {
    it('fetches frames from /api/frames', async () => {
      const mockFrames = [mockFrame];
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockFrames),
      });
      vi.stubGlobal('fetch', mockFetch);

      const result = await getFrames();

      expect(mockFetch).toHaveBeenCalledWith('/api/frames');
      expect(result).toEqual(mockFrames);
    });

    it('throws error when response is not ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }));

      await expect(getFrames()).rejects.toThrow('Failed to fetch frames: 500');
    });
  });

  describe('getFrame', () => {
    it('fetches single frame by frameId', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockFrame),
      });
      vi.stubGlobal('fetch', mockFetch);

      const result = await getFrame('FRAME001');

      expect(mockFetch).toHaveBeenCalledWith('/api/frames/FRAME001');
      expect(result).toEqual(mockFrame);
    });

    it('throws error when response is not ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }));

      await expect(getFrame('INVALID')).rejects.toThrow('Failed to fetch frame: 404');
    });
  });

  describe('createFrame', () => {
    it('posts new frame to /api/frames', async () => {
      const request: FrameRequest = {
        frameId: 'FRAME001',
        type: 'DIGITAL',
        status: 'DRAFT',
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockFrame),
      });
      vi.stubGlobal('fetch', mockFetch);

      const result = await createFrame(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/frames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      expect(result).toEqual(mockFrame);
    });

    it('throws error when response is not ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
      }));

      await expect(createFrame({ frameId: '', type: '', status: '' })).rejects.toThrow(
        'Failed to create frame: 400'
      );
    });
  });

  describe('updateFrame', () => {
    it('puts updated frame to /api/frames/:frameId', async () => {
      const request: FrameRequest = {
        frameId: 'FRAME001',
        type: 'DIGITAL',
        status: 'LIVE',
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockFrame),
      });
      vi.stubGlobal('fetch', mockFetch);

      const result = await updateFrame('FRAME001', request);

      expect(mockFetch).toHaveBeenCalledWith('/api/frames/FRAME001', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      expect(result).toEqual(mockFrame);
    });

    it('throws error when response is not ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }));

      await expect(
        updateFrame('INVALID', { frameId: '', type: '', status: '' })
      ).rejects.toThrow('Failed to update frame: 404');
    });
  });

  describe('deleteFrame', () => {
    it('deletes frame at /api/frames/:frameId', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
      });
      vi.stubGlobal('fetch', mockFetch);

      await deleteFrame('FRAME001');

      expect(mockFetch).toHaveBeenCalledWith('/api/frames/FRAME001', {
        method: 'DELETE',
      });
    });

    it('throws error when response is not ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }));

      await expect(deleteFrame('INVALID')).rejects.toThrow('Failed to delete frame: 404');
    });
  });

  describe('uploadCsv', () => {
    it('posts file to /api/frames/upload', async () => {
      const mockResult = {
        totalRows: 10,
        insertedCount: 8,
        skippedCount: 1,
        errorCount: 1,
        errors: [],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      });
      vi.stubGlobal('fetch', mockFetch);

      const file = new File(['content'], 'test.csv', { type: 'text/csv' });
      const result = await uploadCsv(file);

      expect(mockFetch).toHaveBeenCalledWith('/api/frames/upload', {
        method: 'POST',
        body: expect.any(FormData),
      });
      expect(result).toEqual(mockResult);
    });

    it('throws error when response is not ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
      }));

      const file = new File([''], 'test.csv');
      await expect(uploadCsv(file)).rejects.toThrow('Failed to upload CSV: 400');
    });
  });
});
