# PropertyFlow quick guide

1. Run `npm start` from the project, then open http://127.0.0.1:4173. Alternatively use VS Code Live Server. Do not open the HTML directly from disk.
2. Overview shows current portfolio metrics, urgent work, recent properties and quick actions.
3. Properties supports search, status filters, add, edit, cyclic status update and confirmed deletion. A linked repair or certificate blocks deletion; reassign it using Edit if appropriate.
4. Repairs supports logging, editing, priority/status filters and progression Open → Scheduled → In progress → Completed → Open. Reopening is deliberate; completion does not delete history.
5. Compliance supports adding/editing certificates, expiry sorting and status filtering. Dates are educational examples, not legal advice.
6. Reports exports current property records to CSV; figures show expected rent, not payments received.
7. Settings resets all fictional demo records after confirmation. Retry or reset can recover damaged storage. Reset replaces user changes.
8. Only use fictional records. Data stays in this browser/origin. There is no login or server. After another tab saves, close edits and refresh before continuing.
