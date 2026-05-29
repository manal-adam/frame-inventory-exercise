import { useParams } from 'react-router-dom';

export function FrameDetailPage() {
  const { frameId } = useParams<{ frameId: string }>();

  return (
    <div>
      <h1>Frame: {frameId}</h1>
      <p>Frame details will be implemented here.</p>
    </div>
  );
}
