# Sources, attribution and AI assistance

## Provenance

The original PropertyFlow folder was supplied by the learner and is preserved in Git commit 5cdfe36. Its earlier authorship and development history have not been independently verified. It contained the shell, styling, fictional JSON records, favicon and initial documentation. The new revision preserves that foundation and adds domain rules, atomic persistence, editing and recovery workflows, automated tests and current evidence.

OpenAI Codex assisted source inspection, implementation, test authoring/execution, documentation and debugging on 12 October 2026. The learner must verify the work, understand it, and disclose assistance as their institution requires. No personal reflection, earlier commit history, assessment approval or deployed URL has been invented. Retrospective design diagrams are labelled. Screenshots come from actual local Chrome rendering, not image generation. No external tutorial code or stock imagery was added in this revision.

## References

- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) — conceptual reference for JSON loading.
- [MDN Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) — parallel promise aggregation.
- [MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) — browser persistence reference.
- [MDN Web Locks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API) — cooperating-tab locking reference.
- [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) — modal semantics reference.
- [W3C accessibility guidance](https://www.w3.org/WAI/) — accessibility principles; no independent certification claimed.
- [Vercel project configuration](https://vercel.com/docs/project-configuration) and [custom error pages](https://vercel.com/docs/custom-error-pages) — consulted for prepared hosting instructions.
- Modern Web Guidance skill, platform-controls-dismiss-dialog guide — retrieved during implementation; native showModal retained with explicit close/Escape support.

The supplied Google Fonts import was removed; the final site uses locally available sans-serif fonts. Unicode symbols and the supplied local SVG are used instead of a new icon/image library. These reference links are not claims that every page was fetched during this session.

## Development packages

No third-party JavaScript is shipped as a runtime dependency. Versions and exact transitive dependencies are pinned in package-lock.json; see each package's installed LICENSE for authoritative terms.

| Package              | Purpose                                       | Upstream / licence                                              |
| -------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| ESLint / @eslint/js  | JavaScript lint rules                         | [ESLint](https://eslint.org/) · MIT                             |
| globals              | Browser/Node global names for linting         | [globals](https://github.com/sindresorhus/globals) · MIT        |
| Prettier             | Consistent source/document formatting         | [Prettier](https://prettier.io/) · MIT                          |
| html-validate        | Local HTML checks                             | [html-validate](https://html-validate.org/) · MIT               |
| css-tree             | CSS parsing and property/value grammar checks | [CSS Tree](https://github.com/csstree/csstree) · MIT            |
| @playwright/test     | Actual Chrome interactions/screenshots        | [Playwright](https://playwright.dev/) · Apache-2.0              |
| @axe-core/playwright | Automated accessibility scans                 | [axe-core](https://github.com/dequelabs/axe-core-npm) · MPL-2.0 |

Stylelint was briefly installed, then removed after npm audit identified a vulnerable dependency chain. It is not part of the final toolchain. The final dependency audit reported zero vulnerabilities at the recorded time; this is not a future guarantee.
