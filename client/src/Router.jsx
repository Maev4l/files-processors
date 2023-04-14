import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './home/Home';
import Convert2PDF from './convert2pdf/ConvertToPDF';
import MergePDF from './mergepdf/MergePDF';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/convert2pdf" element={<Convert2PDF />} />
      <Route path="/mergepdf" element={<MergePDF />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
