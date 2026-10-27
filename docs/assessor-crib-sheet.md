# Assessor demonstration crib sheet

Prepared for learner rehearsal. Read each question, then close this file and say the answer aloud in your own words. Do not read this during an assessment.

## What to demonstrate live (in this order)

1. Open http://127.0.0.1:4173 (run `npm start` first). Show the dashboard loading from scratch.
2. Navigate to Properties. Add a new property with a valid address, postcode, bedrooms and rent. Show the success toast.
3. Try to add the same address again. Show the duplicate error on the address field.
4. Edit the property you just added — change the rent. Show it persists after page reload (F5).
5. Navigate to Repairs. Log a repair linked to your property. Show Emergency/Urgent/Routine options.
6. Click "Update status" twice. Show Open → Scheduled → In progress.
7. Navigate to Compliance. Add a certificate with an expiry date in the past. Show the Overdue status pill.
8. Try to submit the compliance form with no property selected. Show the field error **and** the toast.
9. Navigate to Reports. Show the bar charts updating. Click "Export CSV" and show the download.
10. Navigate to Settings. Click "Reset demo data". Confirm, then show the spinner and success toast.
11. Navigate to a non-existent hash like `#nonsense` in the address bar. Show it redirects to Overview.
12. Open the property dialog, then press Escape. Show the dialog closes. Show Tab key stays inside while open.

---

## Questions an assessor is likely to ask

### About the application

**Q: What problem does PropertyFlow solve?**
A: A small property team wastes time switching between spreadsheets, repair messages and certificate folders. PropertyFlow links properties, repairs and compliance certificates in one browser workspace. Managers get a single summary; maintenance coordinators get prioritised work; administrators have validated records.

**Q: Why is this a single-page application rather than separate pages?**
A: Hash-based routing lets the browser's Back/Forward buttons work correctly without needing a server. The same HTML shell stays in place — only the `<main>` area is replaced. This avoids page reloads while still letting users bookmark or share specific views.

**Q: What happens if JavaScript is disabled?**
A: A `<noscript>` tag shows a message explaining that JavaScript is required and asking the user to enable it and reload.

---

### About the JavaScript

**Q: What does `exclusive()` do in api.js, and why is it needed?**
A: It serialises every storage operation onto a Promise chain so only one runs at a time. Without it, two overlapping calls could both read the same eight properties, each add a different ninth, and then the later save would overwrite the earlier one — losing a record. `exclusive()` wraps each operation so the next one only starts after the previous save is complete.

**Q: What is the load-sequence guard for?**
A: When the user navigates quickly, a slow async load from the previous view might finish after a newer load has already started. The counter increments with each load call. Before updating the UI, the code checks that the counter still matches — if it doesn't, the older result is silently discarded.

**Q: Why does `fetchSeeds()` use `Promise.all` rather than three separate awaits?**
A: Three separate awaits would run them in series — wait for the first, then start the second, then the third. `Promise.all` fires all three at once and assembles the results in input order when all three resolve. This is faster and the input-order guarantee means `properties` is always `results[0]`, regardless of which HTTP response arrived first.

**Q: What does the AbortController do?**
A: It provides a shared signal that cancels all three fetch requests if any one of them fails, or if the 15-second timeout fires. This prevents the app from hanging on a slow connection and stops redundant network requests after a failure.

**Q: Why does `complianceStatus()` use UTC midnight instead of local time?**
A: If you compare a local midnight in summer (BST, UTC+1) with a UTC-stored date, daylight-saving time can shift the boundary by an hour. A deadline that expires "today" could appear as "yesterday" or "tomorrow" depending on the timezone. Using `Date.UTC(year, month, day)` for both sides removes that offset so the calendar-day comparison is always correct.

**Q: What is the debounce in the property search for?**
A: Without it, a re-render fires on every single keystroke. A 180 ms debounce waits until the user pauses typing, then updates only the table body — not the whole page. A sequence guard means that if the user types quickly and an older timer fires after a newer one, the stale result is discarded.

**Q: How does duplicate property detection work?**
A: `propertyKey()` normalises both the address and postcode — trim whitespace, collapse spaces, lowercase, remove postcode spaces — then joins them with a pipe. Two properties with the same address and postcode always produce the same key. Before saving, the form checks whether any existing property (other than the one being edited) shares that key.

**Q: Why is the repair status change locked to one step at a time?**
A: The workflow Open → Scheduled → In progress → Completed is intentional. Allowing a jump from Open directly to Completed would let users close a repair without recording that it was scheduled and actioned. The `nextRepairStatus()` function and the api.js guard both enforce the cycle.

