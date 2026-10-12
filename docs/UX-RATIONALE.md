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

These measures are intended to support WCAG-aligned practice, but the project has not been independently certified as conformant. Keyboard, zoom, contrast and screen-reader checks must be performed and documented before submission.

## Visual system

- Deep navy sidebar provides a stable navigation anchor.
- White surfaces on a cool grey canvas distinguish content groups.
- Red is reserved for primary actions and urgent/problem cues; green, amber and blue status colours are paired with words.
- Typography uses a local Arial/Helvetica/sans-serif stack, removing the external font request.
- Spacing, borders, radius and button patterns are reused to reduce cognitive load.

## Deliberate exceptions and limitations

- The supplied illustrative financial trend was removed. Status bars and the compliance ring now reflect current records. No historical financial values are invented.
- The confirmation dialog for deletion uses the browser's native confirm prompt. It is simple and familiar, but a production version could use a custom accessible confirmation dialog for consistent styling.
- Data is stored locally in the browser and initial JSON fetching is asynchronous and storage operations are queued. This is suitable for demonstrating front-end behaviour, not multi-user property operations or confidential data.

## Validation still required

Run HTML and CSS validators, a JavaScript linter, keyboard-only checks, browser zoom checks, mobile viewport checks and manual screen-reader/assistive-technology checks. Record the results in the testing documents rather than assuming the design is accessible solely because these features are present.

## Verified revision

The 12 October 2026 automated browser run checked all six views at five widths and modal accessibility. See TEST-RESULTS.md for actual scope and remaining manual checks.
