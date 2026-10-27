# UX wireframe — PropertyFlow

Retrospective wireframe, updated on 12 October 2026 after implementation. This is a reconstruction of the implemented hierarchy, not evidence of pre-development planning.

```text
┌──────────────────────┬─────────────────────────────────────────────────────────┐
│ PROPERTYFLOW         │ Workspace / Overview                  Date  Bell  User  │
│                      ├─────────────────────────────────────────────────────────┤
│ WORKSPACE            │ PORTFOLIO OVERVIEW                                      │
│ ▦ Overview           │ Portfolio at a glance             [Refresh] [+ Add]     │
│ ⌂ Properties         │                                                         │
│ ⌁ Repairs            │ [Total properties] [Occupied] [Vacant] [Monthly rent]   │
│ ✓ Compliance         │                                                         │
│ ▥ Reports            │ ┌──────────────────────────────┐ ┌────────────────────┐ │
│                      │ │ Portfolio performance        │ │ Needs attention    │ │
│                      │ │ Status bars + occupancy       │ │ Emergency repairs  │ │
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

- The sidebar gives persistent access to the six work areas including Settings.
- The top four metrics establish portfolio context before the user sees detailed tables.
- The attention panel sits next to performance so urgent operational tasks are not buried below analytics.
- Recent properties and quick actions support common workflows.
- Secondary pages reuse the same shell and table patterns to preserve consistency.

For assessment evidence, capture a screenshot of the implemented dashboard at desktop and mobile widths, then compare it with this wireframe and explain any differences.