**Q: What is CSV formula injection, and how does this app protect against it?**
A: If a cell value starts with `=`, spreadsheet applications like Excel treat it as a formula and execute it. This can be used maliciously to run macros or exfiltrate data. `csvCell()` in domain.js prefixes any value that starts with `=`, `+`, `@`, `-`, tab or newline with a single quote, which forces the spreadsheet to treat it as text.

---

### About testing

**Q: What did the initial browser test run find?**
A: Six failures. The modal focus trap was incomplete — Tab on the last control escaped the dialog (B-011). The axe scan found a prohibited ARIA attribute on the occupancy bar and low-contrast text on the chart and table (B-012). These were fixed and retested, and the final run passed all 14 tests.

**Q: What is the difference between the unit tests and the browser tests?**
A: Unit tests (tests/domain.test.js, tests/api.test.js) run in Node with controlled fakes for `localStorage` and `fetch`. They test pure logic: validation, calculations, search, date boundaries, CSV encoding, race conditions. They run fast and reliably without a browser. Browser tests (tests/browser/workflows.spec.js) launch real Chrome, click through the actual UI, take screenshots and run axe accessibility scans. They test end-to-end behaviour that only makes sense with a real DOM.

**Q: What does an axe scan tell you — and what does it not tell you?**
A: It finds violations of the enabled WCAG rules in the tested states — missing labels, bad contrast, invalid ARIA. It does not test screen-reader speech, cognitive usability, real keyboard interaction with a person or every possible state of the application. It is a useful automated baseline, not proof of full WCAG compliance.

---

### About UX and design

**Q: Why does the 404 page not auto-redirect?**
A: Automatic redirects (meta-refresh or JS timers) remove user control. The UX principle is that users should initiate navigation. A visible link labelled "Return to Dashboard" lets the user choose when to navigate back, works without JavaScript, and works correctly regardless of the deployment path.

**Q: Why did you use native `<dialog>` elements instead of a custom modal?**
A: Native dialogs provide Escape-to-close, backdrop rendering and focus trapping for free. The custom focus-trap code supplements it for cross-browser consistency. Using native elements means less JavaScript, better accessibility defaults and less to test.

**Q: Why is `window.confirm()` used for deletion instead of a custom dialog?**
A: A native confirm prompt is a known compromise — it looks browser-native rather than matching the app's design. It was chosen because the assessment scope is a front-end prototype and adding a third custom modal for confirmation would add code without adding assessed value. This decision is documented in ux-design.md under Compromises.

---

### About deployment and Git

**Q: Walk me through the deployment.**
A: `npm run build` copies public files (index.html, 404.html, assets/, data/) into dist/. `vercel.json` configures Vercel to serve dist as the root and handle unknown paths with 404.html. The live site is at propertyflow-final.vercel.app. deployment.md documents the account and steps; deployed-test-results.md records the 14 browser tests and 13 HTTP/hash checks that passed against the deployed origin.

**Q: What does your commit history show?**
A: The first commit preserves the supplied project folder. Later commits record domain rules, persistence fixes, workflow improvements, accessibility fixes, tests and documentation. Most are staged and labelled, but the history also contains a large multi-file revision and an unhelpful `final commit` message; those limitations are documented rather than rewritten. development-log.md explains each stage. The commits use a clearly named project identity because this was an assisted revision; future commits should use your own identity.

---

## Screen reader test steps (do these yourself with NVDA/VoiceOver)

1. Start NVDA (Windows: Ctrl+Alt+N) or enable VoiceOver (Mac: Cmd+F5).
2. Navigate to the live app. Hear the page title announced.
3. Press Tab from the top of the page. Confirm the skip link is the first item heard.
4. Activate the skip link. Confirm focus moves to the main content.
5. Press Tab through the sidebar navigation. Confirm each link is announced with its label.
6. Open the property dialog. Confirm the dialog title is announced on open.
7. Tab through the form. Confirm each label is announced with its field.
8. Leave the address field empty and submit. Confirm the error message is announced.
9. Press Escape. Confirm the dialog closes and focus returns to the control that opened it (or to the main content if a re-render removed that control).
10. Record actual spoken announcements vs expected. Note any unexpected or missing speech.

Tick the matching item in `tests/manual-test-checklist.md` and record the detailed, dated findings in `docs/test-results-template.md`.
