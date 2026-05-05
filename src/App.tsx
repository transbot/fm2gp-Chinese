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
import { PiUpperBound } from './components/PiUpperBound';
import { Rotate } from './components/Rotate';
import { GcdComparison } from './components/GcdComparison';
import { Rsa } from './components/Rsa';
import { MillerRabin } from './components/MillerRabin';
import { ExtendedGcd } from './components/ExtendedGcd';
import { BinarySearch } from './components/BinarySearch';
import { LinearSearch } from './components/algorithms/LinearSearch';
import { GraphTraversal } from './components/algorithms/GraphTraversal';
import { Division } from './components/algorithms/Division';
import { Reverse } from './components/algorithms/Reverse';
import { Swap } from './components/algorithms/Swap';
import { PowerAlgorithm } from './components/algorithms/PowerAlgorithm';
import { QuickSort } from './components/algorithms/QuickSort';
import { SteinGcd } from './components/algorithms/SteinGcd';
import { Cycle } from './components/algorithms/Cycle';
import { EulerTheorem } from './components/algorithms/EulerTheorem';
import { FermatTheorem } from './components/algorithms/FermatTheorem';
import { MergeSort } from './components/algorithms/MergeSort';
import { HeapOperations } from './components/algorithms/HeapOperations';
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
          <Route path="/pi-upper-bound" element={<PiUpperBound />} />
          <Route path="/rotate" element={<Rotate />} />
          <Route path="/gcd-comparison" element={<GcdComparison />} />
          <Route path="/extended-gcd" element={<ExtendedGcd />} />
          <Route path="/rsa" element={<Rsa />} />
          <Route path="/miller-rabin" element={<MillerRabin />} />
          <Route path="/binary-search" element={<BinarySearch />} />
          <Route path="/linear-search" element={<LinearSearch />} />
          <Route path="/graph-traversal" element={<GraphTraversal />} />
          <Route path="/division" element={<Division />} />
          <Route path="/reverse" element={<Reverse />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/power" element={<PowerAlgorithm />} />
          <Route path="/quick-sort" element={<QuickSort />} />
          <Route path="/stein-gcd" element={<SteinGcd />} />
          <Route path="/cycle" element={<Cycle />} />
          <Route path="/euler" element={<EulerTheorem />} />
          <Route path="/fermat" element={<FermatTheorem />} />
          <Route path="/merge-sort" element={<MergeSort />} />
          <Route path="/heap" element={<HeapOperations />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;