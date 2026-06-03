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
