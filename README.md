# PropertyFlow — Interactive Property Management Dashboard

**Level 5 Diploma in Web Application Development · Unit 2: Interactive Front End Development**

PropertyFlow is an original front-end prototype for a small property management team. It brings a property register, repair workflow, compliance overview and portfolio reporting into one responsive workspace. The project is designed to demonstrate semantic HTML, custom CSS, JavaScript interaction, defensive input handling, asynchronous data access, accessible feedback, manual/automated test planning, Git workflow and static cloud deployment.

> **Important:** this is an educational demo, not a production property-management system. It uses fictional sample data and browser `localStorage`, with a simulated asynchronous data service. Do not enter real tenant, landlord, payment, identity or other confidential data. A production version would need an authenticated server, role-based access, audit logging, secure storage, backups and legal/compliance review.

## Run locally

1. Download and extract the project folder.
2. Open the `propertyflow-final` folder in Visual Studio Code.
3. Install the **Live Server** extension if it is not already installed.
4. Right-click `index.html` and choose **Open with Live Server**.
5. The browser should open the dashboard. Keep the local server running while using it.

Do not open `index.html` directly as a `file://` URL: the app uses `fetch()` to read JSON seed data, which requires a local or hosted web server.

No npm install or build step is required.

## Features

- Dashboard KPIs for property count, occupancy, vacant properties and occupied monthly rent roll.
- Property register with search, status filtering, duplicate detection, input validation, status updates and deletion guard when linked repairs exist.
- Repair log with property association, priority, status transitions and form validation.
- Compliance register with due-date ordering and clear sample-data caveats.
- Portfolio report with dynamic status/priority bars and CSV export.
- Asynchronous reads using `fetch()`, `async`/`await`, `Promise.all()`, loading feedback and recoverable error UI.
- Simulated request latency, busy submit buttons, error handling and a sequence guard that prevents an older delayed search from replacing newer results.
- Browser persistence via `localStorage`.
- Responsive sidebar/navigation, keyboard focus indicators, skip link, semantic landmarks, labelled forms, accessible dialog labels, live status/toast announcements and reduced-motion support.
- Custom 404 page with a clear route back to the dashboard and timed redirect.

## User stories

1. **As a property manager,** I want an at-a-glance overview so I can identify vacancies, occupancy and operational priorities quickly.
2. **As a property manager,** I want to search and filter properties so I can find a record without scanning the full table.
3. **As an administrator,** I want to add a property with validation and confirmation so incomplete or duplicate data is less likely to enter the register.
4. **As a maintenance coordinator,** I want to log a repair against a property and set its priority so that the team can triage work.
5. **As a maintenance coordinator,** I want to advance repair statuses so I can track progress from open to complete.
6. **As a property manager,** I want compliance dates and statuses visible so that records needing review are easy to spot.
7. **As a manager,** I want to export the property list to CSV so that I can analyse a copy of the demo data.
8. **As a mobile user,** I want the navigation, tables and forms to remain usable on a small screen.
9. **As a keyboard or assistive-technology user,** I want labels, focus indicators, skip navigation and status announcements so I can operate the interface without relying only on a mouse or colour.

## Design rationale

- **Hierarchy:** portfolio metrics appear first, followed by attention items, recently added properties and quick actions. This prioritises decisions over decorative content.
- **Consistency:** a shared navy/red/neutral palette, spacing scale, status pills and button styles are reused across the dashboard and secondary views.
- **Recognition over recall:** navigation labels and counts remain visible; statuses use text labels rather than colour alone.
- **Feedback and user control:** actions have clear labels, forms validate before saving, save buttons show a busy state, and success/failure is announced. Destructive deletion requires confirmation.
- **Responsive layout:** CSS grid collapses at tablet/mobile breakpoints; wide data tables scroll horizontally rather than squeezing every column.
- **Reduced distraction:** no autoplay media or aggressive modal prompts. The trend graphic is explicitly labelled illustrative, rather than presented as real financial history.
- **Trade-off:** the dashboard uses a simulated rent trend because no genuine time-series dataset is provided. A production design should replace it with a correctly sourced chart or remove it.

See [`docs/UX-RATIONALE.md`](docs/UX-RATIONALE.md) and [`docs/UX-WIREFRAME.md`](docs/UX-WIREFRAME.md).

