# Sources, attribution and AI assistance

## Provenance

The original PropertyFlow folder was supplied by the learner and is preserved in Git commit `5cdfe36`. Its earlier authorship and development history have not been independently verified. It contained the application shell, styling, fictional JSON records, favicon and initial documentation.

Source comments record substantial IBM Bob assistance with the HTML structure, CSS design system, JavaScript UI and routing, domain rules, persistence, accessibility, comments and tests. OpenAI Codex later inspected and revised the code, expanded and ran tests, produced browser evidence and documentation, published the approved repository/deployment, replaced race-prone browser writes with IndexedDB transactions, and corrected official validator findings. See the detailed [AI-assistance disclosure](ai-assistance-disclosure.md).

The learner must verify and understand the work and follow the centre's declaration requirements. No personal reflection, historical activity, policy permission or assessor approval has been invented. Retrospective design diagrams are labelled. Screenshots come from actual application rendering, not image generation.

## Assessment and policy sources

- [Supplied Unit 2 qualification excerpt](reference/unit-2-interactive-front-end-development.pdf) — pages 36–44 of the qualification specification, including Unit 2 criteria and amplification. Its project-specific interpretation is recorded in the [course-specification review](course-specification-review.md).
- [Gateway Qualifications Level 5 Diploma in Web Application Development](https://www.gatewayqualifications.org.uk/qualification/gateway-qualifications-level-5-diploma-in-web-application-development/) — current public qualification page, retrieved 26 October 2026.
- [Gateway Qualifications: Artificial Intelligence and use in Assessment — Principles](https://www.gatewayqualifications.org.uk/wp-content/uploads/2024/04/Artificial-Intelligence-and-use-in-Assessment.pdf) — authenticity, declaration and permitted-use principles, retrieved 26 October 2026.
- [Gateway Qualifications: Malpractice and Maladministration Policy and Procedure](https://www.gatewayqualifications.org.uk/wp-content/uploads/2022/06/Malpractice-and-Maladministration-Policy-and-Procedure-version-8.0-July-2022.pdf) — current document served at the published URL, retrieved 26 October 2026.
- [Gateway Qualifications Centre Handbook: Quality & Compliance](https://www.gatewayqualifications.org.uk/centre-support/quality-assurance/centre-handbook/quality-compliance/) — centre responsibilities for authentic assessment and AI guidance, retrieved 26 October 2026.

These public sources do not supply the learner's centre-specific permission or declaration form. See [Academic-integrity and AI policy review](academic-integrity-review.md).

## Technical references

- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) — starter JSON loading.
- [MDN Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) — parallel seed-fetch aggregation.
- [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) — authoritative transactional browser persistence.
- [MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) — compatibility mirror and fallback storage.
- [MDN Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API) — additional cooperative ordering where available; IndexedDB transactions provide the authoritative cross-tab write boundary.
- [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) — modal semantics.
- [W3C Web Accessibility Initiative](https://www.w3.org/WAI/) — accessibility guidance; no independent certification claimed.
- [W3C Nu HTML Checker](https://validator.w3.org/nu/) and [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/) — official validation services required by the supplied specification's distinction guidance.
- [Vercel project configuration](https://vercel.com/docs/project-configuration) and [custom error pages](https://vercel.com/docs/custom-error-pages) — hosting and error-page configuration.
- Modern Web Guidance skill, platform-controls-dismiss-dialog guide — implementation guidance; native `showModal()` was retained with explicit close and Escape support.

The supplied Google Fonts import was removed; the final site uses locally available sans-serif fonts. Unicode symbols and the supplied local SVG are used instead of a new icon or image library.

## Development packages

No third-party JavaScript is shipped as a runtime dependency. Versions and exact transitive dependencies are pinned in `package-lock.json`; installed package licences are authoritative.

| Package              | Purpose                                       | Upstream / licence                                              |
| -------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| ESLint / @eslint/js  | JavaScript lint rules                         | [ESLint](https://eslint.org/) · MIT                             |
| globals              | Browser/Node global names for linting         | [globals](https://github.com/sindresorhus/globals) · MIT        |
| Prettier             | Consistent source/document formatting         | [Prettier](https://prettier.io/) · MIT                          |
| html-validate        | Local HTML checks                             | [html-validate](https://html-validate.org/) · MIT               |
| css-tree             | CSS parsing and property/value grammar checks | [CSS Tree](https://github.com/csstree/csstree) · MIT            |
| @playwright/test     | Browser interactions and screenshots          | [Playwright](https://playwright.dev/) · Apache-2.0              |
| @axe-core/playwright | Automated accessibility scans                 | [axe-core](https://github.com/dequelabs/axe-core-npm) · MPL-2.0 |

Stylelint was briefly installed, then removed after npm audit identified a vulnerable dependency chain. It is not part of the final toolchain. A recorded dependency audit is a point-in-time result, not a future guarantee.
