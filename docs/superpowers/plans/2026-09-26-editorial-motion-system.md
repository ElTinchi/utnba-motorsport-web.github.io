# Editorial Motion System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply one reversible, accessible editorial motion and sponsorship-conversion system across every narrative route while leaving legal and error routes sober.

**Architecture:** Replace page-owned visibility and timing behavior with four focused shared units: a reversible visibility hook, editorial reveal container, independently observed stagger item/list, and reusable animated number. Narrative pages compose those units and shared motion CSS; a centralized mailto builder owns the commercial contact contract.

**Tech Stack:** React 18, React Router 6, i18next, CSS, browser `IntersectionObserver`/`requestAnimationFrame`, Node test runner, Vite 5.

**Spec:** `docs/superpowers/specs/2026-09-26-editorial-motion-system-design.md`

## Global Constraints

- Add no animation dependency; use `transform`, `opacity`, masks, `IntersectionObserver`, and `requestAnimationFrame`.
- Editorial entry distance is 16–24 px and duration is 450–650 ms.
- Sequence interval is 60–100 ms, with every mobile item observing itself instead of inheriting an off-screen cumulative delay.
- Animated numbers run for 900–1,300 ms, decelerate, reset after clearly leaving view, and preserve locale formatting.
- Reduced motion and missing `IntersectionObserver` expose all content immediately.
- Keep content in the first DOM render, semantic order unchanged, visible focus stable, and interactive controls still while in use.
- Preserve legal, privacy, and 404 routes without required cinematic treatment.
- Primary commercial CTA copy is “Conversemos sobre una alianza”; secondary copy is “Conocé cómo puede participar tu empresa”.
- Commercial email subject is “Alianza con UTN BA Motorsport” and body is “Hola, les escribo de [empresa]. ¿Me pasan un WhatsApp para conversar?”.

## Review Focus

- `matchMedia` missing or changing during a test/browser session must not hide content; the shared motion preference helper must default safely and respond without leaks.
- An observer entry oscillating near a viewport edge must not continuously retrigger; exit and entry margins/thresholds must create a stable dead zone.
- Number strings with prefixes, suffixes, thousands separators, and `+` must retain their intended display in Spanish, English, and Portuguese.
- Long lists on a 320 px viewport must reveal each nearby item without waiting for delays assigned to earlier off-screen siblings.
- Keyboard focus entering a not-yet-visible reveal must expose the focused control immediately and never translate it while used.

---

### Task 1: Shared visibility and motion preference primitives

**Files:**
- Create: `src/hooks/useReducedMotion.js`
- Modify: `src/hooks/useInView.js`
- Create: `test/editorial-motion.test.js`

**Interfaces:**
- Produces: `useReducedMotion(): boolean`.
- Produces: `useInView(options?: { rootMargin?: string, threshold?: number | number[], exitRootMargin?: string, exitThreshold?: number }): [MutableRefObject, boolean]` with missing-observer and reduced-motion fallbacks returning visible content.

- [ ] **Step 1: Write failing tests for reversible activation, stable exit, observer cleanup, missing-observer fallback, and reduced-motion visibility**

  Use a small exported visibility-state reducer/options helper where necessary so Node tests exercise real transition rules without a DOM emulator. Assert that marginal entries retain their prior state, clear exits deactivate, and fallback states are visible.

- [ ] **Step 2: Run the focused tests and confirm RED**

  Run: `npm test -- --test-name-pattern="visibility|reduced motion"`

- [ ] **Step 3: Implement the shared hooks and minimal pure helpers**

  Keep one observer per mounted consumer, disconnect it on cleanup, and subscribe/unsubscribe to the reduced-motion media query with legacy listener fallback.

- [ ] **Step 4: Run focused and full tests and confirm GREEN**

  Run: `npm test -- --test-name-pattern="visibility|reduced motion"`, then `npm test`.

- [ ] **Step 5: Commit**

  `git commit -m "feat: add stable reversible motion visibility"`

### Task 2: Reusable editorial reveal, stagger, and animated data components

**Files:**
- Create: `src/components/EditorialReveal.jsx`
- Create: `src/components/StaggerList.jsx`
- Modify: `src/components/AnimatedNumber.jsx`
- Create: `src/styles/editorial-motion.css`
- Modify: `src/main.jsx`
- Modify: `test/editorial-motion.test.js`

**Interfaces:**
- Consumes: `useInView`, `useReducedMotion` from Task 1.
- Produces: `EditorialReveal({ as, direction, mask, className, children })`.
- Produces: `StaggerList({ as, itemAs, items, renderItem, className, itemClassName, interval })`, with an independent observer per item and 60–100 ms local delay.
- Produces: `AnimatedNumber({ value, duration = 1200, className = 'stat-value' })` with exported `parseAnimatedValue(value)` and `formatAnimatedValue(parsed, current, locale)` helpers.

- [ ] **Step 1: Write failing tests for reveal semantics, local stagger delay, number parsing/formatting/reset, and animation cleanup**

  Assert `as` preserves the chosen semantic element; delays never accumulate beyond the local interval policy; values such as `62%`, `600+`, and `~20.000` preserve affixes and locale grouping; exiting resets to zero.

- [ ] **Step 2: Run the focused tests and confirm RED**

  Run: `npm test -- --test-name-pattern="editorial reveal|stagger|animated number"`

- [ ] **Step 3: Implement components and shared CSS tokens/variants**

  Define 16/20/24 px direction variants, 450/550/650 ms rhythm variants, horizontal/vertical mask variants, focus-within visibility, and a reduced-motion override that removes transforms, masks, opacity, delays, and durations.

- [ ] **Step 4: Run focused and full tests and confirm GREEN**

  Run the focused command, then `npm test`.

