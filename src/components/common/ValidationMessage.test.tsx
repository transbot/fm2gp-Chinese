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
