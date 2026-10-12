# Deployment — approved, awaiting account access

Status as of 12 October 2026: the user explicitly approved publication. A production deployment of the verified static release was attempted through the connected Vercel account, but Vercel returned HTTP 403: the integration does not have permission to create a project. No live URL or deployed-site test is claimed. VS Code was opened and its project window verified.

Read-only account inspection found the connected team `sarahcollins702-7360s-projects` and no matching PropertyFlow project. Proposed new project name: `propertyflow-final`. No project was created or changed.

## Selected platform and release

Vercel static hosting is selected because the application uses modules and relative JSON paths, needs no backend and can use a root-level custom 404. `vercel.json` sets framework to null, install to `npm ci`, build to `npm run build`, and output to `dist`. No environment variables are needed. `scripts/build.js` copies only index.html, 404.html, assets, data and the quick guide. Tests and assessment evidence are not public website assets. This is a copy step, not a JavaScript framework build.

[Vercel configuration reference](https://vercel.com/docs/project-configuration) and [custom error pages](https://vercel.com/docs/custom-error-pages) were consulted. Platform behaviour still requires verification on a real deployment.

## Account access blocker

The authorised target was the connected team `sarahcollins702-7360s-projects`. The integration rejected project creation. The supported CLI fallback reported that scope unavailable; read-only inspection found a different CLI login/team, `alssl27` / `alssl27s-projects`. No deployment was attempted into that different account. The user has been asked to select the intended owner or sign into the Sarah account. Publication permission persists once account access is resolved.

Release source: commit `03ed0f09753f3ae76f80ea5027189f9a1603ac21`; eleven files assembled by npm run build. Only the static website files were included in the attempted upload.

## Remaining publishing steps

1. Review FINAL-REPORT.md, screenshots and the local app. Resolve the Vercel account selection/access question and choose GitHub repository visibility if publishing a repository. Do not paste access tokens into chat.
2. If GitHub evidence is needed, create an empty repository in your account. Use `git remote add origin YOUR_CONFIRMED_REPOSITORY_URL`, then `git push -u origin master`. No force-push is needed; preserve existing remote history if the target is not empty.
3. Import the confirmed repository into Vercel as a new project, with the repository root as Root Directory and framework Other. The committed configuration supplies build and output settings. Do not enable an SPA catch-all rewrite.
4. Review the preview before production publication. Record the real URL, deployment ID, commit and account/team here.
5. Run the checks below on that URL. Store deployment results separately from local results; add the verified live/repository links to README.

## Deployment acceptance checks

- Homepage, CSS, three JavaScript modules, favicon and all three JSON files return successfully.
- All six hash routes work directly and with back/forward.
- Add/edit, search/filter, repair lifecycle, certificate dates, CSV, refresh and reset behave as locally.
- Changes persist after reload in the same browser and origin. A different preview URL has separate storage.
- Unknown nested paths return HTTP 404 with the custom page and working Return to Dashboard link.
- Missing JSON returns a failure, not index.html with a 200 rewrite. Failed startup has Retry.
- Browser console has no uncaught errors; mobile and keyboard checks pass.
- Compare the deployed assets with `dist` or the recorded Git commit.

PowerShell browser regression command after recording the real origin:

```powershell
$env:BASE_URL = 'https://YOUR-VERIFIED-DEPLOYMENT'
npm run test:browser
Remove-Item Env:BASE_URL
```

Before running, select a separate reporter filename for deployed evidence. Tests use fictional data and isolated browser contexts. If preview protection blocks automation, sign in through the intended account or make the preview accessible through approved platform controls; do not bypass authentication.

## Troubleshooting and rollback

Wrong output directory produces 404s: use dist. Opening with file:// blocks JSON fetch: use HTTP. Missing MIME types break modules: check Content-Type. Storage blocked/quota errors need browser permission or space, not a false success message. Root paths in 404.html are correct for a Vercel root-hosted site. A GitHub Pages project subpath needs its actual repository prefix in the 404 stylesheet and return URL before deployment; the root-hosted configuration is not claimed portable unchanged.

No timed redirect is used: the user controls when to leave and no redirect loop can occur. For rollback, redeploy a known-good commit or create a normal revert commit; never rewrite history. Browser data is independent of deployments, so do not reset it silently during rollback.
