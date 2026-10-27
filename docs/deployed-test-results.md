# Deployed test results — final production run, 27 October 2026

Production URL: [PropertyFlow](https://propertyflow-final.vercel.app). Account/team: alssl27 / alssl27s-projects. Deployment: `dpl_B95Rkz7gbkQsTQ11CvGysciNjDuC`; target production; status READY. The uploaded runtime commit is `24fc3886903538ebdfb6d06f90a17dc372b0563a`. Vercel CLI inspection linked the deployment ID, protected unique URL and public production alias. Runtime source was independently verified by exact deployed-file comparisons against local `dist`.

Status reviewed 27 October 2026. This is the final post-IndexedDB production regression. The earlier 12 October records remain in Git history as genuine evidence for their named release, but the results below supersede them for the current runtime.

## Real browser verification

Windows, installed Google Chrome headless, Playwright 1.64.0. The complete browser suite ran against the public HTTPS production alias with no local server. Fourteen tests passed, zero failed, in 52.704 seconds, starting at `2026-10-27T00:12:20.125Z`. Enabled axe scans reported no violations in the tested six routes at five widths and property dialog. Deployed screenshots and JSON are under `evidence/deployed`. A separate installed Microsoft Edge 156.0.4314.42 run also passed 14/14 in 49.809 seconds, and the deployed forced-colour/reduced-motion suite passed 5/5.

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
| B09 IndexedDB transactions preserve two-tab writes without Web Locks                  | passed        |
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

The tests use isolated browser contexts and fictional browser records; they do not write a server database. This release uses IndexedDB as the browser authority; the `localStorage` copy is retained only for migration, notification and fallback. Static production has no application server logs. Browser assertions and HTTP checks support the runtime assessment; no Vercel-wide monitoring or independent accessibility certification is claimed. The Edge and preference results are also summarised in [additional verification](additional-verification.md). The scoped agent-operated [native Chrome 200%/400% zoom review](manual-accessibility-review.md) is complete. Screen-reader speech, physical touch-device and actual OS contrast checks, Firefox/Safari if required, and independent learner usability/authorship review remain unverified. The deployment itself used the CLI.
