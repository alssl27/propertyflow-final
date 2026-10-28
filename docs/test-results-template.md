# Test results and bug log

> The 27 October 2026 observations below were performed by OpenAI Codex through native Windows browser control at the user's request. They are agent-operated results, not learner testing, screen-reader speech, independent-participant feedback or evidence of learner understanding. A learner must record a separate dated session.

## Environment

- Test date: 27 October 2026
- Tester: OpenAI Codex — agent-operated native browser session; not the learner
- Browser/version: Google Chrome 156.0.8078.48, Incognito window used to isolate the test data
- OS/device: Windows desktop with native Chrome and Microsoft Excel
- Viewports: 1280 × 752 desktop window and 755 × 752 narrow native desktop window for the functional checks; the end-state console capture used Chrome DevTools' 685 × 578 responsive viewport. The planned 375 px viewport was not tested manually.
- Local URL: `http://127.0.0.1:5501` through VS Code Live Server
- Deployed URL: `https://propertyflow-final.vercel.app`
- Starting revision: `7721883e53884fc7036abbcf43f08ecfd604a56a`; runtime implementation last changed in `24fc3886903538ebdfb6d06f90a17dc372b0563a`
- Data isolation: localhost and Vercel were exercised as separate browser origins, each starting from the eight-property sample

## Results

