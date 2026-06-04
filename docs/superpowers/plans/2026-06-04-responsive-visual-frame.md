# Responsive Visual Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared responsive frame for wide algorithm visuals and apply it to the highest-risk mobile pages without relying on whole-page horizontal overflow.

**Architecture:** Create a layout-only `ResponsiveVisualFrame` component that owns local horizontal scrolling, minimum visual width, class merging, and accessibility labels. Use it in `PrimeCounting` for the canvas region and in `ShortestPath` for the directed graph image and matrix table, keeping page titles, controls, and explanatory copy outside the scroll regions.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest, Testing Library, existing `cn` helper from `src/lib/utils.ts`, Chrome headless for manual viewport screenshots when available.

---

## File Structure

- Create: `src/components/common/ResponsiveVisualFrame.tsx`
- Create: `src/components/common/ResponsiveVisualFrame.test.tsx`
- Modify: `src/components/PrimeCounting.tsx`
- Modify: `src/components/ShortestPath.tsx`
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-06-04-error-feedback-mobile-baseline.md`

Do not modify `src/index.css` for this work. Do not add dependencies.

## Task 1: ResponsiveVisualFrame Component

**Files:**
- Create: `src/components/common/ResponsiveVisualFrame.test.tsx`
- Create: `src/components/common/ResponsiveVisualFrame.tsx`

- [x] **Step 1: Write failing component tests**

Create `src/components/common/ResponsiveVisualFrame.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResponsiveVisualFrame } from './ResponsiveVisualFrame';

describe('ResponsiveVisualFrame', () => {
  it('renders children inside a labeled region', () => {
    render(
      <ResponsiveVisualFrame label="Prime counting chart">
        <canvas data-testid="chart" />
      </ResponsiveVisualFrame>
    );

    const region = screen.getByRole('region', { name: 'Prime counting chart' });
    expect(within(region).getByTestId('chart')).toBeInTheDocument();
  });

  it('uses the default minimum width as a px CSS variable', () => {
    render(
      <ResponsiveVisualFrame label="Default width">
        <div>wide content</div>
      </ResponsiveVisualFrame>
    );

    const content = screen.getByTestId('responsive-visual-frame-content');
    expect(content).toHaveStyle({ '--visual-min-width': '360px' });
  });

  it('uses a custom minimum width as a px CSS variable', () => {
    render(
      <ResponsiveVisualFrame label="Custom width" minWidth={640}>
        <div>wide content</div>
      </ResponsiveVisualFrame>
    );

    const content = screen.getByTestId('responsive-visual-frame-content');
    expect(content).toHaveStyle({ '--visual-min-width': '640px' });
  });

  it('merges outer and content classes without adding dependencies', () => {
    render(
      <ResponsiveVisualFrame
        label="Classes"
        className="rounded-lg"
        contentClassName="bg-white"
      >
        <div>wide content</div>
      </ResponsiveVisualFrame>
    );

    expect(screen.getByRole('region', { name: 'Classes' })).toHaveClass('rounded-lg');
    expect(screen.getByTestId('responsive-visual-frame-content')).toHaveClass('bg-white');
  });
});
```

- [x] **Step 2: Run tests to verify RED**

Run:

```powershell
npm run test:run -- src/components/common/ResponsiveVisualFrame.test.tsx
```

Expected: fail because `./ResponsiveVisualFrame` does not exist.

Observed on 2026-06-04: failed because `./ResponsiveVisualFrame` could not be resolved.

- [x] **Step 3: Implement the component**

Create `src/components/common/ResponsiveVisualFrame.tsx`:

```tsx
import type React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveVisualFrameProps {
  children: React.ReactNode;
  label: string;
  minWidth?: number;
  className?: string;
  contentClassName?: string;
}

