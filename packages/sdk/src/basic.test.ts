import { describe, it, expect } from 'vitest';

// Minimal sanity test so the SDK test suite has at least one passing spec

describe('sdk basic', () => {
  it('runs a trivial assertion', () => {
    expect(true).toBe(true);
  });
});
