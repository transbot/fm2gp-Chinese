# Error Feedback and Mobile Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the no-silent-click error feedback audit and establish a mobile-first baseline suitable for a future PWA/Capacitor app store path.

**Architecture:** Keep the current Vite + React + TypeScript app as the source of truth and make shared behavior reusable through `ValidationMessage`, `AlgorithmLayout`, `StepController`, and test helpers. Treat mobile support as a responsive web baseline first: touch-safe controls, safe-area spacing, readable visualizations, and no heavy computation on initial paint.

**Tech Stack:** React 18, TypeScript, Vite 8, React Router 6, Tailwind CSS, Vitest, Testing Library, existing bilingual `LanguageContext`, `translations`, and algorithm catalog metadata.

---

## Current Recovery Point

- Backup commit already pushed before this plan: `758c659 Improve validation feedback for interactive algorithms`.
- Fresh verification before that commit:
  - `npm run test:run`: 12 test files, 122 tests passed.
  - `npx tsc -p tsconfig.app.json --noEmit`: exit 0.
  - `npx eslint . --max-warnings=0`: exit 0.
  - `npm run build`: exit 0.
- The next worker should start with `git status --short --branch` and confirm whether this plan file is the only uncommitted change.

## File Structure

- Create: `src/test/renderAlgorithm.tsx`
- Create: `src/components/common/ValidationMessage.test.tsx`
- Create: `src/lib/algorithms/prime_counting.ts`
- Create: `src/lib/algorithms/prime_counting.test.ts`
- Modify: `src/components/algorithms/validationErrors.test.tsx`
- Modify: `src/components/common/ValidationMessage.tsx`
- Modify: `src/components/common/StepController.tsx`
- Modify: `src/components/common/AlgorithmLayout.tsx`
- Modify: `src/index.css`
- Modify: `src/components/Rsa.tsx`
- Modify: `src/components/PrimeCounting.tsx`
- Modify: legacy pages discovered by the audit matrix in Task 1.
- Modify: `src/i18n/translations.ts`
- Modify: `README.md`

## Audit Rules

Use these rules consistently across all algorithm pages:

- Primary actions blocked by missing input or missing setup remain clickable and show `ValidationMessage`.
- Playback controls that are intrinsically unavailable may remain disabled, but the surrounding UI must explain the state.
- Inputs clear related validation messages when the user edits the input.
- Mobile controls need at least a 44px touch target and must not require hover to reveal meaning.
- Long arrays, matrices, ciphertext, code-like values, and graph containers must scroll or wrap without breaking the page width.

## Task 1: Rebuild the Audit Matrix

**Files:**
- Modify: `docs/superpowers/plans/2026-06-04-error-feedback-mobile-baseline.md`

- [x] **Step 1: Confirm the starting branch and working tree**

Run:

```powershell
git status --short --branch
```

Observed on 2026-06-04: `main` was even with `origin/main`; the plan file had already been committed in `9a727c2`.

- [x] **Step 2: Locate possible silent-click controls**

Run:

```powershell
Get-ChildItem src/components -Recurse -Filter *.tsx |
  Select-String -Pattern 'disabled=','return;','ValidationMessage','role="alert"' |
  Select-Object Path,LineNumber,Line
```

Observed on 2026-06-04: RSA still had an `if (!keyPair || !message) return;` path plus `disabled={!message}` on Encrypt, PrimeCounting still computed a sieve to `10_000_000` during canvas draw, and most remaining disabled controls were playback/navigation controls already tied to step state.

- [x] **Step 3: Fill this matrix before changing code**

Use `covered` only when a page has a test asserting a user-visible message or a visible disabled-state explanation.