- [ ] **Step 5: Commit**

  `git commit -m "feat: add reusable editorial motion primitives"`

### Task 3: Central commercial contact contract and sponsorship journey

**Files:**
- Modify: `src/routes.js`
- Modify: `src/pages/Sponsors.jsx`
- Modify: `src/pages/Car.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/components/Header.jsx`
- Modify: `src/locales/es.json`
- Modify: `src/locales/en.json`
- Modify: `src/locales/pt.json`
- Modify: `src/styles/sponsors.css`
- Modify: `test/editorial-motion.test.js`
- Modify: `test/launch-readiness.test.js`

**Interfaces:**
- Produces: `buildCommercialContactHref({ company = '[empresa]' } = {}): string` and `COMMERCIAL_CONTACT_HREF`.
- Consumes: Task 2 motion primitives.

- [ ] **Step 1: Write failing tests for encoded subject/body, absence of published WhatsApp, three Sponsors contact opportunities, secondary anchor navigation, and unchanged header route behavior**

- [ ] **Step 2: Run the contact/sponsor tests and confirm RED**

  Run: `npm test -- --test-name-pattern="commercial contact|sponsor journey|primary call"`

- [ ] **Step 3: Implement the centralized mailto and compose the Sponsors evidence-to-contact journey**

  Place contact CTAs after demonstrated progress, after partnership value, and in the closing block. Give the commercial explanation a stable anchor used by the secondary CTA. Keep the global header CTA routed to Sponsors.

- [ ] **Step 4: Replace obsolete sponsor-only one-shot motion with shared reversible primitives and update all three locale files**

- [ ] **Step 5: Run focused and full tests and confirm GREEN**

  Run the focused command, then `npm test`.

- [ ] **Step 6: Commit**

  `git commit -m "feat: turn sponsor story into a direct contact journey"`

### Task 4: Apply the editorial narrative to every content route

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Academy.jsx`
- Modify: `src/pages/FormulaStudent.jsx`
- Modify: `src/pages/Car.jsx`
- Modify: `src/pages/Team.jsx`
- Modify: `src/pages/News.jsx`
- Modify: `src/pages/JoinUs.jsx`
- Modify: `src/components/PageShell.jsx`
- Modify: `src/components/AreasGrid.jsx`
- Modify: `src/styles/home.css`
- Modify: `src/styles/academy.css`
- Modify: `src/styles/formulaStudent.css`
- Modify: `src/styles/car.css`
- Modify: `src/styles/team.css`
- Modify: `src/styles/news.css`
- Modify: `src/styles/join.css`
- Modify: `src/locales/es.json`
- Modify: `src/locales/en.json`
- Modify: `src/locales/pt.json`
- Modify: `test/editorial-motion.test.js`

**Interfaces:**
- Consumes: `EditorialReveal`, `StaggerList`, and `AnimatedNumber` from Task 2.
- Produces: every narrative route with a recognizable hook followed by context, evidence, consequence, and next action.

- [ ] **Step 1: Write failing route-coverage tests for all seven narrative pages and explicit exclusions for PolicyPage/NotFound**

  Assert imports/usages of shared motion components rather than page-owned observers, presence of the spec’s hook translation keys, per-item staggering on long lists, and no required motion imports on sober routes.

- [ ] **Step 2: Run route coverage tests and confirm RED**

  Run: `npm test -- --test-name-pattern="narrative route|sober route"`

- [ ] **Step 3: Apply narrative order and motion primitives to Home, Academy, and Formula Student**

  Preserve Home’s hero ignition; make its editorial blocks shared/reversible, Academy a connected three-step ladder, and Formula Student’s evaluations/tests a conceptual sequence ending in animated evidence.

- [ ] **Step 4: Apply narrative order and motion primitives to Car, Team, News, and Join Us**

  Mask-reveal fixed-dimension media, stagger specs/areas/news items independently, keep share controls still during interaction, and keep Sponsors the dominant site conversion.

- [ ] **Step 5: Update localized hooks and supporting copy in Spanish, English, and Portuguese**

- [ ] **Step 6: Run focused and full tests and confirm GREEN**

  Run the focused command, then `npm test`.

- [ ] **Step 7: Commit**

  `git commit -m "feat: apply editorial motion across narrative routes"`

### Task 5: Accessibility, responsive, graph, and production verification

**Files:**
- Modify if needed: `src/styles/editorial-motion.css`
- Modify if needed: affected route/component styles and tests
- Update generated graph: `graphify-out/**`

**Interfaces:**
- Consumes: completed Tasks 1–4.
- Produces: verified responsive, keyboard-safe, reduced-motion-safe production output.

- [ ] **Step 1: Run the full automated suite and production build**

  Run: `npm test` and `npm run build`; require zero failures and exit code 0.

- [ ] **Step 2: Run the app and inspect every Spanish route at 320, 768, 1024, and 1440 px**

  Check downward/upward scroll, threshold stability, layout shift, visible focus, recoverable content, console errors, and Home → Sponsors → prefilled email flow. Spot-check English and Portuguese for overflow.

- [ ] **Step 3: Correct each observed defect with its own failing regression test before production code**

- [ ] **Step 4: Refresh the repository knowledge graph**

  Run: `graphify update .` from the repository root and verify it exits successfully.

- [ ] **Step 5: Re-run full tests and build after all corrections**

  Run: `npm test` and `npm run build`; require zero failures and exit code 0.

- [ ] **Step 6: Review the final diff for scope, secrets, generated artifacts, and acceptance-criteria coverage**

- [ ] **Step 7: Commit**

  `git commit -m "test: verify editorial motion system end to end"`
