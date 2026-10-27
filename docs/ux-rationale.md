# UX rationale and design decisions

## Audience and purpose

The primary user is a property manager or administrator who needs to switch between portfolio records, maintenance issues and compliance follow-up. The dashboard is designed for short, frequent operational visits rather than a long-form marketing experience.

## Hierarchy

1. **Overview metrics** provide scale and immediate context: registered properties, occupancy, vacancies and occupied rent roll.
2. **Attention items** highlight operational follow-up and link directly to the relevant view.
3. **Recent records and compliance snapshot** support scanning without navigating away.
4. **Quick actions** make common tasks available without requiring the user to remember where each form lives.

## Interaction principles

- Navigation uses familiar text labels and retains a visible active state.
- Add actions open a labelled dialog. Escape and the close/cancel controls allow users to leave without saving.
- Form errors appear beside the field, the invalid field is marked programmatically and focus moves to the first invalid field.
- Buttons show a busy state while asynchronous saves run, preventing repeat submission.
- Success and failure feedback is announced through an `aria-live` region. Notifications can be dismissed.
- Property deletion requires confirmation and is blocked when repair or certificate records still reference that property.
- Local search is debounced for 180 ms. A sequence token prevents obsolete scheduled work from updating a different route. There is no remote search API.

## Accessibility

The page includes a skip link, semantic header/navigation/main/footer landmarks, a page title, explicit form labels, keyboard focus styles, text-based status labels, live announcements and reduced-motion styling. The sidebar becomes a controlled overlay on small screens. Tables remain horizontally scrollable on narrow screens instead of collapsing data into ambiguous fragments.

These measures are intended to support WCAG-aligned practice, but the project has not been independently certified as conformant. Scripted keyboard checks, native Chrome 200%/400% zoom review and emulated forced-colour/reduced-motion checks are recorded. Screen-reader speech, an actual operating-system contrast mode, a physical touch device and independent participant usability still require genuine human observations.

## Visual system

- Deep navy sidebar provides a stable navigation anchor.
- White surfaces on a cool grey canvas distinguish content groups.
- Red is reserved for primary actions and urgent/problem cues; green, amber and blue status colours are paired with words.
- Typography uses a local Arial/Helvetica/sans-serif stack, removing the external font request.
- Spacing, borders, radius and button patterns are reused to reduce cognitive load.

## Deliberate exceptions and limitations

- The supplied illustrative financial trend was removed. Status bars and the compliance ring now reflect current records. No historical financial values are invented.
- The confirmation dialog for deletion uses the browser's native confirm prompt. It is simple and familiar, but a production version could use a custom accessible confirmation dialog for consistent styling.
- Data is stored locally in the browser. IndexedDB transactions are authoritative in supported browsers; a localStorage snapshot supports migration and change notifications, with a queued localStorage fallback where IndexedDB is unavailable. Initial JSON fetching is asynchronous. This is suitable for demonstrating front-end behaviour, not multi-user property operations or confidential data.

## Validation status

ESLint, html-validate, CSS Tree, the official W3C Nu HTML validator and the official W3C Jigsaw CSS validator have been run. Automated keyboard, responsive viewport, axe, native Chrome zoom and emulated preference checks are recorded in the testing documents. These do not replace the remaining human screen-reader, real OS contrast, physical touch-device and independent usability checks.

## Verified revision

The original 12 October 2026 browser run checked all six views at five widths and modal accessibility. The 26 October revision adds official-validator results and transactional browser persistence, with current retest scope recorded in test-results.md. Human checks remain separate.