| Area | Page | Current focus | Desired state | Status |
| --- | --- | --- | --- | --- |
| Search | `src/components/BinarySearch.tsx` | Sort-first and empty-target feedback | Covered by validation tests | covered |
| Graphs | `src/components/ShortestPath.tsx` | Next before start / next after complete | Start-first and complete-state feedback covered by tests | covered |
| Crypto | `src/components/Rsa.tsx` | Encrypt with empty message after key generation | Click shows bilingual message | covered |
| Number theory | `src/components/PrimeCounting.tsx` | Heavy graph computation on mount | Mobile-safe compute path plus localized chart frame | covered |
| Legacy layout | `src/components/Calculator.tsx` | Header and controls on narrow screens | Uses safe-area spacing and touch targets | covered |
| Legacy layout | `src/components/Gcm.tsx` | Header, controls, and wide step table on narrow screens | Uses safe-area spacing, touch targets, and a labeled local visual frame for the table | covered |
| Legacy layout | `src/components/Rotate.tsx` | Canvas and array controls | Header and controls use mobile-safe spacing; canvas still needs browser viewport review | partial |
| Legacy layout | `src/components/GcdComparison.tsx` | Heavy comparison and control state | Uses safe-area spacing, touch targets, visible progress, and stacked mobile result cards | covered |
| Common UI | `src/components/common/StepController.tsx` | Disabled playback states | Touch-safe and accessible labels | covered |
| Common UI | `src/components/common/AlgorithmLayout.tsx` | Safe-area and mobile spacing | Shared shell for responsive pages | covered |

- [ ] **Step 4: Commit the audit-only update**

Run:

```powershell
git add docs/superpowers/plans/2026-06-04-error-feedback-mobile-baseline.md
git commit -m "Document error feedback and mobile baseline plan"
```

Expected: one docs-only commit.

## Task 2: Extract the Test Render Helper

**Files:**
- Create: `src/test/renderAlgorithm.tsx`
- Modify: `src/components/algorithms/validationErrors.test.tsx`

- [ ] **Step 1: Create the shared helper**

Create `src/test/renderAlgorithm.tsx`:

```tsx
import { render } from '@testing-library/react';
import type React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';

class TestResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = TestResizeObserver as typeof ResizeObserver;
}

export function renderAlgorithm(component: React.ReactElement) {
  return render(
    <LanguageProvider>
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        {component}
      </MemoryRouter>
    </LanguageProvider>
  );
}
```

- [ ] **Step 2: Update validation tests to use the helper**

In `src/components/algorithms/validationErrors.test.tsx`, remove the local `renderAlgorithm`, `MemoryRouter`, `LanguageProvider`, and `TestResizeObserver` definitions, then add:

```tsx
import { renderAlgorithm } from '../../test/renderAlgorithm';
```

- [ ] **Step 3: Verify the refactor**

Run:

```powershell
npm run test:run -- src/components/algorithms/validationErrors.test.tsx
```

Expected: all validation error tests pass with the same test count as before the refactor.

- [ ] **Step 4: Commit**

Run:

```powershell
git add src/test/renderAlgorithm.tsx src/components/algorithms/validationErrors.test.tsx
git commit -m "Extract algorithm render test helper"
```

## Task 3: Make ValidationMessage Mobile and Screen-Reader Friendly

**Files:**
- Create: `src/components/common/ValidationMessage.test.tsx`
- Modify: `src/components/common/ValidationMessage.tsx`

- [ ] **Step 1: Write component tests**

Create `src/components/common/ValidationMessage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ValidationMessage } from './ValidationMessage';

describe('ValidationMessage', () => {
  it('renders nothing without an error key', () => {
    const { container } = render(
      <ValidationMessage errorKey={null} messages={{ required: 'Required' }} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a live alert with the translated message', () => {
    render(<ValidationMessage errorKey="required" messages={{ required: 'Required' }} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Required');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('falls back to the key when a translation is missing', () => {
    render(<ValidationMessage errorKey="missingKey" messages={{}} />);

    expect(screen.getByRole('alert')).toHaveTextContent('missingKey');
  });
});
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```powershell
npm run test:run -- src/components/common/ValidationMessage.test.tsx
```

Expected: fail because `aria-live="polite"` is not present yet.

- [ ] **Step 3: Implement the component update**

Replace `src/components/common/ValidationMessage.tsx` with:

```tsx
import { cn } from '../../lib/utils';

interface ValidationMessageProps {
  errorKey: string | null;
  messages: Record<string, string>;
  className?: string;
}

