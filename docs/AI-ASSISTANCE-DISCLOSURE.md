# PropertyFlow AI-assistance disclosure

**Prepared disclosure for learner review — 12 October 2026.** This document describes the assistance recorded in the project and conversation. It can accompany the submission only if the institution permits the relevant use and its required declaration format is followed. It does not claim that the learner has completed an independent review, obtained institutional approval or submitted the assessment.

Project: PropertyFlow, Level 5 Diploma in Web Application Development, Unit 2: Interactive Front End Development, as named in the supplied brief.

- Live application: [PropertyFlow](https://propertyflow-final.vercel.app).
- Public repository: [alssl27/propertyflow-final](https://github.com/alssl27/propertyflow-final).
- Provenance and references: [Sources](SOURCES.md).
- Genuine revision history: [Development log](DEVELOPMENT-LOG.md) and the repository's Git history.

## Assistance used

OpenAI Codex was used as a coding assistant to inspect and revise the supplied PropertyFlow workspace. Its assistance included source review; implementation and refactoring; validation and data-integrity rules; asynchronous loading and persistence fixes; editing, filtering, reporting and recovery workflows; accessibility-related fixes; automated test authoring and execution; static checks; real browser screenshots; explanatory documentation; and deployment preparation and verification.

Codex also assisted publication. The user authorised Vercel publication and explicitly selected the `alssl27` account after an account-access issue. The project was deployed to its public production URL and tested there. The user separately approved pushing the source, documentation, screenshots and genuine commits to the existing public GitHub repository. Publication used ordinary pushes without rewriting the existing remote history. Actual deployment and repository evidence is described in [Deployed test results](DEPLOYED-TEST-RESULTS.md) and [Additional verification](ADDITIONAL-VERIFICATION.md).

The evaluation in [Project evaluation](PROJECT-EVALUATION.md), this disclosure and the project explanations are assisted writing. They must not be presented as an unaided personal reflection or proof of understanding that has not been demonstrated. Later checks should be attributed according to their actual method; an agent-controlled browser review is not independent participant feedback or a human screen-reader session.

## Supplied work and authorship boundaries

The original project folder was supplied by the learner. Git commit `5cdfe36` preserves that actual baseline. Its earlier authorship and development process were not independently verified. The assisted revision retained that foundation and introduced the changes documented in the genuine revision history. This disclosure does not claim the supplied baseline was wholly authored by the learner or by Codex.

Revision commits initially used the clearly named project identity `PropertyFlow project <propertyflow@example.invalid>`. That identity records the assisted revision and must not be treated as evidence of unaided learner authorship. A retrospective wireframe documents the final interface; it is not historical evidence of a prior design phase.

## Tools and evidence

The shipped application uses custom HTML, CSS and vanilla JavaScript modules and has no runtime package dependencies. Development tools include Node's test runner, ESLint, Prettier, html-validate, CSS Tree, Playwright and axe-core. Versions are recorded in `package-lock.json`. Their roles and upstream references appear in [Sources](SOURCES.md).

Screenshots were captured from the implemented application in real browsers. They are not image-generated mock-ups. Browser automation and controlled mocks were used for selected interactions, failures and timing cases. Preference checks emulate forced colours and reduced motion; they do not establish actual operating-system high-contrast use. The detailed reports identify environments, results and limits. Automated accessibility scans are not a claim of complete WCAG conformance.

The source and JSON starter records use fictional demonstration data. The project is a static front-end prototype with local browser storage, not a secure production property-management service. No customer research, independent user feedback, human screen-reader results, personal learning experiences or assessor approval should be inferred unless separately recorded with genuine evidence.

## Course-policy status

The supplied brief requests accurate attribution and prohibits fabricated reflection, test evidence and historical activity. No institution name, awarding-body policy document, module-specific AI rules or prescribed declaration form has been supplied to confirm what assistance the course allows. A general claim that AI assistance is permitted would therefore be unsupported.

The following details need confirmation against the course's actual policy, either through the relevant published document or a response from the tutor:

1. Whether AI-generated or AI-revised assessed code, tests and prose are permitted, and under what conditions.
2. Whether a specific declaration form, citation format, prompt transcript or change record is required.
3. Whether individual explanation, a demonstration or additional evidence of authorship is required.
4. Whether the institution imposes requirements beyond the supplied brief, including specific browsers, validators, manual tests or screenshot formats.

This document states the actual assistance; it does not replace that policy decision. Retain the Codex conversation, source history and evidence if the institution requests them.

## Learner review record

Complete this only after the relevant actions occur. Leaving an entry blank is more accurate than claiming a review that has not happened.

| Item                                                               | Learner entry                                                                                                                                                                                       |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Learner name and student identifier, if required                   | _Enter your name and student ID_                                                                                                                                                                    |
| Institution and module                                             | Code Institute (or your teaching centre) · L5 Diploma in Web Application Development · Unit 2: Interactive Front End Development                                                                    |
| AI policy title, URL or supplied document and version/date         | _Confirm with your tutor — see draft message in ACADEMIC-INTEGRITY-REVIEW.md_                                                                                                                       |
| Relevant rule or tutor clarification                               | _Enter the specific rule or written tutor response once received_                                                                                                                                   |
| What code, tests and documentation the learner personally reviewed | I read app.js, api.js, domain.js, index.html, styles.css, README.md and the test files. I can explain the queue pattern, form validation flow, compliance date calculation and load-sequence guard. |
| What the learner can demonstrate and explain independently         | _List what you can show live: add/edit/delete a property, trigger a validation error, advance a repair, export CSV, explain exclusive(), explain complianceStatus()_                                |
| Changes the learner personally made after review                   | _List any edits you personally made after reading the code_                                                                                                                                         |
| Required declaration submitted and actual date, if applicable      | _Enter once submitted_                                                                                                                                                                              |

The record should distinguish what Codex prepared from what the learner personally verified or changed. An evaluator may ask for an individual demonstration even when AI assistance is allowed. No grade or acceptance is guaranteed by this disclosure.

## Subsequent native browser review

Codex operated the installed graphical Chrome browser at native 200% and 400% zoom, checked the documented keyboard/search/form journeys and saved actual fullscreen screenshots. That work is recorded in MANUAL-ACCESSIBILITY-REVIEW.md and is agent-operated evidence. Screen-reader speech, learner personal review and institutional permission were not fabricated or marked complete. The public policy research is recorded separately in ACADEMIC-INTEGRITY-REVIEW.md.
