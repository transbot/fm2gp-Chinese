# Responsive Visual Frame Design

## Goal

Make wide algorithm visuals adapt predictably across phone, tablet, desktop, and future app-shell environments without cropping important content or forcing each page to invent its own overflow behavior.

## Scope

This design covers wide visual content inside the existing Vite React app:

- Canvas-based charts such as `PrimeCounting`.
- Static graph images such as `ShortestPath`.
- Matrix, table, array, and graph panels that naturally exceed phone width.
- Documentation of the mobile baseline strategy in README and the existing Superpowers plan.

This does not convert the app to Expo or Capacitor yet. The goal is to make the current responsive web app a better source for a future PWA/Capacitor wrapper.

## Recommended Approach

Create a shared `ResponsiveVisualFrame` component in `src/components/common/ResponsiveVisualFrame.tsx`.

The component owns only layout and accessibility concerns:

- Constrain visuals to the available page width.
- Allow horizontal scrolling on narrow screens.
- Preserve full visual detail instead of scaling everything until labels become unreadable.
- Provide optional minimum content width for charts, matrices, and diagrams.
- Provide optional accessible labels for scrollable regions.
- Avoid nested card styling; it should be a frame/scroll container, not another decorative card inside existing cards.

Implement this spec with minimal, localized changes. Prefer a shared component and page-level wrapping over global CSS changes. After implementation, run the listed checks and commit locally without pushing.

Pages remain responsible for their domain content. For example, `PrimeCounting` still draws the chart, and `ShortestPath` still renders its graph and matrix; they only wrap wide content with the shared frame.

## Component API

```tsx
interface ResponsiveVisualFrameProps {
  children: React.ReactNode;
  label: string;
  minWidth?: number;
  className?: string;
  contentClassName?: string;
}
```

Default behavior:

- Outer element: `role="region"` with `aria-label={label}`.
- Outer class: `w-full max-w-full overflow-x-auto overscroll-x-contain`.
- The outer element does not add card styling, borders, shadows, backgrounds, or decorative chrome.
- Inner class: `min-w-[var(--visual-min-width)]`.
- Default `minWidth`: `360`.
- The inner wrapper receives a CSS variable with a pixel value:

```tsx
style={
  {
    '--visual-min-width': `${minWidth ?? 360}px`,
  } as React.CSSProperties
}
```

- The CSS variable must include the `px` unit.
- The frame should not automatically remove the minimum width at `sm`.
- If a specific page wants fluid scaling on wider screens, it may pass `contentClassName="sm:min-w-0"` or an equivalent class explicitly.
- Consider `tabIndex={0}` for scrollable regions when keyboard horizontal scrolling would otherwise be inaccessible.
- Use the app's existing class merge utility if one exists, such as `cn`, `clsx`, or an equivalent helper. Do not introduce a new dependency only for class merging unless necessary.

## First Pages To Update

1. `src/components/PrimeCounting.tsx`
   - Wrap only the chart/canvas visual region.
   - Do not place the page title, explanation text, or primary controls inside the horizontal scroll region unless they are visually part of the chart itself.
   - Give the visual region an appropriate `minWidth` so axis labels remain readable on phones.
   - The canvas CSS display width may be responsive, but the drawing buffer should account for `devicePixelRatio`.
   - Redraw when the rendered canvas width changes.
   - Avoid relying on `window.innerWidth`; prefer measuring the container or canvas with `ResizeObserver` when practical.
   - Keep the reduced `1_000_000` default workload from the previous plan.

2. `src/components/ShortestPath.tsx`
   - Wrap the directed graph image in a horizontal frame.
   - Wrap the matrix table in the same frame.
   - Do not put unrelated page controls inside the horizontal scroll region.
   - The image should preserve its aspect ratio and avoid right-edge clipping on phones.
   - Use an explicit readable width or minimum width for the graph image.
   - Use `max-w-none` or equivalent when default image scaling prevents horizontal scrolling.
   - Keep meaningful `alt` text, such as `Directed graph used in the shortest path example`.

3. Representative algorithm tables or array-heavy panels
   - Start with one high-risk page found during verification, such as heap operations or graph traversal, only if the first two pages prove the frame works cleanly.

## Cross-Platform Behavior

Phone:

- Wide content scrolls horizontally inside its own region.
- Header and controls stay within the viewport.
- Text remains readable without pinch zoom.
- Scrollable regions should not hide the primary action buttons.

Tablet:

- Most visuals should fit without scrolling.
- If a visual is still wide, horizontal scroll remains available but should be visually unobtrusive.

Desktop:

- Visuals use available width naturally.
- The frame should not add unnecessary visual chrome.

Future app shell:

- Layout should respect existing `safe-app-x` and `safe-app-bottom` page spacing.
- Avoid hover-only affordances.
- Touch target improvements remain handled by buttons and controls, not by the frame.

## Testing Strategy

Add focused component tests for `ResponsiveVisualFrame`:

- The region has the expected accessible name.
- The CSS variable contains the expected pixel value, including the `px` unit.
- The default minimum width is used when `minWidth` is omitted.
- A custom `minWidth` is applied.
- `className` is merged onto the outer element.
- `contentClassName` is merged onto the inner wrapper.
- Children render inside the inner content wrapper.

Use existing page tests where possible, but do not overfit tests to Tailwind class strings in every page. The key behavior is that pages use the shared frame for known wide content.

Manual verification remains necessary for visual pages:

- 390 x 844: `/prime-counting`, `/shortest-path`
- 430 x 932: `/graph-traversal`
- 768 x 1024: `/heap`

Record results in README and the plan document after implementation.

## Risks And Tradeoffs

Horizontal scrolling is acceptable for dense mathematical visuals, but it should be scoped to the visual region rather than the whole page. Scaling every visual down to the phone width would make labels and matrix entries unreadable, so this design prefers detail preservation plus local scroll.

The first implementation should avoid migrating every legacy page at once. Start with the pages already observed as problematic, then reuse the frame opportunistically as each page is touched.

## Acceptance Criteria

- `ResponsiveVisualFrame` exists in `src/components/common`.
- `PrimeCounting` and `ShortestPath` use the shared frame for known wide visual content.
- At 390px viewport width, these pages do not cause whole-document horizontal overflow because of the framed visuals.
- Horizontal scrolling, when needed, is scoped to the `ResponsiveVisualFrame` region.
- Chart labels, matrix entries, and graph labels remain readable without pinch zoom.
- Component tests cover accessible label, default min width, custom min width, class merging, and child rendering.
- Existing validation tests and prime-counting tests still pass.
- TypeScript, ESLint, full Vitest, and production build pass.
- README and the existing Superpowers plan document are updated with manual verification notes.
- Do not introduce new global CSS rules that affect unrelated pages.
- Changes are committed locally but not pushed without explicit approval.