| Test ID             | Scope                 | Actual result                                                                                                                                                                                                                                                                          | Result                            | Evidence                                                                                                   |
| ------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| F01                 | Local                 | The dashboard opened through Live Server and rendered the seeded workspace.                                                                                                                                                                                                            | Pass                              | Direct observation                                                                                         |
| F02                 | Local and deployed    | Overview, Properties, Repairs, Compliance, Reports and Settings loaded. Chrome Back and Forward returned between the tested routes.                                                                                                                                                    | Pass                              | Direct observation                                                                                         |
| F03 (seeded data)   | Local and deployed    | The starting dashboard showed 8 properties, 5 occupied, 2 vacant, 1 in maintenance, 63% occupancy and a £5,350 occupied rent roll. The zero-property case was not injected manually.                                                                                                   | Partial against the full F03 plan | Direct observation                                                                                         |
| F04a                | Local and deployed    | Searching for `Abbeyhills` returned 1 of 8 properties and the expected `12 Abbeyhills Road` row.                                                                                                                                                                                       | Pass                              | Direct observation                                                                                         |
| F04b                | Local and deployed    | A non-matching query returned 0 of 8 and displayed `No properties found`.                                                                                                                                                                                                              | Pass                              | Direct observation                                                                                         |
| F05                 | Local and deployed    | The Vacant filter returned `24 Greenacres Road` and `52 Union Street`; Clear filters restored 8 of 8.                                                                                                                                                                                  | Pass                              | Direct observation                                                                                         |
| F06                 | Local                 | `77 Manual Test Way`, `OL6 7MT`, 2 bedrooms and £999.50 rent saved once. The register increased to 9. Dialog closure and the success toast were not separately recorded.                                                                                                               | Partial against the full F06 plan | Direct observation                                                                                         |
| F06-D               | Deployed              | `88 Deployment Smoke Lane`, `OL7 8DP`, 1 bedroom and £777 rent saved once. The register increased to 9. Dialog closure and the success toast were not separately recorded.                                                                                                             | Partial against the full F06 plan | Direct observation; end-state capture: `agent-manual-deployed-overview-persisted-2026-10-27.jpg`           |
| F07                 | Local and deployed    | Invalid property submissions were blocked with field-specific address, postcode, bedroom and rent errors. Movement of focus to the first invalid input was not separately verified.                                                                                                    | Partial against the full F07 plan | Direct observation                                                                                         |
| F08                 | Local and deployed    | Re-submitting each new address and postcode displayed the duplicate-address error and did not add another record.                                                                                                                                                                      | Pass                              | Direct observation                                                                                         |
| F09                 | Local                 | Changing `77 Manual Test Way` from Occupied to Vacant updated the dashboard to 9 total, 5 occupied, 3 vacant, 56% occupancy and £5,350.                                                                                                                                                | Pass                              | Direct observation                                                                                         |
| F09-D               | Deployed              | Changing `88 Deployment Smoke Lane` from Occupied to Vacant produced the same 9 / 5 / 3 / 56% / £5,350 dashboard state.                                                                                                                                                                | Pass                              | Direct observation; aggregate end-state capture: `agent-manual-deployed-overview-persisted-2026-10-27.jpg` |
| F10                 | Local and deployed    | Deleting linked `12 Abbeyhills Road` displayed the linked-record explanation and left the property in place.                                                                                                                                                                           | Pass                              | Direct observation                                                                                         |
| F12                 | Local                 | `Manual test radiator valve leak` was saved as an Urgent repair against `77 Manual Test Way`. The subsequent F14 flow verified its starting Open status; success feedback was not separately recorded.                                                                                 | Partial against the full F12 plan | Direct observation                                                                                         |
| F12-D               | Deployed              | `Deployment smoke radiator check` was saved as an Urgent repair against `88 Deployment Smoke Lane`. The subsequent F14 flow verified its starting Open status; success feedback was not separately recorded.                                                                           | Partial against the full F12 plan | Direct observation; final-state capture: `agent-manual-deployed-repair-completed-2026-10-27.jpg`           |
| F13                 | Local and deployed    | A blank property plus the three-character issue `bad` was blocked with required-property and minimum-length errors.                                                                                                                                                                    | Pass                              | Direct observation                                                                                         |
| F14                 | Local and deployed    | Each new repair advanced Open → Scheduled → In progress → Completed. Counters then showed 4 open and 1 completed.                                                                                                                                                                      | Pass                              | Direct observation; final-state capture: `agent-manual-deployed-repair-completed-2026-10-27.jpg`           |
| F15                 | Local and deployed    | The eight compliance dates were ascending: 8, 20, 25 and 30 October 2026; 18 November 2026; 5 January, 14 February and 9 May 2027.                                                                                                                                                     | Pass                              | Direct observation; visible-row capture: `agent-manual-deployed-compliance-sorted-2026-10-27.jpg`          |
| F16                 | Local and deployed    | Both origins downloaded a CSV. The local file opened in Excel with 9 data rows and the expected five columns. The deployed file contained the same columns and 9 rows.                                                                                                                 | Pass                              | Direct observation; the Excel capture was excluded for privacy as explained below.                         |
| F17 (refresh only)  | Local and deployed    | Refresh preserved the new property, its Vacant status and the completed repair. The deployed dashboard still showed 9 / 5 / 3 / 56% / £5,350 after reload. A fresh same-origin tab was not tested manually.                                                                            | Partial against the full F17 plan | Direct observation; aggregate end-state capture: `agent-manual-deployed-overview-persisted-2026-10-27.jpg` |
| A02 + A05 + A08     | Manual session        | Empty data, failed loading and malformed authoritative storage were not manually injected. Existing automated evidence was not converted into a manual result.                                                                                                                         | Not run                           | —                                                                                                          |
| F20 (755 px window) | Local and deployed    | At a 755 × 752 native desktop window, the menu opened and closed, the layout remained readable, and the property table could be scrolled horizontally to its actions. This did not exercise the test plan's 375 px viewport.                                                           | Partial against the full F20 plan | Direct observation; open-menu capture: `agent-manual-deployed-narrow-navigation-2026-10-27.jpg`            |
| M01                 | Local and deployed    | Keyboard traversal exposed visible focus; the skip link became visible and Enter moved the URL target to `#main`. Dialog Escape and keyboard form traversal had also worked during the flow.                                                                                           | Pass                              | Direct observation                                                                                         |
| M02 (end state)     | Local and deployed    | At the end of the completed interactions, the DevTools Console drawer showed no entries. Preserve log was off, so this is an end-state observation rather than evidence for the complete navigation history.                                                                           | Pass for the observed end state   | End-state capture: `agent-manual-deployed-console-zero-messages-2026-10-27.jpg`                            |
| DEP01               | Deployed              | The completed functional smoke above was repeated on the Vercel origin, including property and repair mutations, validation, duplicate and linked-delete guards, reporting, refresh, narrow layout and keyboard focus. The unchecked storage-fault and human checks were not included. | Pass for the completed subset     | Five deployed captures listed below                                                                        |
| H01                 | Human accessibility   | No NVDA, VoiceOver or equivalent spoken-output session was performed. Accessibility-tree inspection is not a substitute.                                                                                                                                                               | Not run                           | —                                                                                                          |
| H02                 | Human accessibility   | Real Windows contrast mode was not enabled. Changing the OS setting through browser control required action-time user confirmation, so no result is claimed.                                                                                                                           | Not run                           | —                                                                                                          |
| H03                 | Compatibility         | No physical touch device was available; pointer input and a narrow desktop window are not touch evidence.                                                                                                                                                                              | Not run                           | —                                                                                                          |
| H04                 | Compatibility         | Firefox was not installed, Safari was unavailable on this Windows host, and no course requirement was supplied.                                                                                                                                                                        | Not run                           | —                                                                                                          |
| H05                 | Independent usability | No independent participant took part. Codex cannot be re-labelled as that participant.                                                                                                                                                                                                 | Not run                           | —                                                                                                          |

## Export details

- Local file: `%USERPROFILE%\Downloads\propertyflow-property-report.csv`, 518 bytes, opened in Excel.
- Deployed file: `%USERPROFILE%\Downloads\propertyflow-property-report (1).csv`, 522 bytes.
- Columns: `Address`, `Postcode`, `Bedrooms`, `Monthly rent GBP`, `Status`.
- Both files contained 9 property rows. The local first row was `77 Manual Test Way`; the deployed first row was `88 Deployment Smoke Lane`.

