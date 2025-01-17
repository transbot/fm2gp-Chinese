import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Calculator } from './components/Calculator';
import { Sieve } from './components/Sieve';
import { PrimeCounting } from './components/PrimeCounting';
import { Home } from './pages/Home';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/multiply" element={<Calculator />} />
          <Route path="/sieve" element={<Sieve />} />
          <Route path="/prime-counting" element={<PrimeCounting />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
