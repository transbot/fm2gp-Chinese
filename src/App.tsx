import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { translations } from './i18n/translations';
import { getAlgorithmPath } from './data/algorithmCatalog';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const Calculator = lazy(() => import('./components/Calculator').then((module) => ({ default: module.Calculator })));
const Sieve = lazy(() => import('./components/Sieve').then((module) => ({ default: module.Sieve })));
const PrimeCounting = lazy(() => import('./components/PrimeCounting').then((module) => ({ default: module.PrimeCounting })));
const PalindromicPrimes = lazy(() => import('./components/PalindromicPrimes').then((module) => ({ default: module.PalindromicPrimes })));
const Gcm = lazy(() => import('./components/Gcm').then((module) => ({ default: module.Gcm })));
const PrimeChecker = lazy(() => import('./components/PrimeChecker').then((module) => ({ default: module.PrimeChecker })));
const Fibonacci = lazy(() => import('./components/Fibonacci').then((module) => ({ default: module.Fibonacci })));
const FastFibonacci = lazy(() => import('./components/FastFibonacci').then((module) => ({ default: module.FastFibonacci })));
const ShortestPath = lazy(() => import('./components/ShortestPath').then((module) => ({ default: module.ShortestPath })));
const PiUpperBound = lazy(() => import('./components/PiUpperBound').then((module) => ({ default: module.PiUpperBound })));
const Rotate = lazy(() => import('./components/Rotate').then((module) => ({ default: module.Rotate })));
const GcdComparison = lazy(() => import('./components/GcdComparison').then((module) => ({ default: module.GcdComparison })));
const Rsa = lazy(() => import('./components/Rsa').then((module) => ({ default: module.Rsa })));
const MillerRabin = lazy(() => import('./components/MillerRabin').then((module) => ({ default: module.MillerRabin })));
const ExtendedGcd = lazy(() => import('./components/ExtendedGcd').then((module) => ({ default: module.ExtendedGcd })));
const BinarySearch = lazy(() => import('./components/BinarySearch').then((module) => ({ default: module.BinarySearch })));
const LinearSearch = lazy(() => import('./components/algorithms/LinearSearch').then((module) => ({ default: module.LinearSearch })));
const GraphTraversal = lazy(() => import('./components/algorithms/GraphTraversal').then((module) => ({ default: module.GraphTraversal })));
const Division = lazy(() => import('./components/algorithms/Division').then((module) => ({ default: module.Division })));
const Reverse = lazy(() => import('./components/algorithms/Reverse').then((module) => ({ default: module.Reverse })));
const Swap = lazy(() => import('./components/algorithms/Swap').then((module) => ({ default: module.Swap })));
const PowerAlgorithm = lazy(() => import('./components/algorithms/PowerAlgorithm').then((module) => ({ default: module.PowerAlgorithm })));
const QuickSort = lazy(() => import('./components/algorithms/QuickSort').then((module) => ({ default: module.QuickSort })));
const BubbleSort = lazy(() => import('./components/algorithms/BubbleSort').then((module) => ({ default: module.BubbleSort })));
const InsertionSort = lazy(() => import('./components/algorithms/InsertionSort').then((module) => ({ default: module.InsertionSort })));
const SelectionSort = lazy(() => import('./components/algorithms/SelectionSort').then((module) => ({ default: module.SelectionSort })));
const PrefixSum = lazy(() => import('./components/algorithms/PrefixSum').then((module) => ({ default: module.PrefixSum })));
const FrequencyCount = lazy(() => import('./components/algorithms/FrequencyCount').then((module) => ({ default: module.FrequencyCount })));
const TwoSum = lazy(() => import('./components/algorithms/TwoSum').then((module) => ({ default: module.TwoSum })));
const SteinGcd = lazy(() => import('./components/algorithms/SteinGcd').then((module) => ({ default: module.SteinGcd })));
const Cycle = lazy(() => import('./components/algorithms/Cycle').then((module) => ({ default: module.Cycle })));
const EulerTheorem = lazy(() => import('./components/algorithms/EulerTheorem').then((module) => ({ default: module.EulerTheorem })));
const FermatTheorem = lazy(() => import('./components/algorithms/FermatTheorem').then((module) => ({ default: module.FermatTheorem })));
const MergeSort = lazy(() => import('./components/algorithms/MergeSort').then((module) => ({ default: module.MergeSort })));
const HeapOperations = lazy(() => import('./components/algorithms/HeapOperations').then((module) => ({ default: module.HeapOperations })));

