# Final submission checklist

Status reviewed 27 October 2026. Checked items refer to the recorded local and deployed scope; they do not imply assessor approval. The site is published on Vercel; the assessment has not been submitted.

## Application functionality

- [x] Dynamic dashboard, property CRUD/search/filter, repair workflow, certificate editing/filtering, reports/export and confirmed reset.
- [x] Persistence, empty states, errors and retry exercised in tests.
- [x] Linked property deletion blocked; duplicate submissions checked.

## Code quality

- [x] Vanilla modules retained; formatted and linted source.
- [x] HTML and CSS checked locally and with the official W3C Nu HTML and Jigsaw CSS validators; local link check available.
- [x] No runtime packages; development tools documented and lockfile retained.

## Accessibility

- [x] Automated axe checks across six routes at five widths and property dialog.
- [x] Keyboard skip link, dialog focus, Escape, history and validation checks.
- [ ] Learner screen-reader test with NVDA/VoiceOver or equivalent.
- [x] Final IndexedDB revision: full deployed Chrome/Edge regression and emulated forced-colour/reduced-motion checks.
- [x] Native Chrome 200%/400% zoom review of overview, register, search and property dialog.
- [ ] Actual OS contrast mode, physical touch device and Firefox/Safari if required.

## JavaScript and asynchronous operations

- [x] Fetch/Promise.all, AbortController timeout, queued atomic persistence and failure recovery.
- [x] Duplicate submission, stale scheduled search, corrupt storage and overlapping/two-tab writes tested.
- [x] Limits and distinction between real fetch and local debounce documented.

## Testing

- [x] Final local revision: 24 Node tests, 14 Chrome tests and five emulated preference checks pass.
- [x] Final deployed revision: Chrome and Edge passed 14 tests each; five preference checks passed.
- [x] Failed initial browser run, fixes and actual screenshots retained.
- [ ] Learner performs and records independent manual usability tests.
- [x] Repeat all 14 browser tests on the deployed final runtime; record results/screenshots separately.

## User stories and screenshots

- [x] US01–US10 defined; evidence mapped to genuine captures.
- [x] Supplied Unit 2 specification reviewed: criterion 3.3 requires finished-project screenshots aligned to user stories; the US01–US10 evidence map supplies that mapping.
- [ ] Learner checks the portal/tutor instructions for any additional screenshot or upload requirements.

## Git/GitHub

- [x] Supplied source preserved in genuine initial commit; incremental revision commits.
- [x] Verify existing public alssl27/propertyflow-final repository, obtain explicit approval and push without rewriting history.
- [x] Add verified repository URL to README.

## Deployment

- [x] Vercel static configuration, copy build and deployment guide prepared.
- [x] User approved Vercel publication.
- [x] User selected alssl27; publish successfully using its authorised CLI login.
- [x] Final revision: verify live workflows plus 13 HTTP/hash checks, including custom 404 and exact release match.
- [x] Publish and verify the final IndexedDB revision; replace deployment identity/hashes with the new evidence.
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

- [x] Local missing-path recovery, genuine traceable history, user stories, design and bug/test documentation. The large revision and vague `final commit` are disclosed rather than rewritten.
- [x] Cloud nested missing-path test.
- [ ] Remaining human accessibility checks.

## Distinction evidence

- [x] Data race explanation/tests, defensive validation, cohesive UI and explicit compromises.
- [x] Documentation matches current local implementation.
- [x] Truthful AI-assistance disclosure and public academic-integrity review prepared.
- [ ] Confirm assessment-specific AI permission and follow the required declaration process.
- [ ] Demonstrate and explain the project independently; no grade is guaranteed.

Native UI results: [manual-accessibility-review.md](manual-accessibility-review.md). Prepared materials: [project-evaluation.md](project-evaluation.md), [ai-assistance-disclosure.md](ai-assistance-disclosure.md) and [academic-integrity-review.md](academic-integrity-review.md). Unperformed speech/device/learner checks stay unchecked.

## Review package — updated 27 October 2026

- [x] Ordered [demonstration instructions](demonstration-walkthrough.md) and [review route/packaging instructions](submission-package.md) prepared.
- [x] Separate live Settings screenshot added to the evidence checklist, with actual capture date and scope.
- [ ] Learner verifies the actual submission portal's accepted files, size limits and declaration requirements before upload.

`npm run package:submission` generates a ZIP from a clean committed revision, with a file manifest, genuine history listing and checksums. It does not submit the assessment or mark any learner checks complete.
