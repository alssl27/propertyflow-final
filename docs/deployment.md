# Deployment — recorded live release

Production: [PropertyFlow](https://propertyflow-final.vercel.app). Published on 12 October 2026 to the account explicitly selected by the user, **alssl27**, team **alssl27s-projects**. Status READY, target production, project propertyflow-final (prj_9Gj6lEVAxzUbAZ3ual8kmilll2dn), deployment dpl_2yRE1N5Gcp4EtpWTmdLuBt6ZSRH1. Unique URL: [immutable deployment](https://propertyflow-final-8jc3nj4h0-alssl27s-projects.vercel.app). Build duration reported by inspect: 7 seconds. VS Code was opened and its PropertyFlow window confirmed.

Status reviewed 27 October 2026. The identity, hashes and test results below describe the recorded 12 October release. The newer local persistence revision uses IndexedDB transactions and official-validator fixes; it requires a fresh production deployment, browser rerun and HTTP/hash record before these release details can be applied to it.

## Platform, source and settings

Vercel static hosting suits this application: it needs no backend and serves HTML, CSS, modules, JSON and a root-level 404. vercel.json sets framework null (Other), install npm ci, build npm run build, output dist. The copy-only build publishes index.html, 404.html, assets, data and quick guide. No app secrets are required. .vercelignore excludes local environment files, node_modules, Git internals and test evidence from deployment uploads. The local link's .vercel directory and generated environment file are Git-ignored and were not published.

Source at upload: c3715fd9c8381d1356561635b6e204c153a5f80a. That commit adds separate test evidence/configuration; the runtime files remain as in fa4aa1177e2006a144c628593e6695d4ee257416, which was recorded in sourceCommit deployment metadata. SHA256 checks confirm deployed runtime/JSON/guide bytes match local dist. Later documentation/evidence commits do not change the deployed runtime.

[Vercel configuration reference](https://vercel.com/docs/project-configuration) and [custom error pages](https://vercel.com/docs/custom-error-pages) informed the setup. Actual platform behaviour is now verified in deployed-test-results.md.

## Actual publishing procedure

1. The user approved publication. An initial connected-account attempt returned HTTP 403 on project creation; its CLI fallback had a different account. The user explicitly selected alssl27 before any mutation in that account.
2. CLI read-only inspection listed the selected team's projects; no PropertyFlow project existed. `vercel project add propertyflow-final --scope alssl27s-projects` created a new project.
3. Explicit link selected propertyflow-final under that team. `vercel project inspect --non-interactive --scope alssl27s-projects` confirmed owner/project.
4. `vercel deploy --prod --yes --scope alssl27s-projects` uploaded the reviewed source. Remote npm ci and npm run build succeeded; the install audit reported zero vulnerabilities. Vercel assigned the production alias above.
5. CLI inspect confirmed READY. Fourteen browser tests and thirteen independent HTTP/hash checks passed on the production alias. Deployed evidence is kept separately from local results.

The executed CLI was Vercel 63.1.2 under local Node 26.10.0. Vercel built using Node 24.x and its remote CLI 62.7.0. The app itself has no runtime package dependencies.

## Repeat deployment and verification

From this linked workspace, inspect the intended owner/project first. Run normal local checks, commit changes, then deploy with the explicit scope. Read current CLI help before using new flags. Do not change another project's link or deployment by relying on a default team.

```powershell
npx --yes vercel@63.1.2 project inspect --non-interactive --scope alssl27s-projects
npm run validate:official
npx --yes vercel@63.1.2 deploy --prod --yes --scope alssl27s-projects
$env:BASE_URL = 'https://propertyflow-final.vercel.app'
node node_modules/@playwright/test/cli.js test --config playwright.deployed.config.js
Remove-Item Env:BASE_URL
```

## Verified acceptance and limitations

Homepage, stylesheet, modules, favicon, JSON and guide return appropriate HTTP200 responses and match the release. All six routes and history work. CRUD, filters, lifecycle, certificate dates, CSV, persistence and reset passed. The custom 404 is served for nested unknown paths with a working return link; missing JSON remains a 404 and the UI offers retry. No page-wide overflow was found at 320/375/768/1024/1440px. Automated keyboard and axe checks passed in recorded scenarios.

IndexedDB and the compatibility localStorage mirror are per browser profile and origin; moving from localhost to the live origin starts a separate workspace. Production is public, while the unique/preview URL may require authentication. Do not disable deployment protection to test it; use approved authenticated access if needed. No drains or server-side app monitoring were configured for this static prototype; observed browser errors and response checks are recorded instead.

The public source repository [alssl27/propertyflow-final](https://github.com/alssl27/propertyflow-final) was verified and updated through approved normal fast-forward pushes. The Vercel production deployment was made through the CLI; automatic Git-to-Vercel deployment has not been connected or claimed. Additional Edge/preference/async checks are recorded in additional-verification.md.

## Troubleshooting and rollback

Wrong output directory produces missing pages: use dist. file:// blocks fetch: use HTTP. Missing module types require checking Content-Type. Storage errors require browser permission/space. Root paths in 404.html are correct for this Vercel site; a GitHub Pages subpath would need its actual prefix. The explicit Return to Dashboard link has no timed redirect or loop. To roll back, redeploy a verified prior commit or create a normal revert commit. Browser records are independent of deployed code and should not be reset silently.
