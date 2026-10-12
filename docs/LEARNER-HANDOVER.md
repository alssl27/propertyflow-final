# Learner handover

## How the project works

PropertyFlow is a browser application with fictional records. It does not have a production API, login or database server. index.html provides the persistent page shell: sidebar navigation, header, main area, footer and three native dialogs. The main area is replaced when the selected hash route changes. The URL fragment, such as #repairs, lets browser Back and Forward select views without asking the server for a different HTML file.

The external CSS defines reusable colours, font stacks, spacing, borders, shadows, cards, tables and controls. Media queries change the sidebar and grids on smaller screens. Wide tables scroll inside their own regions. A prefers-reduced-motion query removes unnecessary animation. Text labels explain status without relying on colour.

## Modules and rendering

`app.js` coordinates events, state and rendering. State is a JavaScript object containing property, repair and compliance arrays, plus route and filter values. Rendering functions return HTML strings. User-provided values are escaped before being inserted into HTML. `metrics()` in `domain.js` calculates portfolio values; the dashboard uses those values to create cards and bars. An empty array produces zero occupancy, avoiding division by zero.

`domain.js` contains pure rules: calculations, search, dates, duplicate identity, validation, status transitions and CSV encoding. Pure functions are easier to test because the same input gives the same output without needing a page. `api.js` is the persistence boundary: it validates whole workspaces, fetches starter data and saves snapshots.

## Events, forms and records

Click handlers use data-action and data-route attributes to decide what the user requested. Main uses event delegation: one listener handles buttons created by later renders. A form submit handler prevents the browser's default page submission, reads FormData, checks inputs and focuses the first error. Each field error has an ID connected by aria-describedby. The form has a busy flag as well as a disabled submit button; two submit events cannot create two records.

Property editing reuses the add dialog with the existing ID. Addresses/postcodes are normalised for duplicate detection. Rent must be finite, positive and within the demo limit. Postcode validation checks a UK-style pattern, not whether an address exists. Repairs and certificates store propertyId. The API rejects missing references. Property deletion is blocked whenever a repair or certificate still points to it, even when a repair is completed. Reassign linked records through Edit if a deletion is appropriate. Repairs follow Open → Scheduled → In progress → Completed → Open. The final step deliberately reopens work.

## localStorage and safe saves

localStorage stores strings for a browser profile and origin. JSON.stringify converts the workspace object into a string; JSON.parse reads it back. The v2 workspace uses one key so all three collections can be replaced together with one setItem call. If a write fails, the UI does not apply an optimistic success. Old v1 keys remain as a migration backup but are no longer the active workspace after migration.

Storage is not a secure server or backup. Clearing browser data loses edits. A different origin or device has different data. Users should close a dirty form and refresh after another tab reports a change; there is no field-level merge-conflict screen.

## Fetch, promises and async/await

Fetch makes an actual HTTP request for a JSON file when starter data is needed. It returns a Promise: a value representing work that may finish later. A response with HTTP 404 is not automatically a rejected fetch, so the code checks response.ok. Reading response.json() is also asynchronous and can fail when JSON is malformed.

An async function returns a Promise. `await` pauses that function until the Promise settles, allowing the browser to remain responsive. It does not make unrelated code wait. A try/catch converts rejected work into a readable error. Promise.all starts the three seed requests together and produces results in the input order, even if they finish in a different order. If one fails, the shared AbortController cancels the remaining fetch work. A 15-second timer aborts stalled seed loading, and finally clears the timer.

There is no artificial network delay in the final service. Tests deliberately delay or fail requests. Search uses a 180 ms local debounce timer; it is not a remote search request.

## Race conditions

A race condition occurs when the result depends on timing between operations sharing data. Suppose two operations both read eight properties, add a different ninth property, then save. The later save could discard the other new property. The service queues complete read/modify/write operations. The next operation reads the result of the previous successful save. A rejected operation is caught on the queue chain so later work can still run.

