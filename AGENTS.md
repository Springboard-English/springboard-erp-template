All views are under src/views.

All views should reuse as much available components as possible, and prefer to alter the shared components before creating a view-specific solution.

All views should stay consistent with each other. Use ManagementClassDetails as the reference shape and interaction pattern.

Shared mobile behavior should be solved in shared components, not patched per view. Avoid horizontal scrolling for core detail or form content when a stacked mobile layout is possible.

Code base should be strieve to be explicit, and ask further questions when required. No guessing.

Both a build and a npx tsc should be used as verification after implementation.
