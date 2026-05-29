export function getStatusChipClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'LIVE':
      return 'chip success';
    case 'DRAFT':
      return 'chip neutral';
    case 'PENDING':
      return 'chip warning';
    case 'INACTIVE':
      return 'chip error';
    default:
      return 'chip neutral';
  }
}