function RouteLoadingFallback() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm text-sm text-gray-600">
        {t.loadingAlgorithm ?? (lang === 'zh' ? '正在加载算法...' : 'Loading algorithm...')}
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={getAlgorithmPath('multiply')} element={<Calculator />} />
          <Route path={getAlgorithmPath('sieve')} element={<Sieve />} />
          <Route path={getAlgorithmPath('prime-counting')} element={<PrimeCounting />} />
          <Route path={getAlgorithmPath('palindromic-primes')} element={<PalindromicPrimes />} />
          <Route path={getAlgorithmPath('gcm')} element={<Gcm />} />
          <Route path={getAlgorithmPath('prime-checker')} element={<PrimeChecker />} />
          <Route path={getAlgorithmPath('fibonacci')} element={<Fibonacci />} />
          <Route path={getAlgorithmPath('fast-fibonacci')} element={<FastFibonacci />} />
          <Route path={getAlgorithmPath('shortest-path')} element={<ShortestPath />} />
          <Route path={getAlgorithmPath('pi-upper-bound')} element={<PiUpperBound />} />
          <Route path={getAlgorithmPath('rotate')} element={<Rotate />} />
          <Route path={getAlgorithmPath('gcd-comparison')} element={<GcdComparison />} />
          <Route path={getAlgorithmPath('extended-gcd')} element={<ExtendedGcd />} />
          <Route path={getAlgorithmPath('rsa')} element={<Rsa />} />
          <Route path={getAlgorithmPath('miller-rabin')} element={<MillerRabin />} />
          <Route path={getAlgorithmPath('binary-search')} element={<BinarySearch />} />
          <Route path={getAlgorithmPath('linear-search')} element={<LinearSearch />} />
          <Route path={getAlgorithmPath('frequency-count')} element={<FrequencyCount />} />
          <Route path={getAlgorithmPath('two-sum')} element={<TwoSum />} />
          <Route path={getAlgorithmPath('graph-traversal')} element={<GraphTraversal />} />
          <Route path={getAlgorithmPath('division')} element={<Division />} />
          <Route path={getAlgorithmPath('reverse')} element={<Reverse />} />
          <Route path={getAlgorithmPath('swap')} element={<Swap />} />
          <Route path={getAlgorithmPath('power')} element={<PowerAlgorithm />} />
          <Route path={getAlgorithmPath('bubble-sort')} element={<BubbleSort />} />
          <Route path={getAlgorithmPath('insertion-sort')} element={<InsertionSort />} />
          <Route path={getAlgorithmPath('selection-sort')} element={<SelectionSort />} />
          <Route path={getAlgorithmPath('prefix-sum')} element={<PrefixSum />} />
          <Route path={getAlgorithmPath('quick-sort')} element={<QuickSort />} />
          <Route path={getAlgorithmPath('stein-gcd')} element={<SteinGcd />} />
          <Route path={getAlgorithmPath('cycle')} element={<Cycle />} />
          <Route path={getAlgorithmPath('euler')} element={<EulerTheorem />} />
          <Route path={getAlgorithmPath('fermat')} element={<FermatTheorem />} />
          <Route path={getAlgorithmPath('merge-sort')} element={<MergeSort />} />
          <Route path={getAlgorithmPath('heap')} element={<HeapOperations />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}

export default App;