## Architecture and data flow

```text
index.html
  ├── assets/css/styles.css
  └── assets/js/app.js (views, events, validation, state)
        └── assets/js/api.js (async data access + localStorage)
              └── data/*.json (fictional initial records)
```

`getWorkspaceData()` loads the three collections concurrently using `Promise.all()`. Each collection is fetched from a JSON file on first run and then cached in localStorage. Create/update/delete operations persist to localStorage and are wrapped in asynchronous functions with a small demonstration delay. This makes loading and timing behaviour visible without requiring a server or paid service.

**Limitations:** the service is a mock API, not a real remote API. Browser storage is local to one browser/profile and can be cleared. It has no authentication, multi-user concurrency control, server-side validation, or cross-device synchronisation. The project demonstrates async patterns and defensive UI behaviour, but it does not claim to be a secure production backend.

## File structure

```text
propertyflow-final/
├── index.html
├── 404.html
├── README.md
├── .gitignore
├── assets/
│   ├── css/styles.css
│   ├── img/favicon.svg
│   └── js/
│       ├── api.js
│       └── app.js
├── data/
│   ├── properties.json
│   ├── repairs.json
│   └── compliance.json
├── docs/
│   ├── DEVELOPMENT-LOG.md
│   ├── DEPLOYMENT.md
│   ├── TEST-PLAN.md
│   ├── TEST-RESULTS-TEMPLATE.md
│   ├── UX-RATIONALE.md
│   ├── UX-WIREFRAME.md
│   └── SOURCES.md
└── tests/
    └── MANUAL-TEST-CHECKLIST.md
```

## Quality and testing

- Use the manual test plan in [`docs/TEST-PLAN.md`](docs/TEST-PLAN.md).
- Record the actual browser/device, date, expected result, actual result, pass/fail and evidence in [`docs/TEST-RESULTS-TEMPLATE.md`](docs/TEST-RESULTS-TEMPLATE.md).
- Validate HTML at <https://validator.w3.org/> and CSS at <https://jigsaw.w3.org/css-validator/>.
- Use a JavaScript linter such as ESLint or JSHint as part of your evidence. Do not claim a clean lint result until you have run it and fixed reported issues.
- Test with browser DevTools open; verify no uncaught console errors after each interaction.
- Capture screenshots aligned to user stories and include desktop plus narrow mobile viewport evidence.

See [`docs/TEST-PLAN.md`](docs/TEST-PLAN.md) for async and failure scenarios, including unavailable JSON data, empty results, duplicate submit prevention and out-of-order search responses.

## Version control

Make small, meaningful commits as each feature is implemented and tested. A suggested sequence is provided in [`docs/DEVELOPMENT-LOG.md`](docs/DEVELOPMENT-LOG.md). Do not make one giant final commit and do not claim commits you have not made. Keep screenshots and your own evidence in a clearly named folder/repository if your assessor requests them.

## Deployment

This is a static project and can be deployed to GitHub Pages or Vercel without a build command. Follow [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md), then test the deployed site independently. Check that JSON files load from the deployed paths and that the custom 404 page behaves as expected.

## Assessment mapping

| Assessment area | Project evidence |
|---|---|
| UX, accessibility, semantic layout | `index.html`, `styles.css`, `docs/UX-RATIONALE.md` |
| User-controlled interactions and feedback | `app.js`, forms, navigation, toasts |
| External CSS and JavaScript | `index.html` links to `assets/css/styles.css` and module `assets/js/app.js` |
| Loops, conditionals and validation | rendering functions, filters, form handlers |
| Asynchronous behaviour and timing | `assets/js/api.js`, `Promise.all()`, async handlers, search sequence guard |
| Defensive design/error feedback | storage/fetch checks, retry state, duplicate detection, validation, deletion guard |
| Testing and deployment | `docs/TEST-PLAN.md`, `docs/TEST-RESULTS-TEMPLATE.md`, `docs/DEPLOYMENT.md` |
| Git process and attribution | `docs/DEVELOPMENT-LOG.md`, `docs/SOURCES.md`, this README |

This mapping is a guide, not a guarantee of a grade. The learner should understand, test, document and be able to explain the code and submit genuine development evidence.
