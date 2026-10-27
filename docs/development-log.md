# Genuine development log

## Starting point — 12 October 2026

The supplied folder was not a Git repository. Initial inspection read the HTML, CSS, modules, JSON and documentation. No earlier source history, executed tests or deployed URL were supplied. Commit `5cdfe36` (`chore: preserve supplied project starting point`) records the real starting point, not a fabricated earlier development milestone. The initial assessment-audit.md records gaps discovered before implementation.

## Data integrity and tests

Commit `f5b60e6` (`fix: validate and serialise workspace persistence with regression tests`) introduced pure domain rules, one atomic `localStorage` workspace snapshot, a shared queue, cooperating-tab locks and failure-safe reset. Twenty Node tests passed at that stage. The later 27 October entry records why this design was replaced in browsers.

## Workflows and accessible UI

Commit `73e93f4` (`feat: complete editing workflows and accessible dynamic dashboard`) adds property/repair/certificate editing, filters and Settings, replaces invented history with current data, strengthens deletion guards and repairs mobile/dialog access. The initial browser tests exposed real focus, ARIA and contrast failures; fixes were retested. Eleven tests passed, then an expanded fourteen-test run also passed. Real screenshots and both initial/final machine-readable reports were retained.

## Quality tooling and documentation

Commit `c128409` (`test: verify browser workflows accessibility and static release checks`) records runnable tests, named validators, screenshots and release preparation. A following documentation commit records the final assessment/learner documents and completed quality log. Use `git log --oneline` for their exact hashes. ESLint and html-validate findings were corrected. CSS Tree replaced Stylelint after a dependency advisory; npm audit then reported zero vulnerabilities. Prettier formats the code and documents; a link checker and copy-only static build support reproducibility.

At the initial local handover, learner-facing documentation distinguished evidence from plans and left cloud tests/manual accessibility unchecked. Wireframes were labelled retrospective. The subsequent cloud verification is recorded below; no historical learner activity is claimed.

## Identity, publication and learner reflection

Commits use `PropertyFlow project <propertyflow@example.invalid>` to avoid inventing the learner's author identity. Configure your own name/email for future work. At that stage no remote was configured and nothing had been pushed. The user approved Vercel publication on 12 October 2026. The connected integration returned HTTP 403 on project creation. CLI inspection found a different signed-in owner; publication was blocked pending the later account selection recorded below. VS Code was opened and the project window confirmed.

The learner should write their own reflection: which errors they understood, which UX choices they agree with, what they changed after personal testing and what they would improve next. Do not submit this generated record as personal reflection. See sources.md for AI assistance and provenance.

## Approved account selection, deployment and live verification

The user selected alssl27 after the connected Sarah integration denied project creation. The CLI created and linked a new propertyflow-final project in alssl27s-projects, then published production deployment dpl_2yRE1N5Gcp4EtpWTmdLuBt6ZSRH1. Upload commit c3715fd adds a separate deployed test config and screenshot directory; runtime assets are unchanged from fa4aa11. Vercel's remote install/build passed. All 14 browser workflows and 13 independent HTTP/hash checks passed on https://propertyflow-final.vercel.app; actual screenshots and JSON are retained in docs/evidence/deployed. Documentation/matrix/checklist now reflect verified cloud criteria. At that deployment stage GitHub publication and learner checks remained outstanding; subsequent GitHub verification is recorded below.

## Additional tests and approved GitHub publication

On continuing the submission work, the workspace had origin configured to the existing public alssl27/propertyflow-final repository at fa4aa11. The user explicitly approved publishing the project history/source/documentation/screenshots; a normal fast-forward push updated it to 6ffa771. Further service tests A13–A16 passed, giving 24 Node tests total. Full Edge production testing passed fourteen cases; five Chrome preference checks passed. Their independent evidence folders preserve earlier results. Test-only/configuration/documentation changes were committed and pushed, leaving the live runtime unchanged. Human checks/reflection are still learner tasks.

## Submission writing and native zoom evidence

Prepared an evidence-based evaluation, truthful AI-assistance disclosure and public academic-integrity review. A first Computer Use attempt stopped because its current browser URL could not be confidently established. At the user's retry request, a dedicated live PropertyFlow Chrome window was uniquely identified and its URL confirmed. Native 200%/400% zoom, keyboard navigation, search/filter and form validation/dismissal were reviewed. Genuine fullscreen website screenshots exclude unrelated browser details. Browser zoom was restored to 100%; no runtime or records were changed. Screen-reader speech and applicable institutional permission remain unverified rather than being assumed.

## Submission package preparation — 14 October 2026

Reconciled stale current summaries with the already recorded native zoom, Edge and expanded Node evidence, preserving original test records. Captured the previously missing Settings view on the live alias in a fresh isolated Chrome context; actual date, method and scope are in evidence-checklist.md. Added an ordered demonstration guide and a Git-based source/evidence packaging command, with per-file SHA-256 manifest and genuine commit listing. These changes prepare review materials; they do not change application runtime, establish learner understanding or submit an assessment. Generated archives stay outside tracked source and production uploads.

Independent archive verification caught this Windows machine's Git `core.autocrlf=true` conversion changing exported line endings. The packaging command now overrides that setting only during export so the ZIP can match the committed-byte manifest. The failed first archive was retained separately; the corrected archive is checked against every manifest entry before handover. The demonstration instructions were also corrected after source review, including the linked deletion guard running before confirmation.

## Persistence and official-validator correction — 27 October 2026

Repeating B09 exposed a real defect hidden by the earlier single passing run: the Web Lock was acquired, but one browser process could still read a stale `localStorage` cache and overwrite a peer's newly committed snapshot. The full local run was 13/14; isolated B09 failed 4 of 10 repeats. Browser storage was changed to IndexedDB, and each whole-workspace mutation now reads, validates, mutates and writes within one `readwrite` transaction. `localStorage` remains only a best-effort migration mirror and a fallback for environments without IndexedDB.

The correction passed B05/B08/B09 together and then B09 10/10 times with Web Locks deliberately disabled, covering 400 two-tab writes in 200 simultaneous pairs and isolating the IndexedDB guarantee. The 24 Node tests, complete 14-case local Chrome suite and five local preference-accessibility checks also passed.

The official W3C services were also added to the repeatable quality workflow. The initial hosted run reported four errors in `index.html`, one in `404.html` and 21 CSS errors. After semantic markup and stylesheet corrections, W3C Nu reported zero errors for both HTML documents and Jigsaw reported valid CSS with zero errors; 16 disclosed warnings are limitations of its static analysis of CSS custom-property values. Local lint/HTML/CSS checks and targeted accessibility regression passed after the same corrections.

## Final production verification — 27 October 2026

Commit `24fc388` (`fix: harden cross-tab storage and submission verification`) was published through the selected alssl27 Vercel account as production deployment `dpl_B95Rkz7gbkQsTQ11CvGysciNjDuC`. Vercel reported READY after a six-second build. Thirteen HTTP/status/header/hash checks passed against the public alias and matched the committed `dist` bytes, including the nested custom 404. The unique deployment URL retained Vercel Authentication.

The public production alias then passed all fourteen Chrome workflows, all fourteen Edge workflows and all five emulated forced-colour/reduced-motion checks. Current screenshots and JSON reports replaced the earlier-release copies in their separate evidence folders. A clean live Settings capture was regenerated after dismissing transient fictional notifications. These automated and agent-operated results do not complete the remaining learner screen-reader, physical-device, OS-contrast, usability, policy or portal checks.
