# Actual test results — 12 October 2026

## Environment and scope

Windows; Node v26.10.0; npm 11.19.1; Google Chrome 155.0.8059.39 (headless); Playwright 1.64.0; axe integration 4.13.0; ESLint 10.12.0; html-validate 11.16.2; CSS Tree 3.2.1; Prettier 3.9.10. Local URL http://127.0.0.1:4173. Browser plugin absent; regular Playwright was used as permitted by the testing skill. Tests ran on the implemented source after commit 73e93f4; this report and test additions are committed afterwards. No cloud tests were run.

## Browser workflows — 14 passed, zero failed

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
| B09 Web Locks preserve writes from two browser tabs                                   | Passed | passed               |
| B10 quick actions, property status/filter, notification, unknown route and modal scan | Passed | passed               |

All tests were executed on the date/environment above. B01 maps US02/03; B02 maps US04; B03 maps US05/06/07; B04 maps US09; B05 maps US10; B06 maps US01/10; B07 maps US01/08/09; B08 maps US03/10; B09 maps US07; B10 maps US01/03/09. [Screenshot evidence](EVIDENCE-CHECKLIST.md) maps the specific captures. [Machine-readable final output](evidence/browser-results.json) records per-test timing and status.

## Unit and persistence tests — 20 passed, zero failed

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

Initial browser run: 5 passed, 6 failed. B04 exposed focus leaving the dialog at the final control. Five B07 instances exposed invalid ARIA on the occupancy bar and low-contrast table/chart text. Fixes added explicit Tab wrapping, an image role and darker text. The next run passed 11 tests; the expanded final run passed 14. [Initial failed output](evidence/browser-initial-results.json), BUG-REPORT.md B-011/B-012 and final screenshots preserve the evidence.

Earlier static validation found implicit HTML types, a disallowed autocomplete value, unlabelled semantic role and missing caught-error cause. These were corrected; ESLint and html-validate passed afterwards. CSS Tree passed. Dependency audit initially found five high advisories through Stylelint; that unused tool was replaced, after which audit reported zero vulnerabilities.

## Source/build verification

Final commands and exit codes are recorded in evidence/quality-results.txt: npm test, lint, validate:html, validate:css, format:check, check:links and build. The CSS check validates syntax and supported property/value grammar, with CSS variable values covered by the browser. W3C hosted validators were not run. Console pageerror assertions passed in B01/B07; caught error logging is expected in deliberately failed-loading scenarios.

## Outstanding / not run

- Cloud homepage/assets/JSON/404 tests and deployed browser regressions: pending approval and publication.
- Screen-reader speech, 200%/400% browser zoom, real touch devices, high-contrast settings and independent learner usability feedback.
- Firefox/Safari/Edge browser matrices; Chrome is the executed browser.
- Every possible malformed record and extreme dataset size; 15-second timeout path specifically is not separately timed in the suite.
- No independent accessibility certification or assessor acceptance.

Manual observations should be added to TEST-RESULTS-TEMPLATE.md by the person actually performing them, with date, expected/actual result, bug and evidence references.
