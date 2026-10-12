# Final submission checklist

12 October 2026. Checked items refer to the recorded local scope. The project has not been submitted or deployed.

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
- [ ] Real browser zoom at 200%/400%, high contrast, touch device and cross-browser checks.

## JavaScript and asynchronous operations

- [x] Fetch/Promise.all, AbortController timeout, queued atomic persistence and failure recovery.
- [x] Duplicate submission, stale scheduled search, corrupt storage and overlapping/two-tab writes tested.
- [x] Limits and distinction between real fetch and local debounce documented.

## Testing

- [x] 20 Node tests and 14 Chrome browser tests passed in recorded local run.
- [x] Failed initial browser run, fixes and actual screenshots retained.
- [ ] Learner performs and records independent manual usability tests.
- [ ] Repeat relevant tests on deployed origin and record actual results separately.

## User stories and screenshots

- [x] US01–US10 defined; evidence mapped to genuine captures.
- [ ] Learner checks course-specific screenshot requirements and adds any additional requested evidence.

## Git/GitHub

- [x] Supplied source preserved in genuine initial commit; incremental revision commits.
- [ ] Confirm GitHub account, repository visibility and permission to publish; push without rewriting history.
- [ ] Add verified repository URL to README.

## Deployment

- [x] Vercel static configuration, copy build and deployment guide prepared.
- [x] User approved Vercel publication.
- [ ] Resolve account access/selection and publish; integration returned HTTP 403.
- [ ] Verify homepage, modules, JSON, 404, persistence, console, mobile and deployed commit.
- [ ] Add verified live URL and deployment evidence.

## README

- [x] Purpose, features, architecture, limitations, run/test commands, evidence, sources and criteria links.
- [ ] Add live and remote URLs after verification.

## UX design

- [x] Purpose, users, requirements, IA, design system, decisions and retrospective wireframe.
- [ ] Learner writes their own evaluation and verifies design decisions they intend to discuss.

## Merit evidence

- [x] Local missing-path recovery, logical commits, user stories, design and bug/test documentation.
- [ ] Cloud missing-path test and remaining human accessibility checks.

## Distinction evidence

- [x] Data race explanation/tests, defensive validation, cohesive UI and explicit compromises.
- [x] Documentation matches current local implementation.
- [ ] Confirm institution AI-assistance policy and submit truthful disclosure.
- [ ] Demonstrate and explain the project independently; no grade is guaranteed.
