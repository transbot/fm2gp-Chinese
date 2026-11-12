// The subset of the existing Vitest jsdom dependency used by build-output tests.
declare module 'jsdom' {
  export class JSDOM {
    constructor(html?: string, options?: { url?: string; contentType?: string });
    readonly window: Window;
  }
}
