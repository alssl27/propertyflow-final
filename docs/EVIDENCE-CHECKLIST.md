# Evidence checklist

Local images and the original separately labelled deployed images were captured by Playwright on 12 October 2026. The additional Settings image was captured on 14 October 2026 as described below. They are real implementation evidence; the local set does not establish deployment on its own. The test runner may show temporary test records or notifications, which are fictional.

| Story                     | Screenshot                                                                                                                                           | Supporting test                  | Status                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------- |
| US01 portfolio summary    | [Desktop overview](evidence/dashboard-1440.png)                                                                                                      | B07 / D01                        | Captured              |
| US02/03 property register | [Properties](evidence/properties-desktop.png)                                                                                                        | B01                              | Captured              |
| US03/09 form design       | [Property dialog](evidence/property-dialog.png)                                                                                                      | B10 / B04                        | Captured              |
| US04 maintenance          | [Repairs](evidence/repairs-desktop.png)                                                                                                              | B02                              | Captured              |
| US05 certificates         | [Compliance](evidence/compliance-desktop.png)                                                                                                        | B03                              | Captured              |
| US06 reports              | [Reports](evidence/reports-desktop.png)                                                                                                              | B03 / D07                        | Captured              |
| US08 responsive           | [320px](evidence/dashboard-320.png), [375px](evidence/dashboard-375.png), [768px](evidence/dashboard-768.png), [1024px](evidence/dashboard-1024.png) | B07                              | Captured              |
| US10 recovery             | [Storage failure](evidence/storage-error.png)                                                                                                        | B05                              | Captured              |
| US07 settings/reset       | [Live Settings](evidence/deployed/settings-desktop.png)                                                                                              | B03 / B05; scoped capture below  | Captured 14 October   |
| Deployment                | [Live desktop](evidence/deployed/dashboard-1440.png), [live mobile](evidence/deployed/dashboard-320.png)                                             | 14 browser + 13 HTTP/hash checks | Captured and verified |
| Assistive technology      | Learner observation record needed                                                                                                                    | Manual checklist                 | Outstanding           |

- [x] Source-controlled real local screenshots and machine-readable browser results.
- [x] Original failed run retained separately for bug/retest evidence.
- [ ] Learner independently checks all screenshots against the implemented app.
- [ ] Learner records any course-specific screenshot requirements and captures additional evidence.
- [x] Deployed URL, commit, screenshots and results added after publishing and testing.

The production capture set is separately stored in evidence/deployed; see [deployed test results](DEPLOYED-TEST-RESULTS.md).

The Settings capture on 14 October 2026 at 08:26 UTC used installed Chrome 155.0.8059.40 with Playwright in a fresh isolated context at 1440 × 1000, targeting https://propertyflow-final.vercel.app/. Browser plugin not available. The page returned HTTP 200; selecting Settings changed the URL to `#settings`, set the title to `Settings | PropertyFlow` and displayed the workspace explanation and Reset demo data control. No page errors or console warnings/errors were observed. The screenshot was visually inspected for readable content and clipping. This was a scoped navigation and rendering observation: reset was not activated, the full suite was not rerun and no existing browser workspace was changed. B03/B05 reset and recovery results remain the separately dated 12 October evidence.

Extended captures: [Edge desktop](evidence/edge/dashboard-1440.png), [Edge 320px](evidence/edge/dashboard-320.png), [forced colours](evidence/accessibility/forced-colours-dashboard.png) and [described form errors](evidence/accessibility/forced-colours-form-error.png). See ADDITIONAL-VERIFICATION.md for scope; these do not substitute for a screen-reader test.

Native UI captures: [200% overview](evidence/manual/zoom-200-dashboard.jpg), [400% search](evidence/manual/zoom-400-search.jpg) and [400% validation](evidence/manual/zoom-400-validation.jpg), documented in MANUAL-ACCESSIBILITY-REVIEW.md. These are actual native browser zoom observations, not speech or participant feedback.
