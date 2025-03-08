import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Calculator } from './components/Calculator';
import { Sieve } from './components/Sieve';
import { PrimeCounting } from './components/PrimeCounting';
import { PalindromicPrimes } from './components/PalindromicPrimes';
import { Gcm } from './components/Gcm';
import { PrimeChecker } from './components/PrimeChecker';
import { Fibonacci } from './components/Fibonacci';
import { FastFibonacci } from './components/FastFibonacci';
import { ShortestPath } from './components/ShortestPath';
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
          <Route path="/palindromic-primes" element={<PalindromicPrimes />} />
          <Route path="/gcm" element={<Gcm />} />
          <Route path="/prime-checker" element={<PrimeChecker />} />
          <Route path="/fibonacci" element={<Fibonacci />} />
          <Route path="/fast-fibonacci" element={<FastFibonacci />} />
          <Route path="/shortest-path" element={<ShortestPath />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;