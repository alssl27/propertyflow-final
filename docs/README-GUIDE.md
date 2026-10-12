# Quick project guide

1. Run the app through VS Code Live Server, not by double-clicking `index.html`.
2. Use the left navigation to open Overview, Properties, Repairs, Compliance and Reports.
3. Add fictional properties using **Add property**. The form validates required fields and blocks duplicate address/postcode pairs.
4. Log a repair against a property, select a priority and advance its status with **Update status**.
5. Use the property search and status filter; export the current property register from Reports.
6. Data is stored in your browser's localStorage. To restore the starter sample data, open browser DevTools → Application/Storage → Local Storage, remove keys beginning `propertyflow.`, then reload.
7. Read the root README and the documents in `docs/` before using the project as assessment evidence.

**Privacy:** use fictional records only. This prototype has no login or server-side security.
