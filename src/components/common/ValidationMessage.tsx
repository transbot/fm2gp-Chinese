interface ValidationMessageProps {
  errorKey: string | null;
  messages: Record<string, string>;
}

export function ValidationMessage({ errorKey, messages }: ValidationMessageProps) {
  if (!errorKey) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {messages[errorKey] ?? errorKey}
    </div>
  );
}
