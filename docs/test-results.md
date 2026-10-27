# Actual test results — baseline 12 October, current update 27 October 2026

## Current revision update — 27 October 2026

A repeated B09 run exposed an intermittent lost update in the former Web Locks plus `localStorage` implementation. The complete local run stopped at **13/14**, and B09 then failed **4/10** repeated runs. The browser persistence authority was changed to IndexedDB, with every workspace mutation contained in one `readwrite` transaction.

After that correction, `npm test` passed **24/24**; lint, local HTML validation and local CSS validation passed; targeted B05/B08/B09 passed **3/3**; and B09 passed **10/10** repeated runs with Web Locks deliberately unavailable. Each B09 run performs 20 pairs of simultaneous tab writes, so the repeated stress retest covered 400 two-tab writes in total and verified the resulting IDs from both existing pages and a fresh third page. The complete local browser suite then passed **14/14**, and the local forced-colour/reduced-motion preference checks passed **5/5**.

The official hosted checks also ran for the current revision on 27 October: W3C Nu reported **0 errors** for `index.html` (12 informational notices) and **0 errors** for `404.html` (4 informational notices); W3C Jigsaw reported the stylesheet valid with **0 errors** and 16 warnings caused by static analysis of CSS custom properties. Initial official results—4 HTML errors in `index.html`, 1 in `404.html`, and 21 CSS errors—were fixed before that pass.

These are current-revision local results. At the time this section was written, a new production deployment regression had not yet been run. The sections below preserve the 12 October evidence and must not be read as proof of the changed runtime.

## Environment and scope

Windows; Node v26.10.0; npm 11.19.1; Google Chrome 155.0.8059.39 (headless); Playwright 1.64.0; axe integration 4.13.0; ESLint 10.12.0; html-validate 11.16.2; CSS Tree 3.2.1; Prettier 3.9.10. Local URL http://127.0.0.1:4173. Browser plugin absent; regular Playwright was used as permitted by the testing skill. Tests ran on the implemented source after commit 73e93f4; this report and test additions are committed afterwards. This section records the local run. The later cloud run is recorded separately in deployed-test-results.md.

## Browser workflows — historical 12 October run: 14 passed, zero failed

Full expected outcomes and exact executable steps: tests/browser/workflows.spec.js. Each test starts with an isolated browser context. B01–B03 use valid fictional records and confirm the saved UI; B04 checks actual keyboard behaviour; B05/B08 inject expected failures and assert recovery; B06 checks empty data and nested 404; B07 opens all six views at each width and asserts no page-wide overflow or enabled axe violations; B09 verifies two-tab writes; B10 checks shortcuts and modal accessibility.

| Test identifier and journey                                                           | Result | Actual runner status |
| ------------------------------------------------------------------------------------- | ------ | -------------------- |
| B01 full property workflow, duplicates, persistence, search, delete                   | Passed | passed               |
| B02 repairs create edit filter and lifecycle; linked deletion blocked                 | Passed | passed               |
| B03 certificates create edit expiry filtering, reports CSV and reset                  | Passed | passed               |
| B04 modal keyboard, validation, focus containment, history and skip link              | Passed | passed               |
| B05 slow fetch loading failure retry and corrupt storage recovery                     | Passed | passed               |
| B06 empty workspace, missing resource and custom 404                                  | Passed | passed               |
| B07 responsive 320px all views and accessibility scan                                 | Passed | passed               |
| B07 responsive 375px all views and accessibility scan                                 | Passed | passed               |
| B07 responsive 768px all views and accessibility scan                                 | Passed | passed               |
| B07 responsive 1024px all views and accessibility scan                                | Passed | passed               |
| B07 responsive 1440px all views and accessibility scan                                | Passed | passed               |
| B08 duplicate form submit and unavailable storage retain unsaved form                 | Passed | passed               |
| B09 original Web Locks two-tab scenario (later superseded by B-020)                   | Passed | passed               |
| B10 quick actions, property status/filter, notification, unknown route and modal scan | Passed | passed               |

All tests were executed on the date/environment above. B01 maps US02/03; B02 maps US04; B03 maps US05/06/07; B04 maps US09; B05 maps US10; B06 maps US01/10; B07 maps US01/08/09; B08 maps US03/10; B09 maps US07; B10 maps US01/03/09. [Screenshot evidence](evidence-checklist.md) maps the specific captures. [Machine-readable final output](evidence/browser-results.json) records per-test timing and status.

## Unit and persistence tests — original 20-test run: 20 passed, zero failed

