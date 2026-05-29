import type { Frame, FrameRequest, CsvUploadResult } from '../types/frame';

const API_BASE = '/api/frames';

export async function getFrames(): Promise<Frame[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`Failed to fetch frames: ${response.status}`);
  }
  return response.json();
}

export async function getFrame(frameId: string): Promise<Frame> {
  const response = await fetch(`${API_BASE}/${frameId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch frame: ${response.status}`);
  }
  return response.json();
}

export async function createFrame(request: FrameRequest): Promise<Frame> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Failed to create frame: ${response.status}`);
  }
  return response.json();
}

export async function updateFrame(frameId: string, request: FrameRequest): Promise<Frame> {
  const response = await fetch(`${API_BASE}/${frameId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Failed to update frame: ${response.status}`);
  }
  return response.json();
}

export async function deleteFrame(frameId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${frameId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete frame: ${response.status}`);
  }
}

export async function uploadCsv(file: File): Promise<CsvUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Failed to upload CSV: ${response.status}`);
  }
  return response.json();
}
