# Manual test checklist

Use this checklist during your own test session. Tick an item only after completing it and record the result in `docs/test-results-template.md`.

- [ ] Dashboard opens through Live Server.
- [ ] All navigation routes load and browser back/forward work.
- [ ] KPI values match the sample data.
- [ ] Search finds a known address.
- [ ] Search with no matches gives an empty state.
- [ ] Status filter and clear filters work.
- [ ] Valid property can be added.
- [ ] Invalid property form shows field-specific errors.
- [ ] Duplicate property is blocked.
- [ ] Property status update changes dashboard figures.
- [ ] Delete is blocked when a repair references the property.
- [ ] Valid repair can be logged.
- [ ] Invalid repair form is blocked.
- [ ] Repair status can be advanced to complete.
- [ ] Compliance register is sorted by date.
- [ ] CSV file downloads and opens with expected columns.
- [ ] Changes persist after refresh.
- [ ] Empty/failed data and malformed storage scenarios are handled.
- [ ] Narrow mobile viewport remains usable.
- [ ] Keyboard-only navigation and visible focus work.
- [ ] No uncaught console errors after the above actions.
- [ ] Deployed version passes the same smoke tests.

## Human accessibility and compatibility

- [ ] Use NVDA, VoiceOver or an equivalent screen reader and record the actual spoken output for navigation, form labels, validation errors and dialog closing.
- [ ] Enable the operating system's real high-contrast/contrast mode and check all six routes, focus indicators, status text and form errors.
- [ ] Use a physical touch device and check navigation, scrolling tables, dialogs, fields and all primary controls.
- [ ] Test Firefox and/or Safari if your course, tutor or target-device plan requires them; record the exact browser and device version.
- [ ] Ask an independent participant to complete agreed tasks and record their actual observations without collecting unnecessary personal data.

Do not turn the existing automated, emulated or agent-operated evidence into learner results. Put dated observations, failures, fixes and evidence filenames in `docs/test-results-template.md`.