| IDs | Steps / expected result                              | Actual result                                 | Stories / bug references |
| --- | ---------------------------------------------------- | --------------------------------------------- | ------------------------ |
| D01 | Calculate occupied rent/percentage and empty data    | Correct totals, zero-safe                     | US01; B-001/B-009/B-015  |
| D02 | Combine query and status; use absent query           | Matching rows only                            | US02                     |
| D03 | Supply invalid rent/address/postcode/bedrooms/status | Errors returned; valid property accepted      | US03                     |
| D04 | Compare address/postcode case and whitespace         | Same duplicate key                            | US03                     |
| D05 | Today, day 30/day 31, past and invalid dates         | Inclusive boundary and invalid date rejection | US05; B-002              |
| D06 | Advance repair and pass invented status              | Valid next status; invalid throws             | US04                     |
| D07 | Export quotes, commas, newlines and = formula        | Proper CSV escaping and text prefix           | US06; B-014              |
| D08 | Supply bad collection, duplicate ID, orphan          | Validation rejects                            | US03/05; B-006           |
| A01 | Overlap startup and 12 writes                        | All 20 properties retained                    | US03; B-004              |
| A02 | Fail fetch then retry                                | Rejection then eight seed properties          | US10                     |
| A03 | Fail reset fetch after saving                        | Existing snapshot unchanged                   | US07; B-005              |
| A04 | Corrupt JSON then reset                              | Controlled rejection, successful recovery     | US10; B-006              |
| A05 | Throw during setItem                                 | No successful write; saved snapshot unchanged | US10                     |
| A06 | Delete properties linked to repairs/certificates     | Both attempts blocked                         | US03; B-003              |
| A07 | Submit same record concurrently                      | One success, one rejection                    | US03; B-007              |
| A08 | Missing ID, invalid transition, valid update         | Rejections then successful scheduled state    | US04                     |
| A09 | Fetch empty arrays                                   | Valid empty workspace                         | US01/10                  |
| A10 | Return object instead of array                       | Rejection without saved partial state         | US10                     |
| A11 | Load old v1 data                                     | Migration preserves record and old key        | US07                     |
| A12 | Race property deletion with linked repair creation   | Delete succeeds; orphan creation rejected     | US03/04; B-004           |

Source: tests/domain.test.js and tests/api.test.js. Final execution output is in evidence/unit-results.txt. These tests use controlled storage/fetch doubles; B08/B09 add real browser evidence.

## Development failures and retest

Initial browser run: 5 passed, 6 failed. B04 exposed focus leaving the dialog at the final control. Five B07 instances exposed invalid ARIA on the occupancy bar and low-contrast table/chart text. Fixes added explicit Tab wrapping, an image role and darker text. The next run passed 11 tests; the expanded final run passed 14. [Initial failed output](evidence/browser-initial-results.json), bug-report.md B-011/B-012 and final screenshots preserve the evidence.

Earlier static validation found implicit HTML types, a disallowed autocomplete value, unlabelled semantic role and missing caught-error cause. These were corrected; ESLint and html-validate passed afterwards. CSS Tree passed. Dependency audit initially found five high advisories through Stylelint; that unused tool was replaced, after which audit reported zero vulnerabilities.

## Source/build verification

Final commands and exit codes are recorded in evidence/quality-results.txt: npm test, lint, validate:html, validate:css, format:check, check:links and build. The CSS check validates syntax and supported property/value grammar, with CSS variable values covered by the browser. Console pageerror assertions passed in B01/B07; caught error logging is expected in deliberately failed-loading scenarios.

### HTML validation — local and official tools

`html-validate` provides fast local checks for element structure, required attributes, deprecated elements, ARIA usage, accessible names and form semantics. It is complementary evidence, not a claim that one tool is identical to the official service. Both HTML files pass the local command.

The reproducible `npm run validate:official` command posts the source files directly to the official hosted services and fails when either service reports an error.

[Exact hosted-validator output](evidence/official-validator-results.txt) is retained with the project.

| File                    | Tool                      | Result                                       | Date        |
| ----------------------- | ------------------------- | -------------------------------------------- | ----------- |
| `index.html`            | html-validate             | Passed                                       | 27 Oct 2026 |
| `404.html`              | html-validate             | Passed                                       | 27 Oct 2026 |
| `index.html`            | W3C Nu hosted validator   | 0 errors; 12 informational notices           | 27 Oct 2026 |
| `404.html`              | W3C Nu hosted validator   | 0 errors; 4 informational notices            | 27 Oct 2026 |
| `assets/css/styles.css` | W3C Jigsaw hosted service | Valid; 0 errors; 16 custom-property warnings | 27 Oct 2026 |

### CSS validation — local and official tools

CSS Tree provides the fast local syntax/property-value check. The hosted Jigsaw result above is the official-service evidence. Its 16 remaining warnings concern values expressed through CSS custom properties; they are disclosed rather than suppressed and do not change Jigsaw's `valid: true`, zero-error result.

## Outstanding / not run

- The 12 October cloud revision passed 14 browser workflows and 13 HTTP/hash checks. See [deployed results](deployed-test-results.md). The production site still requires a fresh deployment and repeat regression for the 27 October IndexedDB change.
- Screen-reader speech, physical touch devices, actual OS high-contrast settings and independent learner usability feedback remain unverified. The scoped agent-operated native Chrome 200%/400% zoom review is complete; see [manual review](manual-accessibility-review.md).
- Firefox/Safari remain untested. A separate full Edge run subsequently passed; see additional-verification.md.
- Every possible malformed record and extreme dataset size remain outside scope. Exact 15-second service timeout/cancellation was subsequently tested with virtual time in A14.
- No independent accessibility certification or assessor acceptance.

Manual observations should be added to test-results-template.md by the person actually performing them, with date, expected/actual result, bug and evidence references.

## Expanded verification

The initial 20-test table remains the original executed record. The expanded Node run passed 24 tests, including A13–A16 for out-of-order responses, timeout and sibling cancellation. See [additional verification](additional-verification.md), which also records Edge and forced-colour/reduced-motion emulation.

## Native UI review

Eight scoped observations of the installed Chrome browser at actual 200%/400% zoom passed; see [manual review](manual-accessibility-review.md) for the steps, screenshots and limitations. This is agent-operated direct UI evidence, not a learner session or screen-reader speech test.
