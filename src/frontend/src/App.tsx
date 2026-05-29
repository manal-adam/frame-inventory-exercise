import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FrameListPage } from './pages/FrameListPage';
import { FrameDetailPage } from './pages/FrameDetailPage';
import { FrameFormPage } from './pages/FrameFormPage';
import { CsvUploadPage } from './pages/CsvUploadPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrameListPage />} />
        <Route path="/frames/new" element={<FrameFormPage />} />
        <Route path="/frames/:frameId" element={<FrameDetailPage />} />
        <Route path="/frames/:frameId/edit" element={<FrameFormPage />} />
        <Route path="/upload" element={<CsvUploadPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
