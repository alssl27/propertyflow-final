# Deployment — current verified production release

Status reviewed 27 October 2026. Production: [PropertyFlow](https://propertyflow-final.vercel.app). Account/team: **alssl27 / alssl27s-projects**. Project: `propertyflow-final` (`prj_9Gj6lEVAxzUbAZ3ual8kmilll2dn`). Current deployment: `dpl_B95Rkz7gbkQsTQ11CvGysciNjDuC`, target production, READY. Upload/runtime commit: `24fc3886903538ebdfb6d06f90a17dc372b0563a`. CLI inspect reported a 6-second build.

The [immutable deployment URL](https://propertyflow-final-fr19uiyjx-alssl27s-projects.vercel.app) retains Vercel Authentication. Protection was not disabled. CLI inspection linked that URL, deployment ID and public production alias. Public browser and exact-byte checks therefore used the production alias.

## Platform, source and settings

Vercel static hosting suits this application: it needs no backend and serves HTML, CSS, modules, JSON and a root-level 404. `vercel.json` sets framework null (Other), install `npm ci`, build `npm run build` and output `dist`. The clean copy-only build removes any old `dist`, then publishes `index.html`, `404.html`, `assets`, `data` and the lowercase quick-guide path. No app secrets are required. `.vercelignore` excludes local environment files, dependencies, Git internals and assessment evidence from uploads.

The 27 October CLI upload used committed revision `24fc388`. Remote `npm ci` and `npm run build` succeeded, and CLI inspect reported READY. Thirteen read-only HTTP/status/header/hash checks confirmed the live HTML, CSS, modules, favicon, JSON and guide matched local `dist` exactly. The nested missing path and missing JSON both returned the custom 404 bytes. The configured `nosniff` header was present on checked asset responses.

The later finalisation changes update tests, documentation and retained evidence only; they do not change the deployed HTML, CSS, JavaScript, JSON, images or Vercel configuration. Commit `24fc388` therefore remains the precise runtime source for this deployment even when the repository's documentation head advances.

[Vercel configuration reference](https://vercel.com/docs/project-configuration) and [custom error pages](https://vercel.com/docs/custom-error-pages) informed the setup. Actual runtime results are in [deployed test results](deployed-test-results.md).

## Actual publishing procedure

1. The user had already approved Vercel publication and explicitly selected `alssl27` after an earlier connected-account permission failure.
2. From this linked workspace, `vercel project inspect --non-interactive --scope alssl27s-projects` reconfirmed the intended owner and project before mutation.
3. Local tests, validators, formatting, links, the clean static build and dependency audit passed. Revision `24fc388` was committed before upload.
4. `vercel deploy --prod --yes --scope alssl27s-projects` built and published the revision, assigning the deployment ID and URLs above.
5. CLI inspect tied the READY deployment to both aliases. The clean committed tree then passed the 13 exact-byte checks before browser evidence changed the worktree.
6. The public production alias passed the full Chrome and Edge suites, **14/14 each**, plus **5/5** emulated preference/accessibility checks. New screenshots and machine-readable reports replaced the earlier release evidence in their named folders.

The executed local CLI was Vercel 63.1.2 under Node 26.10.0; the remote build reported Vercel CLI 65.1.0 and Node 24.x. The app has no runtime package dependencies.

## Repeat deployment and verification

Inspect the intended owner/project first. Run checks and create a clean commit before deployment. The exact-byte command intentionally refuses a dirty tree, so run it immediately after build/deployment inspection and before Playwright rewrites tracked evidence files. `DEPLOYMENT_ID` is the label copied from the separately retained CLI inspection; the script proves the checked origin's bytes, status codes and configured asset headers.

```powershell
npx --yes vercel@63.1.2 project inspect --non-interactive --scope alssl27s-projects
npm run validate:official
npx --yes vercel@63.1.2 deploy --prod --yes --scope alssl27s-projects
npx --yes vercel@63.1.2 inspect DEPLOYMENT_HOST --scope alssl27s-projects
$env:DEPLOYMENT_URL = 'https://propertyflow-final.vercel.app'
$env:DEPLOYMENT_ID = 'dpl_B95Rkz7gbkQsTQ11CvGysciNjDuC'
npm run verify:deployment
Remove-Item Env:DEPLOYMENT_URL
Remove-Item Env:DEPLOYMENT_ID
$env:BASE_URL = 'https://propertyflow-final.vercel.app'
npm run test:deployed
npm run test:edge
npm run test:accessibility
Remove-Item Env:BASE_URL
```

Replace the example ID and inspected host after a later deployment. Do not disable deployment protection; use Vercel's authenticated inspection/curl path when the unique URL must be queried directly.

## Verified acceptance and limitations

Homepage, stylesheet, modules, favicon, JSON and guide return the expected responses and match the release. All six routes and history work. CRUD, filters, lifecycle, certificate dates, CSV, IndexedDB persistence, recovery and reset passed. B09 deliberately disables Web Locks while testing 20 two-tab write pairs, isolating the IndexedDB transaction guarantee. The custom 404 is served for nested unknown paths with a working return link; missing JSON remains a 404. No page-wide overflow or enabled axe violation was found in the scripted states at 320/375/768/1024/1440px.

IndexedDB and the compatibility `localStorage` mirror are per browser profile and origin; moving between localhost and production starts a separate workspace. The unique deployment URL is protected, while the production alias is public. Static production has no application server logs or multi-user database. Screen-reader speech, actual OS contrast mode, a physical touch device, any required Firefox/Safari check and independent learner usability remain unverified.

The public source repository [alssl27/propertyflow-final](https://github.com/alssl27/propertyflow-final) is updated through approved normal fast-forward pushes; no force-push or history rewrite is claimed. The deployment used the CLI; automatic Git-to-Vercel deployment has not been connected or claimed.

## Troubleshooting and rollback

Wrong output directory produces missing pages: use `dist`. Opening with `file://` blocks fetch: use HTTP. Missing module types require checking `Content-Type`. Storage errors require browser permission/space. Root paths in `404.html` are correct for this Vercel site; a GitHub Pages subpath would need its actual prefix. To roll back, redeploy a verified prior commit or create a normal revert commit. Browser records are independent of deployed code and should not be reset silently.
