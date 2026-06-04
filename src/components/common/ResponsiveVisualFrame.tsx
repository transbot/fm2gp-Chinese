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
