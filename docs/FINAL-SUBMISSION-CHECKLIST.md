# Final submission checklist

12 October 2026. Checked items refer to the recorded local and deployed scope. The site is published on Vercel; the assessment has not been submitted.

## Application functionality

- [x] Dynamic dashboard, property CRUD/search/filter, repair workflow, certificate editing/filtering, reports/export and confirmed reset.
- [x] Persistence, empty states, errors and retry exercised in tests.
- [x] Linked property deletion blocked; duplicate submissions checked.

## Code quality

- [x] Vanilla modules retained; formatted and linted source.
- [x] HTML and CSS checked with named tools; local link check available.
- [x] No runtime packages; development tools documented and lockfile retained.

## Accessibility

- [x] Automated axe checks across six routes at five widths and property dialog.
- [x] Keyboard skip link, dialog focus, Escape, history and validation checks.
- [ ] Learner screen-reader test with NVDA/VoiceOver or equivalent.
- [x] Full deployed Edge regression run and emulated forced-colour/reduced-motion checks.
- [x] Native Chrome 200%/400% zoom review of overview, register, search and property dialog.
- [ ] Actual OS contrast mode, physical touch device and Firefox/Safari if required.

## JavaScript and asynchronous operations

- [x] Fetch/Promise.all, AbortController timeout, queued atomic persistence and failure recovery.
- [x] Duplicate submission, stale scheduled search, corrupt storage and overlapping/two-tab writes tested.
- [x] Limits and distinction between real fetch and local debounce documented.

## Testing

- [x] Expanded 24 Node tests; original 14 local Chrome tests; deployed Chrome and Edge 14 tests each.
- [x] Failed initial browser run, fixes and actual screenshots retained.
- [ ] Learner performs and records independent manual usability tests.
- [x] Repeat all 14 browser tests on deployed origin; record results/screenshots separately.

## User stories and screenshots

- [x] US01–US10 defined; evidence mapped to genuine captures.
- [ ] Learner checks course-specific screenshot requirements and adds any additional requested evidence.

## Git/GitHub

- [x] Supplied source preserved in genuine initial commit; incremental revision commits.
- [x] Verify existing public alssl27/propertyflow-final repository, obtain explicit approval and push without rewriting history.
- [x] Add verified repository URL to README.

## Deployment

- [x] Vercel static configuration, copy build and deployment guide prepared.
- [x] User approved Vercel publication.
- [x] User selected alssl27; publish successfully using its authorised CLI login.
- [x] Verify live workflows plus 13 HTTP/hash checks, including custom 404 and release match.
- [x] Add verified live URL and separate deployment evidence.

## README

- [x] Purpose, features, architecture, limitations, run/test commands, evidence, sources and criteria links.
- [x] Add verified live URL.
- [x] Add verified GitHub repository URL after publication.

## UX design

- [x] Purpose, users, requirements, IA, design system, decisions and retrospective wireframe.
- [x] Evidence-based assisted project evaluation prepared.
- [ ] Learner reviews and endorses the evaluation and can explain the design decisions.

## Merit evidence

- [x] Local missing-path recovery, logical commits, user stories, design and bug/test documentation.
- [x] Cloud nested missing-path test.
- [ ] Remaining human accessibility checks.

## Distinction evidence

- [x] Data race explanation/tests, defensive validation, cohesive UI and explicit compromises.
- [x] Documentation matches current local implementation.
- [x] Truthful AI-assistance disclosure and public academic-integrity review prepared.
- [ ] Confirm assessment-specific AI permission and follow the required declaration process.
- [ ] Demonstrate and explain the project independently; no grade is guaranteed.

Native UI results: [MANUAL-ACCESSIBILITY-REVIEW.md](MANUAL-ACCESSIBILITY-REVIEW.md). Prepared materials: [PROJECT-EVALUATION.md](PROJECT-EVALUATION.md), [AI-ASSISTANCE-DISCLOSURE.md](AI-ASSISTANCE-DISCLOSURE.md) and [ACADEMIC-INTEGRITY-REVIEW.md](ACADEMIC-INTEGRITY-REVIEW.md). Unperformed speech/device/learner checks stay unchecked.

## Review package — 14 October 2026

- [x] Ordered [demonstration instructions](DEMONSTRATION-WALKTHROUGH.md) and [review route/packaging instructions](SUBMISSION-PACKAGE.md) prepared.
- [x] Separate live Settings screenshot added to the evidence checklist, with actual capture date and scope.
- [ ] Learner verifies the actual submission portal's accepted files, size limits and declaration requirements before upload.

`npm run package:submission` generates a ZIP from a clean committed revision, with a file manifest, genuine history listing and checksums. It does not submit the assessment or mark any learner checks complete.
