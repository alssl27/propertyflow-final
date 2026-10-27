# Submission package and review route

Updated on 27 October 2026. This is a review package, not evidence that the assessment has been submitted or accepted. The supplied Unit 2 specification has been reviewed; the actual portal/tutor upload and declaration requirements still need checking.

## Start here

1. Open the [live application](https://propertyflow-final.vercel.app) and [public repository](https://github.com/alssl27/propertyflow-final).
2. Read the [final report](final-report.md) for the implementation and recorded verification scope.
3. Use the [criteria matrix](assessment-criteria-matrix.md) and [evidence checklist](evidence-checklist.md) to locate features, tests and genuine screenshots.
4. Practise the [demonstration walkthrough](demonstration-walkthrough.md), with the [learner handover](learner-handover.md) for code explanations.
5. Review the [assisted evaluation](project-evaluation.md), [AI disclosure](ai-assistance-disclosure.md) and [policy review](academic-integrity-review.md). Record your own review and verify the applicable assessment rules.
6. Complete the remaining items in the [final checklist](final-submission-checklist.md) before making an actual submission.

## Create the package

With Node and Git installed, use a clean, committed checkout:

```sh
npm run package:submission
```

The command prints the generated folder under `submission-artifacts/`. It creates:

- A ZIP containing the committed project under `propertyflow-final/`, including source, JSON, documentation, test configuration and actual evidence.
- `submission-manifest.json`, containing the exact commit, archive SHA-256, file count and SHA-256 of every committed file's bytes.
- `source-history.txt`, listing genuine commit identifiers, author dates and messages. The complete Git history remains in the linked repository.
- `SHA256SUMS.txt`, with hashes of the ZIP, manifest and history listing.

The package is generated with `git archive` from the recorded commit. The archive command explicitly sets `core.autocrlf=false` and `core.eol=lf` for that invocation, preventing this machine's Windows line-ending conversion from changing the committed bytes. It does not change the user's Git settings. Uncommitted changes cause the command to stop. Ignored environments, Vercel account configuration, dependencies, build output and Git internals are not included. Generated packages are ignored by Git, formatting and Vercel uploads. No extra packaging dependency is installed.

Extract the ZIP before opening `propertyflow-final/` in VS Code. Run `npm start` and open http://127.0.0.1:4173; JSON fetching requires HTTP. To run development checks, first use `npm ci`, then the commands in the root README. The ZIP is a source package, rather than a copy of the production build, and has no credentials required to run the app.

On Windows, compare the ZIP hash with `SHA256SUMS.txt` using:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\propertyflow-submission-COMMIT.zip'
```

Replace `COMMIT` with the short identifier printed in the generated filename. Recreate a package after any later committed change; old packages retain their original source revision and evidence dates. Packaging does not rerun application tests or redeploy the website.

## Remaining evidence requiring the learner

The completed native Chrome zoom review is agent-operated evidence. Screen-reader speech, actual OS contrast mode, a physical touch device and any required Firefox/Safari checks remain unverified. Independent usability feedback, understanding and endorsement of the evaluation, portal/tutor-specific screenshot or file requirements, and assessment-specific AI permission cannot be established by packaging files. The supplied Unit 2 criterion 3.3 screenshot requirement is mapped in the [course specification review](course-specification-review.md) and [evidence checklist](evidence-checklist.md). The [manual checklist](../tests/manual-test-checklist.md) and [results template](test-results-template.md) are ready for actual observations.

No assessment portal upload, tutor message or personal declaration has been performed.
