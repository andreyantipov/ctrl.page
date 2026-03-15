---
title: No dependencies in package-level package.json
level: error
tags: [quality, monorepo]
---

# No dependencies in package-level package.json

All dependencies must be declared in the root `package.json`. Libs packages must have NO `dependencies` or `devDependencies` at all — workspace references are resolved via tsconfig paths.

```grit
language json

or {
  `"dependencies": { $deps }` where {
    $filename <: includes "packages/libs/"
  },
  `"devDependencies": { $deps }` where {
    $filename <: includes "packages/libs/"
  },
  `"dependencies": { $deps }` where {
    $filename <: includes "packages/",
    $filename <: not includes "packages/libs/",
    $filename <: not includes "packages/infra/ci",
    $deps <: not includes "workspace"
  },
  `"devDependencies": { $deps }` where {
    $filename <: includes "packages/",
    $filename <: not includes "packages/libs/",
    $filename <: not includes "packages/infra/ci"
  }
}
```
