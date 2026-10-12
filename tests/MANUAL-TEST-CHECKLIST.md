# Manual test checklist

Use this checklist during your own test session. Tick an item only after completing it and record the result in `docs/TEST-RESULTS-TEMPLATE.md`.

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
