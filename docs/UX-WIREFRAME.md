# UX wireframe — PropertyFlow

This low-fidelity wireframe documents the information hierarchy that the implementation follows. It is a planning artefact, not a screenshot of the final interface.

```text
┌──────────────────────┬─────────────────────────────────────────────────────────┐
│ PROPERTYFLOW         │ Workspace / Overview                  Date  Bell  User  │
│                      ├─────────────────────────────────────────────────────────┤
│ WORKSPACE            │ PORTFOLIO OVERVIEW                                      │
│ ▦ Overview           │ Good afternoon, Sarah             [Refresh] [+ Add]     │
│ ⌂ Properties         │                                                         │
│ ⌁ Repairs            │ [Total properties] [Occupied] [Vacant] [Monthly rent]   │
│ ✓ Compliance         │                                                         │
│ ▥ Reports            │ ┌──────────────────────────────┐ ┌────────────────────┐ │
│                      │ │ Portfolio performance        │ │ Needs attention    │ │
│                      │ │ Rent trend + occupancy       │ │ Emergency repairs  │ │
│                      │ │                              │ │ Compliance due     │ │
│                      │ └──────────────────────────────┘ │ Vacant properties  │ │
│                      │                                 └────────────────────┘ │
│                      │ ┌─────────────────────────────────────────────────────┐ │
│                      │ │ Recently added properties                           │ │
│                      │ │ Address | Bedrooms | Rent | Status                  │ │
│                      │ └─────────────────────────────────────────────────────┘ │
│ Help and profile     │ [Compliance snapshot]              [Quick actions]      │
└──────────────────────┴─────────────────────────────────────────────────────────┘
```

## Design decisions

- The sidebar gives persistent access to the five key work areas.
- The top four metrics establish portfolio context before the user sees detailed tables.
- The attention panel sits next to performance so urgent operational tasks are not buried below analytics.
- Recent properties and quick actions support common workflows.
- Secondary pages reuse the same shell and table patterns to preserve consistency.

For assessment evidence, capture a screenshot of the implemented dashboard at desktop and mobile widths, then compare it with this wireframe and explain any differences.
