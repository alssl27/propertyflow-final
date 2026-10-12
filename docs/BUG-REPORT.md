# Bug report — 12 October 2026

Environment: Windows, local Chrome at http://127.0.0.1:4173. Initial defects below came from source inspection unless a browser failure is stated. Initial automated failures are retained in evidence/browser-initial-results.json.

| Bug   | Reproduction / expected                                 | Observed                                              | Fix                                                              | Retest evidence                   |
| ----- | ------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------- |
| B-001 | Open Overview; graphics must match data                 | Invented trend and fixed ring segments                | Current status bars and calculated ring                          | B07 screenshots; D01              |
| B-002 | Dates cross today/30-day threshold; status must update  | Static JSON statuses                                  | Calendar-day status calculation during render                    | D05; B03                          |
| B-003 | Delete property with certificate only; record must stay | Guard checked repairs only                            | Validate linked repairs and certificates inside atomic operation | A06; B02                          |
| B-004 | Overlap first-run fetch and multiple writes; retain all | Read/modify/write race could lose data                | Global queue, Web Locks and one snapshot write                   | A01/A12; B09                      |
| B-005 | Reset with failed fetch; preserve edits                 | Removed keys before loading replacement               | Fetch/validate before atomic setItem                             | A03                               |
| B-006 | Load damaged saved object; display recovery             | Only JSON parsing checked                             | Full schema and foreign-key checks; reset in Settings            | A04/A10; D08; B05                 |
| B-007 | Double form events; one record                          | Submit button disable lacked event guard              | Explicit form busy guard and API duplicate check                 | A07; B08                          |
| B-008 | Refresh fails; no success claim                         | Success toast followed caught failure                 | Boolean load result and request sequence                         | B05; source review                |
| B-009 | Empty reports; all bars zero                            | Maintenance bar was 100%                              | Zero-safe calculation                                            | D01; B06                          |
| B-010 | Visit nested missing path; return works                 | Relative timed redirect resolves under invalid path   | Root-hosted 404 with explicit return link, no timer              | B06; cloud outstanding            |
| B-011 | Tab at last dialog control; focus remains inside        | Initial B04 failed                                    | Explicit first/last control wrapping                             | Final B04 passed                  |
| B-012 | Scan dashboard; labels/contrast valid                   | Initial B07 reported prohibited ARIA and low contrast | Semantic image role; darker bar/table text                       | Final B07 at all five widths      |
| B-013 | Hidden sidebar; keyboard skips it                       | Translated offscreen links stayed focusable           | inert plus visibility and responsive sync                        | B07; keyboard source review       |
| B-014 | CSV untrusted cell begins =; export as text             | Spreadsheet formula injection possible                | Prefix dangerous values; escape quotes/newlines                  | D07; B03                          |
| B-015 | Penny-valued rent remains precise                       | UI rounded all currency to whole pounds               | Two-decimal currency display                                     | D01; browser property workflow    |
| B-016 | Local tool audit should be clean                        | Stylelint dependency chain had 5 high advisories      | Replaced with CSS Tree; no forced downgrade                      | npm audit: zero after replacement |

No remaining known application logic errors in the automated scenarios. This does not cover untested browsers, assistive technology or deployment. Documented limits: local-only storage; no conflict UI for competing edits to one record; cross-tab lock fallback; UK-style postcode validation does not verify postal existence; no actual payment ledger or legal compliance engine. See FINAL-SUBMISSION-CHECKLIST.md for remaining evidence.

Tool configuration retest: Prettier normalises the case-insensitive HTML doctype to lowercase. html-validate now explicitly accepts lowercase doctype style; this resolves a formatter/checker disagreement without suppressing HTML validity checks.