export function ResponsiveVisualFrame({
  children,
  label,
  minWidth = 360,
  className,
  contentClassName,
}: ResponsiveVisualFrameProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn(
        'w-full max-w-full overflow-x-auto overscroll-x-contain focus:outline-none focus:ring-2 focus:ring-blue-100',
        className
      )}
    >
      <div
        data-testid="responsive-visual-frame-content"
        className={cn('min-w-[var(--visual-min-width)]', contentClassName)}
        style={
          {
            '--visual-min-width': `${minWidth}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
```

- [x] **Step 4: Run tests to verify GREEN**

Run:

```powershell
npm run test:run -- src/components/common/ResponsiveVisualFrame.test.tsx
```

Expected: 4 tests pass.

Observed on 2026-06-04: 4 tests passed.

- [x] **Step 5: Commit locally**

Run:

```powershell
git add src/components/common/ResponsiveVisualFrame.tsx src/components/common/ResponsiveVisualFrame.test.tsx
git commit -m "Add responsive visual frame"
```

Do not push.

Committed locally as `c019aed Add responsive visual frame`.

## Task 2: PrimeCounting Canvas Frame

**Files:**
- Modify: `src/components/PrimeCounting.tsx`

- [x] **Step 1: Update imports and constants**

Add imports:

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { ResponsiveVisualFrame } from './common/ResponsiveVisualFrame';
```

Replace the existing React import with the first line above.

Add constants near the prime-counting constants:

```tsx
const CHART_MIN_WIDTH = 640;
const CHART_ASPECT_RATIO = 2;
```

- [x] **Step 2: Make the canvas drawing buffer responsive**

Add state and refs inside `PrimeCounting`:

```tsx
const frameRef = useRef<HTMLDivElement>(null);
const [chartWidth, setChartWidth] = useState(CHART_MIN_WIDTH);
```

Change the start of `drawGraph` to:

```tsx
const canvas = canvasRef.current;
if (!canvas) return;

const cssWidth = Math.max(CHART_MIN_WIDTH, chartWidth);
const cssHeight = Math.round(cssWidth / CHART_ASPECT_RATIO);
const pixelRatio = window.devicePixelRatio || 1;

canvas.width = Math.round(cssWidth * pixelRatio);
canvas.height = Math.round(cssHeight * pixelRatio);
canvas.style.width = `${cssWidth}px`;
canvas.style.height = `${cssHeight}px`;

const ctx = canvas.getContext('2d');
if (!ctx) return;

ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
ctx.clearRect(0, 0, cssWidth, cssHeight);
```

Then replace every `canvas.width` and `canvas.height` used for graph geometry with `cssWidth` and `cssHeight`.

Update the callback dependency array from `[]` to `[chartWidth]`.

- [x] **Step 3: Add ResizeObserver for the visual frame**

Add this effect before the existing `drawGraph` effect:

```tsx
useEffect(() => {
  const frame = frameRef.current;
  if (!frame) return;

  const updateWidth = () => {
    setChartWidth(Math.max(CHART_MIN_WIDTH, Math.round(frame.clientWidth)));
  };

  updateWidth();

  const observer = new ResizeObserver(updateWidth);
  observer.observe(frame);

  return () => observer.disconnect();
}, []);
```

- [x] **Step 4: Wrap only the chart region**

Replace the current chart card:

```tsx
<div className="bg-white rounded-lg shadow-lg p-4">
  <canvas 
    ref={canvasRef}
    className="w-full"
    style={{ aspectRatio: '2/1' }}
  />
</div>
```

with:

```tsx
<div ref={frameRef} className="bg-white rounded-lg shadow-lg p-4">
  <ResponsiveVisualFrame
    label={lang === 'zh' ? '素数计数图表' : 'Prime counting chart'}
    minWidth={CHART_MIN_WIDTH}
  >
    <canvas ref={canvasRef} className="block max-w-none" />
  </ResponsiveVisualFrame>
</div>
```

- [x] **Step 5: Verify**

Run:

```powershell
npx tsc -p tsconfig.app.json --noEmit
npm run test:run -- src/lib/algorithms/prime_counting.test.ts
```

Expected: both commands exit 0.

Observed on 2026-06-04: TypeScript exited 0 and `prime_counting.test.ts` passed 2 tests.

- [x] **Step 6: Commit locally**

Run:

```powershell
git add src/components/PrimeCounting.tsx
git commit -m "Frame prime counting chart for mobile"
```

Do not push.

Committed locally as `653a624 Frame prime counting chart for mobile`.

## Task 3: ShortestPath Graph And Matrix Frames

**Files:**
- Modify: `src/components/ShortestPath.tsx`
- Modify: `src/components/algorithms/validationErrors.test.tsx` if tests need accessible-label disambiguation after the new regions are added.

- [x] **Step 1: Import the frame**

Add:

```tsx
import { ResponsiveVisualFrame } from './common/ResponsiveVisualFrame';
```

- [x] **Step 2: Wrap the directed graph image only**

Replace the image inside the initial graph card:

```tsx
<img 
  src="/images/p.147.directed.graph.png" 
  alt="Initial directed graph"
  className="w-full"
/>
```

with:

```tsx
<ResponsiveVisualFrame
  label={lang === 'zh' ? '最短路径示例有向图' : 'Directed graph used in the shortest path example'}
  minWidth={640}
>
  <img
    src="/images/p.147.directed.graph.png"
    alt={lang === 'zh' ? '最短路径示例使用的有向图' : 'Directed graph used in the shortest path example'}
    className="h-auto max-w-none"
    style={{ width: 640 }}
  />
</ResponsiveVisualFrame>
```

- [x] **Step 3: Wrap the matrix table only**

Replace:

```tsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 text-sm">
```

with:

```tsx
<ResponsiveVisualFrame
  label={lang === 'zh' ? '最短路径距离矩阵' : 'Shortest path distance matrix'}
  minWidth={520}
>
  <table className="min-w-full divide-y divide-gray-200 text-sm">
```

Replace the corresponding closing `</div>` after the table with `</ResponsiveVisualFrame>`.

- [x] **Step 4: Verify**

Run:

```powershell
npm run test:run -- src/components/algorithms/validationErrors.test.tsx
npx tsc -p tsconfig.app.json --noEmit
```

Expected: both commands exit 0.

Observed on 2026-06-04: `validationErrors.test.tsx` passed 33 tests and TypeScript exited 0.

- [x] **Step 5: Commit locally**

Run:

```powershell
git add src/components/ShortestPath.tsx src/components/algorithms/validationErrors.test.tsx
git commit -m "Frame shortest path visuals for mobile"
```

If `validationErrors.test.tsx` did not change, omit it from `git add`. Do not push.

Committed locally as `85ad111 Frame shortest path visuals for mobile`.

## Task 4: Manual Viewport Verification And Documentation

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-06-04-error-feedback-mobile-baseline.md`
- Modify: `docs/superpowers/plans/2026-06-04-responsive-visual-frame.md`

- [x] **Step 1: Start the dev server**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL. If 5173 is occupied, use the printed alternate port.

Observed on 2026-06-04: ports 5173 and 5174 were occupied, so Vite started at `http://127.0.0.1:5175/`.

- [x] **Step 2: Capture or inspect mobile viewports**

Use Chrome headless if available:

```powershell
$chrome='C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=390,844 --screenshot='D:\tmp\fm2gp-prime-counting-frame.png' --virtual-time-budget=5000 http://127.0.0.1:5173/prime-counting
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=390,844 --screenshot='D:\tmp\fm2gp-shortest-path-frame.png' --virtual-time-budget=5000 http://127.0.0.1:5173/shortest-path
```

If Vite uses another port, replace `5173`.

Acceptance checks:

- The page body itself does not require horizontal scrolling because of the chart, graph, or matrix.
- Any horizontal scrolling is localized to the visual frame region.
- Prime-counting axis labels remain readable.
- The shortest-path graph and matrix entries remain readable.
- Page title, explanation, and controls are outside the horizontal scroll regions.

Observed on 2026-06-04: Chrome headless screenshots were captured at `D:\tmp\fm2gp-prime-counting-frame.png` and `D:\tmp\fm2gp-shortest-path-frame.png`. PrimeCounting shows the chart in a local horizontal frame with readable axis labels. ShortestPath shows the graph in a local horizontal frame while controls remain outside the scroll region.

- [x] **Step 3: Update README mobile baseline notes**

In `README.md`, update both Chinese and English mobile sections to mention:

```markdown
- 宽图表、图片和矩阵使用局部横向滚动容器，避免整页横向溢出
- Prime counting and shortest path now use localized horizontal frames for wide visuals
```

Keep wording natural in each language instead of pasting mixed-language text directly.

- [x] **Step 4: Update the prior Superpowers plan**

In `docs/superpowers/plans/2026-06-04-error-feedback-mobile-baseline.md`, add a short note near the mobile verification section:

```markdown
Follow-up completed: `ResponsiveVisualFrame` now scopes wide visual overflow for prime counting and shortest path.
```

- [x] **Step 5: Run final verification**

Run:

```powershell
npx eslint . --max-warnings=0
npx tsc -p tsconfig.app.json --noEmit
npm run test:run
npm run build
```

Expected: all commands exit 0. If `npm run build` changes `dist/index.html`, restore it before committing.

Observed on 2026-06-04: `npx eslint . --max-warnings=0`, `npx tsc -p tsconfig.app.json --noEmit`, `npm run test:run` with 15 files and 133 tests, and `npm run build` all exited 0. Generated `dist/index.html` noise was restored.

- [x] **Step 6: Commit locally**

Run:

```powershell
git add README.md docs/superpowers/plans/2026-06-04-error-feedback-mobile-baseline.md docs/superpowers/plans/2026-06-04-responsive-visual-frame.md
git commit -m "Document responsive visual frame verification"
```

Do not push.

Observed on 2026-06-04: final documentation commit was created locally and not pushed.

## Final Checklist

- [x] `ResponsiveVisualFrame` exists and uses `cn` from `src/lib/utils.ts`.
- [x] No new dependency is added.
- [x] No new global CSS rule is added.
- [x] CSS variable `--visual-min-width` always includes `px`.
- [x] PrimeCounting wraps only the chart/canvas region.
- [x] PrimeCounting canvas drawing buffer accounts for `devicePixelRatio`.
- [x] ShortestPath wraps only the graph image and matrix table.
- [x] Page titles, descriptions, and controls remain outside scroll frames.
- [x] At 390px, horizontal overflow is scoped to visual frame regions.
- [x] README and plan docs record verification results.
- [x] Full verification commands pass.
- [x] Changes are committed locally and not pushed without explicit approval.