export function ValidationMessage({ errorKey, messages, className }: ValidationMessageProps) {
  if (!errorKey) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm leading-5 text-red-700',
        'break-words',
        className
      )}
    >
      {messages[errorKey] ?? errorKey}
    </div>
  );
}
```

- [ ] **Step 4: Verify GREEN**

Run:

```powershell
npm run test:run -- src/components/common/ValidationMessage.test.tsx src/components/algorithms/validationErrors.test.tsx
```

Expected: both files pass.

- [ ] **Step 5: Commit**

Run:

```powershell
git add src/components/common/ValidationMessage.tsx src/components/common/ValidationMessage.test.tsx
git commit -m "Improve validation message accessibility"
```

## Task 4: Finish No-Silent-Click Coverage

**Files:**
- Modify: `src/components/algorithms/validationErrors.test.tsx`
- Modify: `src/components/Rsa.tsx`
- Modify: `src/components/ShortestPath.tsx`
- Modify: `src/i18n/translations.ts`
- Modify: additional pages found by Task 1.

- [ ] **Step 1: Add tests for missing coverage**

Append these tests to the relevant `describe` blocks in `src/components/algorithms/validationErrors.test.tsx`:

```tsx
it('explains that RSA needs a message before encryption', () => {
  renderAlgorithm(<Rsa />);

  fireEvent.click(screen.getByRole('button', { name: /Generate Keys/i }));
  fireEvent.click(screen.getByRole('button', { name: /^Encrypt$/i }));

  expect(screen.getByRole('alert')).toHaveTextContent('Enter a message before encrypting');
});

it('explains when shortest path stepping is already complete', () => {
  renderAlgorithm(<ShortestPath />);

  fireEvent.click(screen.getByRole('button', { name: /Start Calculation/i }));

  for (let i = 0; i < 8; i += 1) {
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
  }

  expect(screen.getByRole('alert')).toHaveTextContent(
    'The shortest path calculation is already complete'
  );
});
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```powershell
npm run test:run -- src/components/algorithms/validationErrors.test.tsx
```

Expected: RSA test fails because the encrypt button is disabled for empty messages; shortest-path complete-state test passes only if the loop reaches completion, otherwise adjust the click count to match the current implementation and keep the assertion unchanged.

- [ ] **Step 3: Update RSA translations**

Add to the English block in `src/i18n/translations.ts`:

```ts
rsaMessageRequired: 'Enter a message before encrypting',
```

Add to the Chinese block:

```ts
rsaMessageRequired: '请先输入要加密的消息',
```

- [ ] **Step 4: Update RSA behavior**

In `src/components/Rsa.tsx`, import `ValidationMessage`:

```tsx
import { ValidationMessage } from './common/ValidationMessage';
```

Add state near the other `useState` calls:

```tsx
const [validationErrorKey, setValidationErrorKey] = useState<string | null>(null);
```

Update `generateKeyPair` to clear stale validation:

```tsx
setValidationErrorKey(null);
```

Update the message field:

```tsx
onChange={(e) => {
  setMessage(e.target.value);
  setValidationErrorKey(null);
}}
```

Replace the beginning of `encrypt` with:

```tsx
if (!keyPair) {
  return;
}

if (!message.trim()) {
  setValidationErrorKey('rsaMessageRequired');
  return;
}

setValidationErrorKey(null);
```

Remove `disabled={!message}` from the Encrypt button and render the message below the button row:

```tsx
<ValidationMessage errorKey={validationErrorKey} messages={t} />
```

- [ ] **Step 5: Verify**

Run:

```powershell
npm run test:run -- src/components/algorithms/validationErrors.test.tsx
```

Expected: all validation error tests pass.

- [ ] **Step 6: Commit**

Run:

```powershell
git add src/components/algorithms/validationErrors.test.tsx src/components/Rsa.tsx src/components/ShortestPath.tsx src/i18n/translations.ts
git commit -m "Complete interactive validation feedback coverage"
```

