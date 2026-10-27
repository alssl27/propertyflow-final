# PropertyFlow AI-assistance disclosure

**Prepared for learner and centre review on 27 October 2026.** This records the assistance visible in the project and its revision history. It may accompany an assessment only if the centre permits the relevant use and the required declaration process is followed. It is not evidence that the learner has independently reviewed the work, obtained permission or submitted the assessment.

Project: PropertyFlow, Gateway Qualifications Level 5 Diploma in Web Application Development, Unit 2: Interactive Front End Development (`A/650/3526`).

- Live application: [PropertyFlow](https://propertyflow-final.vercel.app).
- Public repository: [alssl27/propertyflow-final](https://github.com/alssl27/propertyflow-final).
- Provenance and references: [Sources](sources.md).
- Policy status: [Academic-integrity and AI policy review](academic-integrity-review.md).
- Genuine revision history: [Development log](development-log.md) and the repository's Git history.

## Assistance used

IBM Bob was used as an AI coding assistant for substantial parts of the application. The source-level assistance records attribute work including the SPA shell and routing, rendering and event handling, accessible dialogs and validation, domain rules, asynchronous loading and persistence, reporting/export behaviour, the CSS design system, responsive behaviour, source comments and automated tests.

OpenAI Codex subsequently inspected and revised the supplied workspace. Its work included implementation and refactoring, defensive validation, accessibility fixes, test authoring and execution, browser evidence, explanatory and assessment documentation, repository publication and Vercel deployment. On 26 October it also diagnosed a real cross-process lost-update race, changed authoritative browser persistence from whole-snapshot `localStorage` writes to IndexedDB transactions, strengthened the browser stress test, corrected official W3C validator findings and updated the supporting evidence.

The user authorised Vercel publication and selected the `alssl27` account after an account-access issue. The user separately approved ordinary, non-history-rewriting pushes of the source, documentation, screenshots and genuine commits to the existing public GitHub repository. The current deployed and repository state must be checked in [Deployed test results](deployed-test-results.md) and [Additional verification](additional-verification.md); this disclosure does not turn an older deployment result into evidence for a later revision.

The [Project evaluation](project-evaluation.md), this disclosure and other explanatory documents are assisted writing. They must not be presented as unaided personal reflection or as proof of understanding that the learner has not demonstrated. Agent-operated browser reviews are not independent participant feedback or human screen-reader sessions.

## Supplied work and authorship boundaries

The original project folder was supplied by the learner and is preserved in Git commit `5cdfe36`. Its earlier authorship and development process were not independently verified. The revision history records later assisted changes, including a large revision and a vaguely named `final commit`; the history has not been rewritten to make it appear more polished.

Some assisted commits use the project identity `PropertyFlow project <propertyflow@example.invalid>`. That identity records project revisions and must not be treated as proof of unaided learner authorship. The retrospective wireframe describes the finished interface; it is not evidence that the design preceded implementation.

## Tools, evidence and limitations

The shipped application uses custom HTML, CSS and vanilla JavaScript modules and has no runtime package dependency. Development tools include Node's test runner, ESLint, Prettier, html-validate, CSS Tree, the official W3C Nu HTML validator and W3C Jigsaw CSS validator, Playwright and axe-core. Versions are recorded in `package-lock.json`; roles and upstream references appear in [Sources](sources.md).

Screenshots were captured from the implemented application in browsers and are not generated mock-ups. Automation and controlled mocks were used for selected interactions, failures and timing cases. Forced-colour and reduced-motion emulation does not establish actual operating-system contrast-mode use. Automated accessibility scans do not establish complete WCAG conformance.

The source and starter JSON contain fictional demonstration data. PropertyFlow is a static front-end prototype using IndexedDB in supported browsers, with `localStorage` as a compatibility mirror/fallback; it is not a secure production property-management service or shared server database.

No customer research, independent learner usability session, human screen-reader result, physical touch-device result, personal learning experience, assessor approval or institutional permission should be inferred unless separately recorded with genuine evidence.

## Course-policy status

The supplied qualification excerpt identifies Gateway Qualifications as the awarding organisation and the public qualification page confirms the unit. Gateway's public AI and malpractice guidance requires authentic learner evidence, acknowledgement of permitted AI use and centre instructions about what use is allowed. Those general sources do **not** establish this learner's assessment-specific permission or declaration format.

The learner must obtain and retain confirmation from the actual centre or tutor about:

1. whether AI-generated or AI-revised assessed code, tests and prose are permitted, and under what conditions;
2. the required authenticity declaration, citation, prompt transcript or change record;
3. any individual demonstration or additional authorship evidence; and
4. any portal, browser, manual-test or screenshot rules beyond the supplied qualification excerpt.

Do not submit on the assumption that this disclosure alone is sufficient. Retain the assistance record, conversation, source history and evidence if requested. See [Academic-integrity and AI policy review](academic-integrity-review.md) for the official sources and an unsent clarification message.

## Learner review record

Complete this table only after each action genuinely occurs. Blank prompts are intentional.

| Item                                                           | Learner entry                                                                     |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Learner name and student identifier, if required               | _Enter your name and student ID._                                                 |
| Institution or teaching centre                                 | _Enter the actual centre name._                                                   |
| Applicable AI policy or tutor decision, including version/date | _Add the policy or written response once confirmed._                              |
| What code, tests and documents the learner personally reviewed | _List only files actually reviewed and what you verified._                        |
| What the learner can demonstrate and explain independently     | _List only workflows and technical decisions you can explain without assistance._ |
| Changes the learner personally made after review               | _List genuine edits, or state none._                                              |
| Required declaration submitted and actual date                 | _Complete only after submission through the required process._                    |

The record must distinguish IBM Bob and Codex work from what the learner personally verified or changed. An evaluator may require an individual demonstration even if AI use is allowed. No grade, acceptance or permission is guaranteed by this document.

## Recorded native-browser review

Codex operated installed Chrome at native 200% and 400% zoom, checked the documented keyboard, search and form journeys, and saved real fullscreen screenshots. The [manual accessibility review](manual-accessibility-review.md) identifies its scope and limitations. Screen-reader speech, independent learner review and assessment-specific permission remain unverified.
