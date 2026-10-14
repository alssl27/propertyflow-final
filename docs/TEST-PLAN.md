# Test plan

**Purpose:** verify core functionality, usability, responsiveness, defensive handling and asynchronous behaviour during development and after deployment.

## Environment to record

- Date/time:
- Browser and version:
- Operating system:
- Viewport/device:
- Local or deployed URL:
- Git commit:

## Functional tests

| ID  | User story / feature  | Steps                                                                | Expected result                                                               |
| --- | --------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| F01 | Initial load          | Open the site through Live Server with DevTools open                 | Dashboard loads; sample JSON loads; no uncaught console error                 |
| F02 | Navigation            | Open each sidebar route and use browser back/forward                 | Correct view and active navigation state appear; navigation remains usable    |
| F03 | KPI calculations      | Count sample properties and compare occupied count/rent roll         | Values match the current data; zero-property case does not divide by zero     |
| F04 | Search                | Search for `Abbeyhills`, then a non-matching phrase                  | Matching row appears; unknown query shows an understandable empty state       |
| F05 | Filter                | Filter properties to vacant, then clear filters                      | Only vacant properties appear; clearing restores all rows                     |
| F06 | Add property valid    | Submit valid address, UK-style postcode, bedrooms, rent and status   | Save occurs once; dialog closes; property appears and toast confirms success  |
| F07 | Add property invalid  | Submit empty fields and invalid rent/postcode                        | Save is prevented; field-specific errors appear; focus moves to invalid input |
| F08 | Duplicate protection  | Add the same address + postcode twice                                | Second submission is blocked with a useful message                            |
| F09 | Property status       | Update a property status                                             | Status and related dashboard metrics update; change persists after refresh    |
| F10 | Property delete guard | Try to delete a property with linked repairs                         | Deletion is blocked with explanation                                          |
| F11 | Property deletion     | Delete a property without linked repairs and confirm                 | Row disappears after confirmation; cancel leaves it unchanged                 |
| F12 | Log repair valid      | Choose property, enter descriptive issue, choose priority and submit | Repair appears with selected priority/status and success feedback             |
| F13 | Log repair invalid    | Leave property blank or enter a very short description               | Save is prevented and relevant field errors appear                            |
| F14 | Repair status         | Advance a repair through its statuses                                | Status moves open → scheduled → in progress → complete; counts update         |
| F15 | Compliance            | Open compliance page                                                 | Records are sorted by date; sample-data caveat is visible                     |
| F16 | Report export         | Click Export CSV                                                     | A CSV download contains headers and current property rows                     |
| F17 | Browser storage       | Add a property, refresh the browser                                  | Added record remains in the same browser profile                              |
| F18 | Reset scenario        | Clear site storage through DevTools and reload                       | Starter JSON data loads again                                                 |
| F19 | Unknown route         | Visit a non-existent deployed URL                                    | Custom 404 explains the issue and offers return to overview                   |
| F20 | Mobile navigation     | Test at 375px wide; open/close sidebar                               | Sidebar overlay opens/closes and main content remains reachable               |

## Asynchronous and failure tests (distinction focus)

| ID  | Scenario                     | Method                                                                   | Expected result                                                                                    |
| --- | ---------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| A01 | Delayed initial load         | Throttle network in DevTools                                             | Loading indicator is visible while JSON requests resolve                                           |
| A02 | Failed JSON fetch            | Temporarily rename one JSON file and reload                              | Error panel explains failure and Retry is available; no blank screen                               |
| A03 | Slow search sequence         | Type a long query then quickly replace it with a short query             | Only the newest search result is shown; older delayed work cannot overwrite it                     |
| A04 | Repeat submit                | Double-click Save while persistence is pending                           | Button disables during save and only one record is created                                         |
| A05 | Invalid stored JSON          | In DevTools, set a collection key to malformed JSON and reload           | Error is caught and recovery instructions are displayed                                            |
| A06 | Storage quota/security error | Simulate blocked storage where feasible or use private browsing settings | User receives a save error; app does not claim the change succeeded                                |
| A07 | Missing record update        | Remove a record from storage before trying to update it                  | Data service returns a controlled error message                                                    |
| A08 | Empty collection             | Set collection to `[]` in localStorage and reload                        | Empty state is displayed without a runtime exception                                               |
| A09 | Promise timing               | Use DevTools network throttling and inspect console                      | Concurrent startup requests resolve safely; dashboard renders after all required data is available |

## Accessibility and usability checks

- Tab through all controls; focus remains visible and follows a logical order.
- Activate navigation, dialogs and table actions using keyboard only.
- Use the skip link to bypass navigation.
- Check that form controls have accessible labels and errors are adjacent to the relevant fields.
- Confirm status meaning is conveyed by text, not colour alone.
- Test browser zoom at 200% and mobile widths of 320px, 375px, 768px and desktop width.
- Confirm reduced-motion preference removes non-essential motion.
- Inspect contrast with a contrast checker; document any exceptions and fixes.
- Check back/forward browser navigation and direct hash routes.

## Validation and console checks

- Run the W3C HTML validator against `index.html` and `404.html`.
- Run the W3C CSS validator against `assets/css/styles.css`.
- Run a JS linter and fix errors/warnings that indicate real defects.
- Test the deployed version as well as the local version.
- Do not mark a test as passed until it has actually been run. Record failures, fixes, retest results and screenshots in `TEST-RESULTS-TEMPLATE.md`.

## Executable regression mapping added 12 October 2026

| Suite   | User stories   | Executable cases                                     | Run                  |
| ------- | -------------- | ---------------------------------------------------- | -------------------- |
| Domain  | US01–US06      | D01–D08 calculations, validation, dates, CSV, schema | npm test             |
| Service | US03/US07/US10 | A01–A12 races, failures, migration, integrity        | npm test             |
| Browser | US01–US10      | B01–B10; B07 parameterised at five widths            | npm run test:browser |

The supplied F/A tables above remain useful manual scenarios; their IDs are separate from the executable Node A-series. Actual executed results and bug references are in TEST-RESULTS.md. Automated tests use independent fictional browser contexts. Deployed Chrome/Edge checks and a scoped agent-operated [native Chrome 200%/400% zoom review](MANUAL-ACCESSIBILITY-REVIEW.md) are complete. Screen-reader speech, physical touch-device, actual OS contrast, any required Firefox/Safari and independent learner usability checks remain unverified. Certificate add/edit/filter, property/repair editing, Settings reset and two-tab locking are explicitly covered by the added browser tests.
