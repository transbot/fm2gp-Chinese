import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider, useLanguage } from './LanguageContext';

function Probe() {
  const { lang, setLang } = useLanguage();
  return <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}>{lang}</button>;
}
afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });
describe('preferred device languages', () => {
  it.each([
    [['zh-CN', 'en-US'], 'en-US', 'zh'],
    [['zh-TW'], 'en-US', 'zh'],
    [['fr-FR', 'zh-HK', 'en'], 'en-US', 'zh'],
    [['en-GB', 'zh-CN'], 'zh-CN', 'en'],
    [[], 'zh-CN', 'zh'],
    [['fr-FR'], 'fr-FR', 'en'],
  ])('selects from %j with fallback %s', (languages, language, expected) => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages as string[]);
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(language as string);
    render(<LanguageProvider><Probe /></LanguageProvider>);
    expect(screen.getByRole('button')).toHaveTextContent(expected as string);
  });
  it('keeps an explicit choice on reload and updates document language', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['zh-CN']);
    const first = render(<LanguageProvider><Probe /></LanguageProvider>);
    fireEvent.click(screen.getByRole('button'));
    first.unmount();
    render(<LanguageProvider><Probe /></LanguageProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('en');
    expect(document.documentElement.lang).toBe('en');
  });
});
