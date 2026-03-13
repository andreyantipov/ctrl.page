---
title: No dependencies in package-level package.json
level: error
tags: [quality, monorepo]
---

# No dependencies in package-level package.json

All dependencies must be declared in the root `package.json`. Package-level `package.json` files may only contain `workspace:*` references for Turbo task ordering.

```grit
language json

or {
  `"dependencies": { $deps }` where {
    $filename <: includes "packages/",
    $deps <: not includes "workspace"
  },
  `"devDependencies": { $deps }` where {
    $filename <: includes "packages/"
  }
}
```
