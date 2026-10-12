# Genuine development log

## Starting point — 12 October 2026

The supplied folder was not a Git repository. Initial inspection read the HTML, CSS, modules, JSON and documentation. No earlier source history, executed tests or deployed URL were supplied. Commit `5cdfe36` (`chore: preserve supplied project starting point`) records the real starting point, not a fabricated earlier development milestone. The initial ASSESSMENT-AUDIT.md records gaps discovered before implementation.

## Data integrity and tests

Commit `f5b60e6` (`fix: validate and serialise workspace persistence with regression tests`) introduces pure domain rules, one atomic workspace snapshot, a shared queue, cooperating-tab locks and failure-safe reset. Twenty Node tests passed. The design keeps a static front end and documents that localStorage is synchronous even though loading and queue/lock acquisition are asynchronous.

## Workflows and accessible UI

Commit `73e93f4` (`feat: complete editing workflows and accessible dynamic dashboard`) adds property/repair/certificate editing, filters and Settings, replaces invented history with current data, strengthens deletion guards and repairs mobile/dialog access. The initial browser tests exposed real focus, ARIA and contrast failures; fixes were retested. Eleven tests passed, then an expanded fourteen-test run also passed. Real screenshots and both initial/final machine-readable reports were retained.

## Quality tooling and documentation

Commit `c128409` (`test: verify browser workflows accessibility and static release checks`) records runnable tests, named validators, screenshots and release preparation. A following documentation commit records the final assessment/learner documents and completed quality log. Use `git log --oneline` for their exact hashes. ESLint and html-validate findings were corrected. CSS Tree replaced Stylelint after a dependency advisory; npm audit then reported zero vulnerabilities. Prettier formats the code and documents; a link checker and copy-only static build support reproducibility.

At the initial local handover, learner-facing documentation distinguished evidence from plans and left cloud tests/manual accessibility unchecked. Wireframes were labelled retrospective. The subsequent cloud verification is recorded below; no historical learner activity is claimed.

## Identity, publication and learner reflection

Commits use `PropertyFlow project <propertyflow@example.invalid>` to avoid inventing the learner's author identity. Configure your own name/email for future work. No remote is configured and nothing was pushed. The user approved Vercel publication on 12 October 2026. The connected integration returned HTTP 403 on project creation. CLI inspection found a different signed-in owner; publication remains blocked pending account selection/access. VS Code was opened and the project window confirmed.

The learner should write their own reflection: which errors they understood, which UX choices they agree with, what they changed after personal testing and what they would improve next. Do not submit this generated record as personal reflection. See SOURCES.md for AI assistance and provenance.

## Approved account selection, deployment and live verification

The user selected alssl27 after the connected Sarah integration denied project creation. The CLI created and linked a new propertyflow-final project in alssl27s-projects, then published production deployment dpl_2yRE1N5Gcp4EtpWTmdLuBt6ZSRH1. Upload commit c3715fd adds a separate deployed test config and screenshot directory; runtime assets are unchanged from fa4aa11. Vercel's remote install/build passed. All 14 browser workflows and 13 independent HTTP/hash checks passed on https://propertyflow-final.vercel.app; actual screenshots and JSON are retained in docs/evidence/deployed. Documentation/matrix/checklist now reflect verified cloud criteria. GitHub publication and learner checks remain outstanding.
