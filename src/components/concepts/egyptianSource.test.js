import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { egyptianCode } from './egyptianPresentation';
import { egyptianTrace } from '../../lib/algorithms/egyptianTrace';

it('uses actual book statements and maps every event to the statement just executed', () => {
  const source = readFileSync('配套代码(fm2gpcode)/ch02.h', 'utf8').split(/\r?\n/).map(s => s.trim());
  for (const [fn, lines] of Object.entries(egyptianCode)) {
    if (fn !== 'wrapper') for (const line of lines) expect(source, `${fn}: ${line.text}`).toContain(line.text.trim());
  }
  for (const version of ['multiply0', 'multiply1', 'multiply4']) for (const n of [0, 1, 15, 16, 41, -15]) {
    const steps = egyptianTrace(n, 7, version);
    steps.forEach((s, i) => {
      expect(egyptianCode[s.fn].some(line => line.id === s.line)).toBe(true);
      if (!i) return;
      const previous = steps[i - 1];
      expect(s.additions - previous.additions).toBe(['add', 'double', 'argument'].includes(s.event) ? 1 : 0);
      expect(s.frames.length - previous.frames.length).toBe(s.event === 'enter' ? 1 : s.event === 'exit' ? -1 : 0);
    });
  }
});
