# Deployed test results — recorded 12 October 2026 release

Production URL: [PropertyFlow](https://propertyflow-final.vercel.app). Account/team: alssl27 / alssl27s-projects. Deployment: dpl_2yRE1N5Gcp4EtpWTmdLuBt6ZSRH1; target production; status READY. CLI upload commit c3715fd9c8381d1356561635b6e204c153a5f80a; application runtime unchanged from fa4aa1177e2006a144c628593e6695d4ee257416. Runtime source was verified by exact deployed-file comparisons against local dist.

Status reviewed 27 October 2026. These results remain genuine evidence for the named release. They do not verify the newer local IndexedDB persistence and official-validator revision; a fresh deployment identity, complete browser run, screenshots and HTTP/hash comparison must be recorded after that revision is published.

## Real browser verification

Windows, Google Chrome 155.0.8059.39 headless, Playwright 1.64.0. The complete existing browser suite ran against the public HTTPS production alias with no local server. Fourteen tests passed, zero failed, in 52.2 seconds. Enabled axe scans reported no violations in the tested six routes at five widths and property dialog. Local evidence was preserved; deployed screenshots and JSON are under evidence/deployed.

| Test                                                                                  | Actual result |
| ------------------------------------------------------------------------------------- | ------------- |
| B01 full property workflow, duplicates, persistence, search, delete                   | passed        |
| B02 repairs create edit filter and lifecycle; linked deletion blocked                 | passed        |
| B03 certificates create edit expiry filtering, reports CSV and reset                  | passed        |
| B04 modal keyboard, validation, focus containment, history and skip link              | passed        |
| B05 slow fetch loading failure retry and corrupt storage recovery                     | passed        |
| B06 empty workspace, missing resource and custom 404                                  | passed        |
| B07 responsive 320px all views and accessibility scan                                 | passed        |
| B07 responsive 375px all views and accessibility scan                                 | passed        |
| B07 responsive 768px all views and accessibility scan                                 | passed        |
| B07 responsive 1024px all views and accessibility scan                                | passed        |
| B07 responsive 1440px all views and accessibility scan                                | passed        |
| B08 duplicate form submit and unavailable storage retain unsaved form                 | passed        |
| B09 Web Locks preserve writes from two browser tabs                                   | passed        |
| B10 quick actions, property status/filter, notification, unknown route and modal scan | passed        |

Steps and expected outcomes remain executable in tests/browser/workflows.spec.js. Stories and bug references follow test-results.md; the same workflows were now retested after cloud deployment. The suite covered real property/repair/certificate edits, persistence, reset, downloads, navigation/history, keyboard focus, slow/failed loading, corrupt/blocked storage and duplicate/two-tab writes. No uncaught pageerror was observed in monitored B01/B07 flows. Expected caught load failures were deliberately injected in B05.

[Browser JSON](evidence/deployed/browser-results.json) · [Desktop capture](evidence/deployed/dashboard-1440.png) · [320px capture](evidence/deployed/dashboard-320.png) · [Dialog capture](evidence/deployed/property-dialog.png)

## Independent HTTP and deployment checks

Thirteen read-only HTTP checks passed. Homepage/index, stylesheet, all three modules, favicon, three JSON collections and quick guide returned HTTP 200 with appropriate types. Every checked successful response matched its local dist file SHA256 exactly. Nested unknown path and missing JSON returned HTTP 404 with the custom 404 document; the browser test verified its Return to Dashboard link. No blanket SPA rewrite hides missing data. The production alias is publicly accessible; preview/unique deployment protection was not disabled.

[HTTP response/hash evidence](evidence/deployed/http-results.json) · [Deployment identity](evidence/deployed/deployment.json)

## Reproduce without overwriting local evidence

```powershell
$env:BASE_URL = 'https://propertyflow-final.vercel.app'
node node_modules/@playwright/test/cli.js test --config playwright.deployed.config.js
Remove-Item Env:BASE_URL
```

The tests use isolated browser contexts and fictional browser records; they do not write a server database. This recorded release used its then-current localStorage/Web Locks path, while the later local revision replaces authoritative browser persistence with IndexedDB transactions. Static production has no application server logs. Browser assertions and HTTP checks support the runtime assessment; no Vercel-wide monitoring or independent accessibility certification is claimed. A separate fourteen-test Edge run and five preference checks are recorded in additional-verification.md, together with later approved GitHub publication. The scoped agent-operated [native Chrome 200%/400% zoom review](manual-accessibility-review.md) is also complete. Screen-reader speech, physical touch-device and actual OS contrast checks, Firefox/Safari if required, and independent learner usability/authorship review remain unverified. The deployment itself used the CLI.
