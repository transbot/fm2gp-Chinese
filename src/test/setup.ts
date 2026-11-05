// src/test/setup.ts
// Test setup file for Vitest
import '@testing-library/jest-dom';
import { afterEach } from 'vitest';

afterEach(() => localStorage.clear());
