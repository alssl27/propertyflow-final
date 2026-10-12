# Development log and suggested Git history

This file is a planning log. Replace or supplement the suggested entries with the commits you actually make. Never claim that a commit exists unless it is visible in your Git history.

## Suggested incremental commits

1. `chore: create project structure and sample data` — shell, directories and fictional JSON data.
2. `feat: build responsive workspace navigation` — sidebar, header, mobile navigation and active states.
3. `feat: add portfolio overview and KPI cards` — metric calculations and dashboard hierarchy.
4. `feat: add property register search and filters` — register, empty state and status filter.
5. `feat: add validated property creation` — accessible dialog, duplicate checks and save feedback.
6. `feat: add repair logging and status workflow` — repair association, priority and status changes.
7. `feat: add compliance register and portfolio reports` — due dates, summaries and CSV export.
8. `feat: add asynchronous data service` — fetch seed files, async operations, localStorage persistence.
9. `fix: guard asynchronous search result ordering` — debounce and sequence guard.
10. `fix: improve storage and form error feedback` — validation and recoverable errors.
11. `feat: add custom not-found page` — missing-route recovery.
12. `test: document functional and async test cases` — testing plans and evidence templates.
13. `docs: document UX rationale and architecture` — design rationale, limitations and source attribution.
14. `docs: add cloud deployment procedure` — deployment guide and final verification steps.

## Commit quality

- Make a commit after a small, coherent feature or fix has been tested.
- Use descriptive messages that explain the change, not vague messages such as `stuff` or `final`.
- Inspect `git status` and `git diff` before committing.
- Keep generated files and evidence organised.
- Save the commit hash in your test evidence so the assessor can link a result to a version.

## Development narrative to write in your own words

For each stage, record: the user story, the design/code decision, the issue or trade-off, how you tested it, what changed after feedback, and the commit that contains the change. Explain async data flow specifically: concurrent reads via `Promise.all`, loading/error states, disabled save buttons, and how the search sequence guard prevents stale results from winning a race.
