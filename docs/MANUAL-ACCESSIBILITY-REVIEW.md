# Native browser zoom and keyboard review

**Executed by OpenAI Codex through Windows Computer Use on 12 October 2026.** Live origin: [PropertyFlow](https://propertyflow-final.vercel.app). Chrome 155.0.8059.39, Windows. This records direct operation of the installed graphical browser, rather than CSS zoom or a simulated small viewport. It is an agent-operated review, not a learner's personal observation or independent participant feedback.

## Actual checks

| ID   | Expected                                         | Actual                                                                                                                                                                     | Result |
| ---- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| MZ01 | Chrome native zoom reaches 200%                  | Native menu and accessibility tree reported Zoom: 200%.                                                                                                                    | Passed |
| MZ02 | Overview reflows at 200%                         | Heading, metrics, Refresh and Add property remained visible; navigation used the mobile disclosure.                                                                        | Passed |
| MZ03 | 200% property dialog can be read and dismissed   | Dialog labels were exposed; its scrollbar reached rent/status and Save/Cancel; Cancel closed the form.                                                                     | Passed |
| MZ04 | Chrome native zoom reaches 400%                  | Native accessibility tree reported Zoom: 400%, using browser zoom controls, not CSS zoom or a smaller emulated viewport.                                                   | Passed |
| MZ05 | 400% navigation can be used with keyboard        | Opened menu; Tab showed Overview then Properties with visible focus and scrolling; Enter opened Properties.                                                                | Passed |
| MZ06 | Search/filter controls remain usable at 400%     | Scrolled to search, typed Abbeyhills, observed Showing 1 of 8 properties; Clear filters restored Showing 8 of 8.                                                           | Passed |
| MZ07 | 400% form fields/actions stay keyboard reachable | Tab traversed postcode, bedrooms, rent, occupancy, Cancel and Save, scrolling focused controls into view. Empty Save returned focus to address and displayed a text error. | Passed |
| MZ08 | Dialog dismissal and browser restoration work    | Escape closed the invalid form; focus returned to Add property. Browser exited fullscreen and its native zoom alert showed 100%.                                           | Passed |

Browser rendering and accessibility-tree updates sometimes settled after the initial capture; a fresh observation verified the final state. The first attempt to click the 400% search control identified it below the viewport. Normal page scrolling exposed it before interaction, which succeeded. This was an off-screen automation target, not a hidden or missing application control. Enlarged menus and dialogs require vertical scrolling; keyboard focus also scrolls form controls into view. No page-wide horizontal scrollbar was visually observed in the recorded layouts; detailed data tables retain their intentional local scrolling.

## Real evidence

- [200% overview](evidence/manual/zoom-200-dashboard.jpg)
- [200% dialog actions](evidence/manual/zoom-200-dialog.jpg)
- [400% properties heading](evidence/manual/zoom-400-properties.jpg)
- [400% working search](evidence/manual/zoom-400-search.jpg)
- [400% keyboard action focus](evidence/manual/zoom-400-dialog-actions.jpg)
- [400% validation and first-field focus](evidence/manual/zoom-400-validation.jpg)
- [Machine-readable results](evidence/manual/results.json), [200% observation](evidence/manual/zoom-200-observation.txt) and [400% observation](evidence/manual/zoom-400-observation.txt)

The native Chrome UI visibly confirmed each required zoom percentage before the page captures. Screenshots were then taken in browser fullscreen to exclude unrelated account/bookmark/browser chrome. That removes the browser toolbar from the images; the percentage is separately recorded in the observation notes. Native screenshot bytes were saved unchanged. Fullscreen was exited and browser zoom restored to 100% afterwards. No record was created, edited or deleted by this review.

## Remaining assistive-technology limits

Windows Narrator was detected on this computer; NVDA was not found in the usual inspected installation paths. No screen-reader speech session was performed or marked passed. The available Computer Use interface returns window state, screenshots and accessibility text, not Narrator audio. Accessible names exposed through Windows are useful evidence but do not establish what a screen reader speaks or whether a blind user can complete a task.

Prior forced-colour/reduced-motion emulation is recorded in ADDITIONAL-VERIFICATION.md. Actual Windows contrast-mode operation and a physical touch-device review remain unperformed. Chrome and Edge were tested; Firefox/Safari remain outside the recorded browser matrix. This review covers the named core journeys at both zoom levels, not every combination of route/form/state or full WCAG conformance.

## Prepared learner materials

[Project evaluation](PROJECT-EVALUATION.md), [AI-assistance disclosure](AI-ASSISTANCE-DISCLOSURE.md) and [academic-integrity review](ACADEMIC-INTEGRITY-REVIEW.md) are prepared for the learner. They describe verified work without inventing a personal learning experience. Applicable assessment-specific AI permission still needs confirmation; the public sources do not establish it. No institution was contacted and no assessment was submitted.
