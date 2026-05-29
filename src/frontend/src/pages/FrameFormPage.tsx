import { useParams } from 'react-router-dom';

export function FrameFormPage() {
  const { frameId } = useParams<{ frameId: string }>();
  const isEdit = Boolean(frameId);

  return (
    <div>
      <h1>{isEdit ? 'Edit frame' : 'New frame'}</h1>
      <p>Frame form will be implemented here.</p>
    </div>
  );
}
