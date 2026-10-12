# Initial assessment audit — 12 October 2026

Inspection of supplied source, before implementation. This is a baseline audit, not final verification. Final statuses belong in ASSESSMENT-CRITERIA-MATRIX.md.

| Criterion | Requirement | Current implementation | Missing work | Evidence file or feature | Status |
|---|---|---|---|---|---|
| 1.1 | Accessibility, layout, navigation and purpose | Supplied implementation and documentation | Implement improvements and verify with recorded evidence | README.md; assets/js/app.js | Partial |
| 1.2 | User-controlled interactions and feedback | Supplied implementation and documentation | Implement improvements and verify with recorded evidence | README.md; assets/js/app.js | Partial |
| 1.3 | Custom responsive HTML, CSS and JavaScript | Supplied implementation and documentation | Preserve and regression-check | README.md; assets/js/app.js | Complete |
| 1.4 | JavaScript responses to actions | Supplied implementation and documentation | Preserve and regression-check | README.md; assets/js/app.js | Complete |
| 1.5 | Accurate graphics, legibility and consistency | Supplied implementation and documentation | Implement improvements and verify with recorded evidence | README.md; assets/js/app.js | Partial |
| 2.1 | Lint and HTML/CSS validation | No executed tool results supplied | Implement improvements and verify with recorded evidence | docs/TEST-PLAN.md | Needs Verification |
| 2.2 | Compound statements, conditions and iteration | Supplied implementation and documentation | Preserve and regression-check | README.md; assets/js/app.js | Complete |
| 2.3 | Empty and invalid input | Supplied implementation and documentation | Implement improvements and verify with recorded evidence | README.md; assets/js/app.js | Partial |
| 2.4 | All required workflows | Supplied implementation and documentation | Implement improvements and verify with recorded evidence | README.md; assets/js/app.js | Partial |
| 2.5 | External scripts and styles | Supplied implementation and documentation | Preserve and regression-check | README.md; assets/js/app.js | Complete |
| 2.6 | Readable, maintained code | Supplied implementation and documentation | Implement improvements and verify with recorded evidence | README.md; assets/js/app.js | Partial |
| 2.7 | Descriptive filenames | Supplied implementation and documentation | Preserve and regression-check | README.md; assets/js/app.js | Complete |
| 2.8 | No uncaught interaction errors | No executed tool results supplied | Implement improvements and verify with recorded evidence | docs/TEST-PLAN.md | Needs Verification |
| 2.9 | Organised directories | Supplied implementation and documentation | Preserve and regression-check | README.md; assets/js/app.js | Complete |
| 3.1 | Automated versus manual testing | Supplied implementation and documentation | Implement improvements and verify with recorded evidence | README.md; assets/js/app.js | Partial |
| 3.2 | Functional, usability and responsive tests | No executed tool results supplied | Implement improvements and verify with recorded evidence | docs/TEST-PLAN.md | Needs Verification |
| 3.3 | Genuine screenshot evidence | No evidence supplied | Implement improvements and verify with recorded evidence | docs/TEST-RESULTS.md (to create) | Missing |
| 3.4 | Development, implementation and deployment tests | No executed tool results supplied | Implement improvements and verify with recorded evidence | docs/TEST-PLAN.md | Needs Verification |
| 3.5 | Actual test results | No evidence supplied | Implement improvements and verify with recorded evidence | docs/TEST-RESULTS.md (to create) | Missing |
| 4.1 | Cloud deployment | No evidence supplied | Implement improvements and verify with recorded evidence | docs/TEST-RESULTS.md (to create) | Missing |
| 4.2 | No obsolete code or broken links | No executed tool results supplied | Implement improvements and verify with recorded evidence | docs/TEST-PLAN.md | Needs Verification |
| 4.3 | Git and GitHub | No evidence supplied | Implement improvements and verify with recorded evidence | docs/TEST-RESULTS.md (to create) | Missing |
| 5.1 | Genuine development cycle | Supplied implementation and documentation | Implement improvements and verify with recorded evidence | README.md; assets/js/app.js | Partial |
| 5.2 | Purpose and real-world value | Supplied implementation and documentation | Preserve and regression-check | README.md; assets/js/app.js | Complete |
| 5.3 | Source and AI attribution | Supplied implementation and documentation | Implement improvements and verify with recorded evidence | README.md; assets/js/app.js | Partial |
| 5.4 | Professional Markdown | Supplied implementation and documentation | Implement improvements and verify with recorded evidence | README.md; assets/js/app.js | Partial |

## Merit and distinction gaps

| Criterion | Requirement | Current implementation | Missing work | Evidence file or feature | Status |
|---|---|---|---|---|---|
| Merit UX | Accessible structure, recovery and wireframes | Native dialogs; relative timed 404; supplied diagram | Fix nested-path recovery, contrast, focus and date graphics; label retrospective designs | index.html; 404.html; docs/UX-WIREFRAME.md | Partial |
| Merit process | Small commits, rationale, testing, deployment procedure | Suggested history and unfilled test templates | Record genuine commits, bugs, tests and deployment status | docs/DEVELOPMENT-LOG.md | Missing |
| Distinction async | Explain and test timing and shared-data races | Promise.all; simulated delays; search token | Serialise writes, validate storage, reject stale startup responses, failure tests | assets/js/api.js | Partial |
| Distinction functionality | Complete considered solution | Five views, creation, status changes | Property/repair editing, compliance updates/filtering, reset, accurate reports | assets/js/app.js | Partial |
| Distinction craftsmanship | Accurate, polished, maintainable implementation | Cohesive shell; minified CSS; fabricated trend | Remove invented financial trend; dynamic graphics; formatting and tests | assets/css/styles.css | Partial |
| Distinction evidence | Real-world rationale, matching design, attribution, no known tested logic errors | Basic rationale and references | Full evidence matrix, handover and actual results; learner verification | docs/ | Needs Verification |

## Confirmed source defects

- Hardcoded trend and donut segments; compliance statuses never age.
- Empty report assigns maintenance a 100% segment.
- Deletion protects repairs only; linked compliance can become orphaned.
- Concurrent first-run loads can overwrite mutations; reset removes keys before replacement succeeds.
- Saved JSON is not schema-validated. Forms lack an explicit submission guard.
- Refresh reports success even after failure. In-flight loading can override newer results.
- Property and repair edits, compliance date editing, priority filters and reset controls are absent.
- Hidden mobile navigation remains keyboard-focusable; several text colours are low contrast.
- Relative 404 redirects fail from nested unknown paths.
- No repository, automated tests or actual screenshots existed at inspection.
