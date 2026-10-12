# Deployment guide — static hosting

PropertyFlow is a static HTML/CSS/JavaScript project. It has no build command and no environment variables.

## Option A: GitHub Pages

1. Create a new GitHub repository, for example `propertyflow-dashboard`. Do not upload real property or tenant data.
2. In VS Code, open the extracted project folder and open Terminal → New Terminal.
3. Run `git init`, `git add .`, and `git commit -m "chore: create PropertyFlow project"`.
4. Create the GitHub repository and follow GitHub's instructions to add the remote and push the `main` branch.
5. In the repository, open **Settings → Pages**.
6. Choose **Deploy from a branch**, select `main` and the root folder `/`, then save.
7. Wait for GitHub Pages to publish and open the URL shown in Pages settings.
8. Test the published page. In particular, check that `data/properties.json`, `data/repairs.json` and `data/compliance.json` return successfully and that the dashboard loads.

Because the app uses relative paths, it is designed to work in a repository subpath. If the repository or hosting setup rewrites paths, inspect the Network tab and adjust paths in `assets/js/api.js` as required.

## Option B: Vercel

1. Push the project to GitHub.
2. Sign in to Vercel and import the repository.
3. Use the **Other** framework preset (or static site option if offered).
4. Leave the build command blank and the output directory as the project root. Do not add an npm install/build command because there is no package.json or build process.
5. Deploy and open the generated URL.
6. Test the home page, data fetches, interactions, CSV export and an invalid route.

## Post-deployment smoke test

- Dashboard loads without console errors.
- Network requests for all three JSON files return HTTP 200.
- Property and repair creation persist after a refresh in the same browser.
- Search, filters, modal validation, status changes and CSV export work.
- Direct navigation to an unknown URL shows a not-found page with a return link.
- Test on a mobile viewport and with keyboard navigation.
- Capture the deployed URL, date, commit hash, screenshots and test outcomes.

## Rollback

For GitHub Pages or Vercel, revert to the last known-good Git commit, commit the revert and redeploy. Record why the rollback was needed and retest the restored version. Browser localStorage is separate from code deployment, so test data may need to be cleared separately through browser DevTools.
