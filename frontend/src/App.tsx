import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import UniversityPage from './pages/UniversityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path=":university" element={<UniversityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
