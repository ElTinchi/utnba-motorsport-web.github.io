import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deriveVisibilityState,
  getVisibilityFallback,
} from '../src/hooks/useInView.js';
import { getReducedMotionPreference } from '../src/hooks/useReducedMotion.js';
import {
  formatAnimatedValue,
  getEditorialRevealProps,
  getStaggerDelay,
  parseAnimatedValue,
} from '../src/utils/editorialMotion.js';

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

test('animated numbers preserve affixes and regional grouping', () => {
  assert.deepEqual(parseAnimatedValue('62%'), {
    target: 62,
    prefix: '',
    suffix: '%',
    grouped: false,
  });
  assert.equal(formatAnimatedValue(parseAnimatedValue('600+'), 600, 'en'), '600+');
  assert.equal(formatAnimatedValue(parseAnimatedValue('~20.000'), 20000, 'es'), '~20.000');
  assert.equal(formatAnimatedValue(parseAnimatedValue('~20.000'), 20000, 'en'), '~20,000');
});

test('stagger delay is local instead of accumulating across a long list', () => {
  assert.equal(getStaggerDelay(0, 80), 0);
  assert.equal(getStaggerDelay(3, 80), 240);
  assert.equal(getStaggerDelay(20, 80), 0);
  assert.throws(() => getStaggerDelay(1, 140), /60 and 100/);
});

test('editorial reveal properties preserve semantic elements and expose state', () => {
  assert.deepEqual(getEditorialRevealProps({
    as: 'article',
    direction: 'left',
    mask: 'horizontal',
    visible: true,
    className: 'story',
  }), {
    element: 'article',
    className: 'editorial-reveal editorial-reveal--left editorial-reveal--mask-horizontal editorial-reveal--visible story',
    'data-motion': 'editorial-reveal',
  });
});
