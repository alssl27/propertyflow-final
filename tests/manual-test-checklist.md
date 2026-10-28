# Manual test checklist

> **Agent-operated session — 27 October 2026:** Checked items were directly completed by OpenAI Codex in native Chrome 156.0.8078.48 against the local Live Server and the deployed Vercel origin, starting from revision `7721883e53884fc7036abbcf43f08ecfd604a56a`. They are not learner results, screen-reader speech, independent-participant feedback or evidence of learner understanding. See `docs/test-results-template.md` for exact observations and evidence.

- [x] Dashboard opens through Live Server.
- [x] All navigation routes load and browser back/forward work.
- [x] KPI values match the sample data.
- [x] Search finds a known address.
- [x] Search with no matches gives an empty state.
- [x] Status filter and clear filters work.
- [x] Valid property can be added.
- [x] Invalid property form shows field-specific errors.
- [x] Duplicate property is blocked.
- [x] Property status update changes dashboard figures.
- [x] Delete is blocked when a repair references the property.
- [x] Valid repair can be logged.
- [x] Invalid repair form is blocked.
- [x] Repair status can be advanced to complete.
- [x] Compliance register is sorted by date.
- [x] CSV file downloads and opens with expected columns.
- [x] Changes persist after refresh.
- [ ] Empty/failed data and malformed storage scenarios are handled.
- [x] Narrow 755 × 752 native desktop window remains usable.
- [ ] Planned 375 px manual viewport remains usable.
- [x] Keyboard-only navigation and visible focus work.
- [x] End-state DevTools Console drawer showed no entries (Preserve log was off, so this does not evidence the full navigation history).
- [x] Deployed version passes the same completed functional smoke tests.

The deployed tick covers the completed functional subset above. It does not turn the partial F17 fresh-tab or F20 375 px steps into passes, and it does not include the unchecked storage-fault scenario or any human accessibility/compatibility item.

## Human accessibility and compatibility

- [ ] Use NVDA, VoiceOver or an equivalent screen reader and record the actual spoken output for navigation, form labels, validation errors and dialog closing.
- [ ] Enable the operating system's real high-contrast/contrast mode and check all six routes, focus indicators, status text and form errors.
- [ ] Use a physical touch device and check navigation, scrolling tables, dialogs, fields and all primary controls.
- [ ] Test Firefox and/or Safari if your course, tutor or target-device plan requires them; record the exact browser and device version.
- [ ] Ask an independent participant to complete agreed tasks and record their actual observations without collecting unnecessary personal data.

Do not turn the existing automated, emulated or agent-operated evidence into learner results. Put dated observations, failures, fixes and evidence filenames in `docs/test-results-template.md`.
