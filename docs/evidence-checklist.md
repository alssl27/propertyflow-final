# Evidence checklist

Status reviewed 27 October 2026. The local images were captured by Playwright during the complete passing local rerun, and the separately labelled deployed images were regenerated during the final production regression on the same date. They are real implementation evidence for runtime commit `24fc3886903538ebdfb6d06f90a17dc372b0563a`; the test runner may show temporary fictional records.

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
| US07 settings/reset       | [Live Settings](evidence/deployed/settings-desktop.png)                                                                                              | B03 / B05                        | Captured 27 October   |
| Deployment                | [Live desktop](evidence/deployed/dashboard-1440.png), [live mobile](evidence/deployed/dashboard-320.png)                                             | 14 browser + 13 HTTP/hash checks | Captured and verified |
| Assistive technology      | Learner observation record needed                                                                                                                    | Manual checklist                 | Outstanding           |

- [x] Source-controlled real local screenshots and machine-readable browser results.
- [x] Original failed run retained separately for bug/retest evidence.
- [ ] Learner independently checks all screenshots against the implemented app.
- [x] Supplied Unit 2 criterion 3.3 reviewed: finished-project screenshots must align to user stories; the table above maps US01–US10 to genuine captures.
- [ ] Learner checks portal/tutor instructions and captures any additional screenshots they specifically require.
- [x] Deployed URL, commit, screenshots and results added after publishing and testing.
- [x] Final IndexedDB deployment recorded with fresh Chrome, Edge, preference, screenshot and HTTP/hash evidence.

The production capture set is separately stored in `evidence/deployed`; see [deployed test results](deployed-test-results.md) and the [course specification review](course-specification-review.md).

The Settings capture was regenerated on 27 October 2026 from the public production alias at 1440 × 1000 during B03. The page displayed the current IndexedDB transaction explanation and Reset demo data control; notifications were dismissed before capture so the view remained unobscured. B03 passed in the complete 14/14 production Chrome run and again in the isolated screenshot refresh. The screenshot was visually inspected for readable content and clipping. Reset and recovery behaviour is covered by B03/B05 rather than inferred from the image alone.

Extended captures: [Edge desktop](evidence/edge/dashboard-1440.png), [Edge 320px](evidence/edge/dashboard-320.png), [forced colours](evidence/accessibility/forced-colours-dashboard.png) and [described form errors](evidence/accessibility/forced-colours-form-error.png). See additional-verification.md for scope; these do not substitute for a screen-reader test.

Native UI captures: [200% overview](evidence/manual/zoom-200-dashboard.jpg), [400% search](evidence/manual/zoom-400-search.jpg) and [400% validation](evidence/manual/zoom-400-validation.jpg), documented in manual-accessibility-review.md. These are actual native browser zoom observations, not speech or participant feedback.
