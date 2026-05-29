export interface Frame {
  id: string;
  frameId: string;
  type: string;
  format: string | null;
  environment: string | null;
  status: string;
  createdDate: string;
  modifiedDate: string;
  history: FrameHistoryEntry[];
}

export interface FrameHistoryEntry {
  timestamp: string;
  action: 'CREATE' | 'UPDATE';
  user: string;
  changes: ChangedField[];
}

export interface ChangedField {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

export interface FrameRequest {
  frameId: string;
  type: string;
  format?: string | null;
  environment?: string | null;
  status: string;
}

export interface CsvUploadResult {
  totalRows: number;
  insertedCount: number;
  skippedCount: number;
  errorCount: number;
  errors: CsvRowError[];
}

export interface CsvRowError {
  rowNumber: number;
  frameId: string | null;
  message: string;
}