## Task 5: Establish Mobile-Safe Shared Layout

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/common/AlgorithmLayout.tsx`
- Modify: `src/components/common/StepController.tsx`

- [ ] **Step 1: Add global mobile primitives**

Append to `src/index.css`:

```css
@layer base {
  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    min-width: 320px;
  }

  input,
  select,
  textarea,
  button {
    font: inherit;
  }
}

@layer components {
  .safe-app-x {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
  }

  .safe-app-bottom {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
}
```

- [ ] **Step 2: Tighten `AlgorithmLayout` for mobile**

Change the outer wrapper in `src/components/common/AlgorithmLayout.tsx` to:

```tsx
<div className="safe-app-x safe-app-bottom max-w-4xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
```

Change the header container to:

```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
```

Change the title row to:

```tsx
<div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
```

Add `touch-target justify-center` to the home and language buttons.

- [ ] **Step 3: Update `StepController` touch targets and labels**

In `src/components/common/StepController.tsx`, add `aria-label` to the icon buttons and use touch-safe sizing:

```tsx
aria-label={t.stepBackward || 'Step Backward'}
className="touch-target rounded-lg bg-gray-100 p-2 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
```

Use the same pattern for Play/Pause and Step Forward:

```tsx
aria-label={isPlaying ? (t.pause || 'Pause') : (t.play || 'Play')}
className="touch-target rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
```

Keep `title` attributes as desktop affordances.

- [ ] **Step 4: Verify shared layout build**

Run:

```powershell
npx tsc -p tsconfig.app.json --noEmit
npm run test:run -- src/components/algorithms/validationErrors.test.tsx
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit**

Run:

```powershell
git add src/index.css src/components/common/AlgorithmLayout.tsx src/components/common/StepController.tsx
git commit -m "Add mobile-safe shared algorithm controls"
```

## Task 6: Remove Prime Counting Mobile Jank

**Files:**
- Create: `src/lib/algorithms/prime_counting.ts`
- Create: `src/lib/algorithms/prime_counting.test.ts`
- Modify: `src/components/PrimeCounting.tsx`

- [x] **Step 1: Add pure tests**

Create `src/lib/algorithms/prime_counting.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildPrimeCountingSeries } from './prime_counting';

describe('buildPrimeCountingSeries', () => {
  it('builds exact small counts and PNT approximation points', () => {
    const result = buildPrimeCountingSeries({ maxN: 20, samples: 10 });

    expect(result.points.at(-1)).toEqual([20, 8]);
    expect(result.approxPoints.at(-1)?.[0]).toBe(20);
    expect(result.maxX).toBe(20);
    expect(result.maxY).toBeGreaterThanOrEqual(8);
  });

  it('rejects invalid maximum values', () => {
    expect(() => buildPrimeCountingSeries({ maxN: 1, samples: 10 })).toThrow(
      'maxN must be at least 2'
    );
  });
});
```

- [x] **Step 2: Run tests to verify RED**

Run:

```powershell
npm run test:run -- src/lib/algorithms/prime_counting.test.ts
```

Expected: fail because `prime_counting.ts` does not exist.

Observed on 2026-06-04: failed because `./prime_counting` could not be resolved.

- [x] **Step 3: Implement the pure module**

Create `src/lib/algorithms/prime_counting.ts`:

```ts
interface PrimeCountingOptions {
  maxN: number;
  samples: number;
}

interface PrimeCountingSeries {
  points: Array<[number, number]>;
  approxPoints: Array<[number, number]>;
  maxX: number;
  maxY: number;
}

function sieveOfEratosthenes(n: number): boolean[] {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let i = 2; i * i <= n; i += 1) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  return isPrime;
}

export function buildPrimeCountingSeries({
  maxN,
  samples,
}: PrimeCountingOptions): PrimeCountingSeries {
  if (maxN < 2) {
    throw new Error('maxN must be at least 2');
  }

  const step = Math.max(1, Math.floor(maxN / samples));
  const isPrime = sieveOfEratosthenes(maxN);
  const prefixCounts = new Array(maxN + 1).fill(0);

  for (let n = 2; n <= maxN; n += 1) {
    prefixCounts[n] = prefixCounts[n - 1] + (isPrime[n] ? 1 : 0);
  }

  const points: Array<[number, number]> = [];
  const approxPoints: Array<[number, number]> = [];

  for (let n = 2; n <= maxN; n += step) {
    points.push([n, prefixCounts[n]]);
    approxPoints.push([n, n / Math.log(n)]);
  }

  if (points.at(-1)?.[0] !== maxN) {
    points.push([maxN, prefixCounts[maxN]]);
    approxPoints.push([maxN, maxN / Math.log(maxN)]);
  }

  const maxY = Math.max(...points.map((point) => point[1]), ...approxPoints.map((point) => point[1]));

  return {
    points,
    approxPoints,
    maxX: maxN,
    maxY,
  };
}
```

- [x] **Step 4: Refactor `PrimeCounting` to use a lower mobile default**

In `src/components/PrimeCounting.tsx`, import the helper:

```tsx
import { buildPrimeCountingSeries } from '../lib/algorithms/prime_counting';
```

Use a mobile-safe default:

```tsx
const PRIME_COUNTING_MAX_N = 1_000_000;
const PRIME_COUNTING_SAMPLES = 600;
```

Replace the local sieve/count loops inside `drawGraph` with:

```tsx
const { points, approxPoints, maxX, maxY } = buildPrimeCountingSeries({
  maxN: PRIME_COUNTING_MAX_N,
  samples: PRIME_COUNTING_SAMPLES,
});
```

- [x] **Step 5: Verify**

Run:

```powershell
npm run test:run -- src/lib/algorithms/prime_counting.test.ts
npm run build
```

Expected: tests pass and production build exits 0. If `dist/index.html` changes, restore it before committing.

Observed on 2026-06-04: `prime_counting.test.ts` passed with 2 tests, production build exited 0, and generated `dist/index.html` noise was restored.

- [x] **Step 6: Commit**

Run:

```powershell
git add src/lib/algorithms/prime_counting.ts src/lib/algorithms/prime_counting.test.ts src/components/PrimeCounting.tsx
git commit -m "Reduce prime counting mobile workload"
```

Committed as `b1e1144 Reduce prime counting mobile workload`.

## Task 7: Manual Mobile Viewport Verification

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-06-04-error-feedback-mobile-baseline.md`

- [x] **Step 1: Start the dev server**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL, normally `http://127.0.0.1:5173/`.

Observed on 2026-06-04: ports 5173 and 5174 were occupied, so Vite started at `http://127.0.0.1:5175/`.

- [x] **Step 2: Check these viewports**

Use browser responsive mode or an automation tool against the local URL:

| Viewport | Pages |
| --- | --- |
| 390 x 844 | `/`, `/binary-search`, `/rsa`, `/prime-counting`, `/shortest-path` |
| 430 x 932 | `/`, `/linear-search`, `/quick-sort`, `/graph-traversal` |
| 768 x 1024 | `/`, `/heap`, `/merge-sort`, `/gcd-comparison` |

Acceptance checks:

- No horizontal page scroll except intentional scroll containers for wide data.
- Header buttons remain tappable.
- Search filters fit vertically and do not overlap.
- Main algorithm buttons are at least 44px tall.
- Validation messages are visible immediately after blocked actions.
- Prime counting page does not freeze during initial render.
- Graph and matrix pages remain readable without text overlap.

Observed on 2026-06-04: `agent-browser` was not installed in PATH, so Chrome headless screenshots were used instead. Screenshots were generated for home, binary search, RSA, prime counting, shortest path, graph traversal, and heap operations. Header clipping found in the first pass was fixed for home, BinarySearch, RSA, PrimeCounting, and ShortestPath. Prime counting rendered without freezing after the reduced workload. Shortest-path and prime-counting visuals remain wide and need real-device or browser responsive-mode review for final app-store polish.

Follow-up completed on 2026-06-04: `ResponsiveVisualFrame` now scopes wide visual overflow for prime counting and shortest path. Prime counting chart, shortest-path graph, and shortest-path matrix use localized horizontal frames instead of relying on whole-page overflow.

Follow-up completed on 2026-06-04: legacy pages `Calculator`, `Gcm`, `Rotate`, and `GcdComparison` received the same safe-area header pattern and touch-target button treatment used by the newer algorithm pages. `Gcm` now scopes its step table inside a labeled `ResponsiveVisualFrame`; the validation test suite covers that local overflow region. `GcdComparison` result cards stack on phone-width screens. `Rotate` no longer uses the old horizontal header layout, but its canvas still needs manual viewport review before being considered final app-store polish.

Follow-up verification note on 2026-06-04: attempts to capture 390px Chrome headless screenshots from this shell did not produce screenshot files, even for an `about:blank` smoke test. Treat the automated screenshot check as blocked by the local browser/headless environment; manual browser responsive-mode review is still required for the four legacy pages.

Follow-up completed on 2026-06-04: number-theory legacy pages `PrimeChecker`, `Sieve`, `MillerRabin`, `ExtendedGcd`, `PalindromicPrimes`, and `PiUpperBound` now use the same safe-area header pattern and touch-target button treatment. `PrimeChecker` no longer disables its primary Check action for empty input; clicking it shows the existing validation message. `ExtendedGcd` now scopes traditional and binary step tables inside labeled `ResponsiveVisualFrame` regions, and `PiUpperBound` wraps its polygon canvas in a labeled visual frame.

Follow-up completed on 2026-06-04: table-style wide content in Egyptian multiplication and the generic power algorithm now uses labeled `ResponsiveVisualFrame` regions. The page body no longer needs to own horizontal overflow for those tables; any narrow-screen horizontal scrolling is scoped to the table frame.

- [x] **Step 3: Record results in README**

Add a short subsection under `## 验证命令` / `## Verification Commands`:

```markdown
### Mobile Baseline Checks

- 390 x 844: home, binary search, RSA, prime counting, shortest path
- 430 x 932: home, linear search, quick sort, graph traversal
- 768 x 1024: home, heap operations, merge sort, GCD comparison
```

- [x] **Step 4: Run final verification**

Run:

```powershell
npx eslint . --max-warnings=0
npx tsc -p tsconfig.app.json --noEmit
npm run test:run
npm run build
```

Expected: all commands exit 0. Restore `dist/index.html` if it changes because of `npm run build`.

Observed on 2026-06-04: `npx eslint . --max-warnings=0`, `npx tsc -p tsconfig.app.json --noEmit`, `npm run test:run` with 14 files and 129 tests, and `npm run build` all exited 0. Generated `dist/index.html` noise was restored.

Continuation observed on 2026-06-04: the focused validation suite was extended to 34 tests and now verifies that the Euclidean GCM step table is exposed as a labeled local overflow region.

Continuation observed on 2026-06-04: the focused validation suite was extended to 36 tests and now verifies both PrimeChecker click-time empty-input feedback and the labeled ExtendedGcd table overflow region.

Continuation observed on 2026-06-04: the focused validation suite was extended to 38 tests and now verifies labeled local overflow regions for Egyptian multiplication and power step tables.

Continuation observed on 2026-06-04: the focused validation suite was extended to 40 tests and now verifies that GraphTraversal add-node controls have accessible labels and visible feedback for empty or duplicate node input.

Continuation observed on 2026-06-04: the focused validation suite was extended to 43 tests and now verifies that GraphTraversal add-edge controls show visible feedback for missing endpoints, self-loops, and duplicate directed edges.

Continuation observed on 2026-06-04: the focused validation suite was extended to 44 tests and now verifies that RSA encrypted ciphertext output is scoped inside a labeled `ResponsiveVisualFrame` region.

Continuation observed on 2026-06-04: the focused validation suite was extended to 45 tests and now verifies that FastFibonacci final large-number output is scoped inside a labeled `ResponsiveVisualFrame` region.

Continuation observed on 2026-06-04: shared `ExplanationPanel` code snippets now use a labeled `ResponsiveVisualFrame`, covered by a new component test. The full suite is expected to include 16 test files and 146 tests after verification.

Continuation observed on 2026-06-04: shared `StepController` progress and speed controls now have accessible labels, and the speed selector uses the touch-target primitive. The full suite is expected to include 17 test files and 147 tests after verification.

Continuation observed on 2026-06-04: FastFibonacci, RSA, and GraphTraversal primary form controls now expose stable accessible names for mobile and assistive-technology users. The focused validation suite was extended to 48 tests, and the full suite is expected to include 17 test files and 150 tests after verification.

Continuation observed on 2026-06-04: beginner sorting pages `BubbleSort`, `InsertionSort`, and `SelectionSort` now expose stable accessible names for their array inputs and use touch-target sizing for primary controls. The focused validation suite was extended to 49 tests, and the full suite is expected to include 17 test files and 151 tests after verification.

Continuation observed on 2026-06-04: advanced sorting and heap pages `MergeSort`, `QuickSort`, and `HeapOperations` now expose stable accessible names for their array and insert-value inputs and use touch-target sizing for primary controls. The focused validation suite was extended to 50 tests, and the full suite is expected to include 17 test files and 152 tests after verification.

Continuation observed on 2026-06-04: `PrefixSum` and `Swap` now expose stable accessible names for their multi-value and range input controls and use touch-target sizing for primary controls. The focused validation suite was extended to 52 tests, and the full suite is expected to include 17 test files and 154 tests after verification.

Continuation observed on 2026-06-04: search and array utility pages `BinarySearch`, `LinearSearch`, `FrequencyCount`, `TwoSum`, and `Reverse` now expose stable accessible names for their primary inputs and use touch-target sizing for their main controls. The focused validation suite was extended to 57 tests, and the full suite is expected to include 17 test files and 159 tests after verification.

Continuation observed on 2026-06-04: legacy number-theory pages `Calculator`, `Gcm`, and `ExtendedGcd` now expose stable accessible names for their numeric inputs and algorithm selector, with touch-target sizing on those controls. The focused validation suite was extended to 60 tests, and the full suite is expected to include 17 test files and 162 tests after verification.

Continuation observed on 2026-06-04: number-theory input pages `PrimeChecker`, `Sieve`, `MillerRabin`, and `PalindromicPrimes` now expose stable accessible names for their primary inputs and use touch-target sizing on those controls. The focused validation suite was extended to 64 tests, and the full suite is expected to include 17 test files and 166 tests after verification.

Continuation observed on 2026-06-04: arithmetic and theorem pages `Division`, `PowerAlgorithm`, `FermatTheorem`, `EulerTheorem`, and `SteinGcd` now expose stable accessible names for their primary numeric inputs and use touch-target sizing on those controls. The focused validation suite was extended to 69 tests, and the full suite is expected to include 17 test files and 171 tests after verification.

Continuation observed on 2026-06-04: visual legacy pages `Fibonacci`, `Cycle`, `Rotate`, and `PiUpperBound` now expose stable accessible names for their primary inputs and sliders, with touch-target sizing on those controls. The test render helper now stubs canvas drawing context methods so canvas-backed visual pages can be included in component coverage without jsdom console noise. The focused validation suite was extended to 73 tests, and the full suite is expected to include 17 test files and 175 tests after verification.

- [x] **Step 5: Commit and push**

Run:

```powershell
git add README.md docs/superpowers/plans/2026-06-04-error-feedback-mobile-baseline.md
git commit -m "Document mobile baseline verification"
git push origin main
```

Observed on 2026-06-04: final local commit was created for the README, plan, mobile header fixes, and TypeScript compatibility cleanup, then pushed to `origin/main`.

## Final Checklist

- [x] Every open row in the audit matrix is either `covered` or has a documented reason for remaining deferred.
- [x] `ValidationMessage` is accessible and wraps long text.
- [x] Main blocked actions show bilingual feedback instead of silently returning.
- [x] Shared algorithm layout uses safe-area horizontal/bottom spacing.
- [x] Step controls have touch-size buttons and icon button labels.
- [x] Heavy prime-counting computation is extracted and tested.
- [x] Manual mobile viewport results are recorded.
- [x] Full verification commands exit 0 before the final push.
