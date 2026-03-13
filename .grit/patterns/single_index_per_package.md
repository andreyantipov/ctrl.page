---
title: Single index.ts per package
level: error
tags: [quality, monorepo]
---

# Single index.ts per package

Each package should have exactly one `index.ts` at `src/index.ts`. Nested `index.ts` barrel files are not allowed.

```grit
language js

file($name, $body) where {
  $name <: includes "packages/libs/",
  $name <: includes "/index.ts",
  $name <: not includes "node_modules",
  $name <: not includes "/build/",
  $name <: not includes r"/src/index\.ts$"
}
```
