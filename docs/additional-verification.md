# Additional verification — 12 October baseline, 27 October 2026 update

The Edge, preference and expanded-service sections below record the 12 October revision. No application runtime files changed during those checks, and Chrome/deployed evidence was preserved in its existing folders. Application runtime files changed before the 27 October current-revision run; therefore the older production evidence is not presented as verification of the new IndexedDB persistence implementation.

## IndexedDB race regression — 27 October

The full local browser suite first returned 13/14 because B09 lost a write. Ten focused repetitions of the old implementation failed four times, confirming that Web Locks did not prevent a browser process from reading a stale `localStorage` cache. Browser persistence now uses IndexedDB as the authority, with each read/validate/mutate/write sequence in one `readwrite` transaction.

After the fix, B05 (corrupt workspace recovery), B08 (failed write and retained form) and B09 passed together, **3/3**. B09 then passed **10/10** repeated runs with `navigator.locks` deliberately unavailable. Each run makes 20 simultaneous two-tab write pairs and checks all records from both pages plus a fresh third page: **400 writes** were retained across the stress retest. This isolates the IndexedDB transaction guarantee instead of relying on Web Locks. The complete local browser suite subsequently passed **14/14**, and the local forced-colour/reduced-motion suite passed **5/5**. The current deployed suite was still pending at the time of this entry.

## Official validators — 27 October

The first official run identified four errors in `index.html`, one in `404.html` and 21 stylesheet errors. After source corrections, `npm run validate:official` returned zero W3C Nu errors for both HTML files and a valid, zero-error W3C Jigsaw result. Jigsaw retained 16 warnings because it cannot statically resolve CSS custom-property values. Local HTML/CSS checks and the targeted B04/B07/B10 accessibility regression also passed after those changes.

## Edge cross-browser run

Microsoft Edge 155.0.4283.45, Windows, Node v26.10.0, Playwright 1.64.0, headless. All fourteen shared workflows passed with zero failures, skips or flaky tests in 56.2 seconds. Six routes were scanned at 320, 375, 768, 1024 and 1440px, including keyboard/form/persistence/history/CSV/error/two-tab journeys and enabled axe checks. The desktop and mobile screenshots were visually inspected. Edge's initial sandbox startup failed before app interaction; the unchanged suite succeeded with authorised host/browser access.

[Actual Edge JSON](evidence/edge/browser-results.json) · [Environment and scope](evidence/edge/environment.json) · [Desktop](evidence/edge/dashboard-1440.png) · [320px](evidence/edge/dashboard-320.png)

## Colour and motion preferences

Five checks AC01–AC05 passed in Chrome on the live site at 375×1000. Playwright emulated forced-colors: active and prefers-reduced-motion: reduce. Media queries became active; six headings remained visible, page-wide overflow was absent and hidden mobile navigation stayed inert. The sidebar transition was reduced to 0.00001 seconds. Form validation remained text-described, focused the first invalid input and supported Escape. No uncaught pageerror occurred.

[Exact results](evidence/accessibility/results.json) · [Dashboard](evidence/accessibility/forced-colours-dashboard.png) · [Form error](evidence/accessibility/forced-colours-form-error.png)

These five checks used preference emulation; they did not observe an actual Windows high-contrast setting, screen-reader speech or native browser zoom. A separate scoped agent-operated [native Chrome 200%/400% zoom review](manual-accessibility-review.md) is complete. Screen-reader speech and actual OS contrast/touch-device checks remain unverified.

## Additional asynchronous tests

Four service tests extend A01–A12:

| ID  | Steps / expected result                                                                                                   | Actual |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------ |
| A13 | Complete seed requests compliance → repairs → properties; retain correct mapping, save only when all done, clear timer    | Passed |
| A14 | Advance virtual time to 14,999 then 15,000 ms; pending fetches abort only at deadline, no partial save, next load retries | Passed |
| A15 | One seed responds HTTP503; cancel siblings and preserve existing reset snapshot                                           | Passed |
| A16 | response.json rejects with SyntaxError; cancel siblings, retain cause and save no partial workspace                       | Passed |

All sixteen service tests and eight domain tests passed together: **24/24 Node tests**. Controlled mocks and virtual time validate the service rules; they do not claim a real-network fifteen-second timeout was observed. The existing browser failure tests cover visible loading/retry separately.

[Added test output and limits](evidence/async-additional-results.txt) · [Combined 24-test output](evidence/unit-expanded-results.txt)

## GitHub source evidence

The workspace was found configured to the existing public repository [alssl27/propertyflow-final](https://github.com/alssl27/propertyflow-final), with its master branch initially at fa4aa11. Automatic approval review rejected the first push because public GitHub destination/payload approval was not explicit. The user then explicitly approved publishing source, assessment documentation, screenshots and project commits to that repository. A normal fast-forward push fa4aa11 → 6ffa771 succeeded and its remote branch hash was independently checked. Additional verification files are committed and pushed with the same approval; final git log/remote verification identifies the complete current snapshot. No force-push or history rewrite occurred. Ignored environment/link files are not tracked.

## Reproduce

```powershell
npm test
npm run validate:official
npx playwright test tests/browser/workflows.spec.js --grep "B09" --repeat-each=10
$env:BASE_URL = 'https://propertyflow-final.vercel.app'
npm run test:edge
npm run test:accessibility
Remove-Item Env:BASE_URL
```

Each test config saves separate evidence. The recorded Edge suite and scoped agent-operated native Chrome zoom review are complete for their named revisions. Remaining learner work: screen-reader speech, physical touch-device and actual OS high-contrast checks, Firefox/Safari if required, independent usability feedback, review of the prepared academic-integrity disclosure and applicable policy, and personal reflection. No assessor approval or assessment submission is claimed.