## Evidence handling

Only the following captures are retained for source control as evidence for this session. They are agent-operated native captures, not learner evidence:

- `docs/evidence/manual/agent-manual-deployed-overview-persisted-2026-10-27.jpg`
- `docs/evidence/manual/agent-manual-deployed-repair-completed-2026-10-27.jpg`
- `docs/evidence/manual/agent-manual-deployed-compliance-sorted-2026-10-27.jpg`
- `docs/evidence/manual/agent-manual-deployed-narrow-navigation-2026-10-27.jpg`
- `docs/evidence/manual/agent-manual-deployed-console-zero-messages-2026-10-27.jpg`

Initial browser captures that exposed unrelated bookmark or account labels were discarded rather than committed. The deployed replacements were recaptured with the bookmarks bar hidden and retained as native JPEG files. The Excel capture was also excluded from retained evidence because its application chrome showed a signed-in account avatar; the observed CSV content remains recorded without that image.

## Failures, fixes and bug log

| ID         | Observation                                                                                                                                                                                 | Classification                            | Decision or fix                                                                                   | Retest                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| NEG-01     | Deliberately invalid property and repair inputs displayed errors and refused submission.                                                                                                    | Expected negative-test result             | No application change required.                                                                   | Valid submissions then succeeded.             |
| HARNESS-01 | Some accessibility element positions became stale after table re-renders.                                                                                                                   | Browser-control harness limitation        | Refreshed the native state and used a fresh screenshot coordinate for the affected status button. | Every status transition was visibly verified. |
| EVID-01    | Initial screenshots included unrelated Chrome bookmark labels.                                                                                                                              | Evidence privacy issue, not an app defect | Hid the bookmarks bar, recaptured the retained deployed evidence and discarded the unsafe files.  | Retained captures contain no bookmark labels. |
| EVID-02    | The retained browser captures had `.png` filenames but JPEG/JFIF content.                                                                                                                   | Evidence file-format mismatch             | Renamed the five safe captures to `.jpg` without recompressing them and updated every reference.  | File signatures and extensions now agree.     |
| HARNESS-02 | After all requested browser tests, an attempted return to localhost for optional clean recapture was blocked because the control layer could not determine the destination URL confidently. | Browser-control safety stop after testing | Ended further UI actions; this did not alter any recorded result.                                 | Not applicable.                               |

No product defect was identified and no application source code was changed during this manual session.

## Validation results

- W3C HTML and CSS validators were not rerun during this manual session; current official evidence remains in `docs/evidence/official-validator-results.txt`.
- Repository checks completed on 28 October 2026: 24/24 Node tests and 14/14 Chrome browser workflows passed; ESLint, HTML validation, CSS validation, official W3C validation, Prettier, 188-link resolution, the static build and `git diff --check` passed. Browser artifacts from this documentation-only rerun were kept outside the repository.
- Keyboard/accessibility scope: native keyboard focus and skip-link operation passed; the human assistive-technology and OS-mode checks below remain outstanding.
- Deployment scope: the Vercel smoke was performed independently from the localhost origin and used its own sample-derived records.

## Outstanding issues

- Manually inject and record the combined empty, failed-data and malformed-storage scenarios if a separate manual result is required; current automated tests remain separate.
- Complete the fresh same-origin-tab step in F17 and the planned 375 px viewport step in F20 if full manual results for those test-plan rows are required. Existing automated coverage remains separate from this agent-operated manual record.
- A learner still needs to perform and record actual screen-reader speech and any learner-owned manual/usability review.
- Real OS contrast mode still needs an explicitly confirmed session and restoration to the user's original setting.
- A physical touch-device check and an independent participant session remain outstanding.
- Test Firefox or Safari only if the course, tutor or target-device plan requires it, recording the exact version and device.
- No known application defect was found in the completed 27 October 2026 agent-operated session.

## Blank learner or peer follow-up record

Use this section for a separate dated session. Do not copy the agent-operated outcomes above or pre-mark an item as passed.

- Test date:
- Tester:
- Browser/version:
- OS/device:
- Viewport(s):
- Local/deployed URL:
- Git commit hash:

| Test ID | Expected result | Actual result | Pass / fail / blocked | Evidence filename | Notes |
| ------- | --------------- | ------------- | --------------------- | ----------------- | ----- |
|         |                 |               |                       |                   |       |

Record any failure, fix and retest result here:

| Bug ID | Reproduction steps | Expected | Actual | Severity | Fix/decision | Retest result |
| ------ | ------------------ | -------- | ------ | -------- | ------------ | ------------- |
|        |                    |          |        |          |              |               |
