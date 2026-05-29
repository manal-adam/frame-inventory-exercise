export const FRAME_TYPES = ['DIGITAL', 'CLASSIC'] as const;

export const FRAME_ENVIRONMENTS = [
  'UNDERGROUND',
  'STATION',
  'ROADSIDE',
  'AIRPORT',
  'MALL',
  'BUS_SHELTER',
] as const;

export const FRAME_STATUSES = ['DRAFT', 'LIVE', 'PENDING', 'INACTIVE'] as const;

export type FrameType = (typeof FRAME_TYPES)[number];
export type FrameEnvironment = (typeof FRAME_ENVIRONMENTS)[number];
export type FrameStatus = (typeof FRAME_STATUSES)[number];
