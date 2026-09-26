import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deriveVisibilityState,
  getVisibilityFallback,
} from '../src/hooks/useInView.js';
import { getReducedMotionPreference } from '../src/hooks/useReducedMotion.js';

test('visibility stays stable while an element only grazes the viewport boundary', () => {
  assert.equal(deriveVisibilityState(false, { isIntersecting: true, intersectionRatio: 0.08 }), false);
  assert.equal(deriveVisibilityState(false, { isIntersecting: true, intersectionRatio: 0.24 }), true);
  assert.equal(deriveVisibilityState(true, { isIntersecting: true, intersectionRatio: 0.08 }), true);
  assert.equal(deriveVisibilityState(true, { isIntersecting: false, intersectionRatio: 0 }), false);
});

test('visibility fallback exposes content without IntersectionObserver or with reduced motion', () => {
  assert.equal(getVisibilityFallback({ hasObserver: false, reducedMotion: false }), true);
  assert.equal(getVisibilityFallback({ hasObserver: true, reducedMotion: true }), true);
  assert.equal(getVisibilityFallback({ hasObserver: true, reducedMotion: false }), false);
});

test('reduced motion defaults safely when matchMedia is unavailable', () => {
  assert.equal(getReducedMotionPreference(undefined), false);
  assert.equal(getReducedMotionPreference({ matches: true }), true);
  assert.equal(getReducedMotionPreference({ matches: false }), false);
});