Web Locks extend coordination to cooperating tabs in supported browsers. The fallback queue protects only this tab. Arbitrary external code that ignores the lock is not coordinated. An atomic snapshot prevents partial multi-collection resets; it does not turn localStorage into a multi-user database.

The UI also tracks a load sequence. Only the most recent requested load may update the visible workspace. Search increments a sequence when the query changes or navigation occurs, so obsolete scheduled work cannot repaint another view. Reset fetches and validates replacement records before saving; network failure preserves existing records.

## Testing and Git

Run npm test for business/service tests. Run npm run test:browser for real Chrome workflows, screenshots and axe scans. Lint and validators inspect source; they do not replace interacting with the page. Follow TESTING-METHODOLOGY.md and TEST-RESULTS.md to understand which checks actually ran. Human screen-reader, zoom and usability checks remain required.

Git records snapshots and messages. `git log --oneline` shows genuine commits made during this revision. The first commit preserves the supplied project; it does not imply earlier work was version-controlled. Commits use the clearly named PropertyFlow project identity, not an invented learner identity. Set your own Git name/email before your future commits. The existing public alssl27/propertyflow-final repository was subsequently verified and updated after explicit approval; git log and the remote show the genuine source history.

## Cloud deployment

The build copies website files into dist. Vercel can serve these static files after an approved publication. It does not create a database: browser storage remains local. Cloud evidence needs the actual URL, commit and repeated tests; a local screenshot does not prove deployment. Follow DEPLOYMENT.md after approval.

## Assessor practice questions

| Question                                               | Explanation-based study answer                                                                                                                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why is this useful beyond a spreadsheet?               | It connects properties, repairs and certificates with IDs, derives summaries consistently, validates edits and highlights exceptions in one workflow. Explain a concrete user journey.                        |
| Why use vanilla JavaScript?                            | The unit assesses custom front-end interaction. Modules separate concerns without adding a framework or runtime dependencies.                                                                                 |
| What does Promise.all guarantee?                       | Results correspond to input order; all must resolve for success. It does not guarantee completion order or automatically cancel other work after rejection. This project explicitly aborts remaining fetches. |
| Is localStorage asynchronous?                          | Its calls are synchronous. The service returns Promises because loading and lock acquisition are asynchronous and writes are queued. Distinguish the two.                                                     |
| Why is a disabled button not enough?                   | A submit can also be triggered by keyboard or script. A handler-level busy flag and API checks give a second defence.                                                                                         |
| Why not copy the entire state before awaiting a write? | A stale copy could overwrite newer work. The lock wraps reading, validation and persistence together.                                                                                                         |
| How are compliance dates calculated?                   | Valid calendar dates are compared with today's calendar day; before today is overdue, today through day 30 is due soon. This is a workflow rule, not legal advice.                                            |
| How did testing change the app?                        | The initial browser run found contrast, ARIA and dialog focus failures. Explain B-011/B-012 and compare initial and final reports.                                                                            |
| Why does the 404 not redirect automatically?           | An explicit return link gives control and works without JavaScript; absolute paths fit the selected root-hosted deployment.                                                                                   |
| What does an axe pass establish?                       | No violations of the enabled automated rules in those tested states; it does not prove full WCAG compliance or screen-reader usability.                                                                       |
| What would a production version need?                  | Authentication, authorised server writes, durable database transactions, privacy controls, backups, conflict handling and independently reviewed compliance rules.                                            |

## Your own evidence and reflection

Read and explain the modules yourself. Demonstrate one valid entry, one rejected entry, a persistent edit, a linked deletion guard, a failed fetch with retry, and a date-boundary test. Run the manual checklist with your actual browser/assistive technology. Check your institution's AI-assistance rules, accurately disclose this revision, and write your own design reflection and learning account. Do not present generated explanations, retrospective wireframes or project-identity commits as unaided personal work or historical evidence. No grade is guaranteed.
