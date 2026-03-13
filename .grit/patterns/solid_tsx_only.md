---
title: JSX must be in .tsx files
level: error
tags: [quality, solid]
---

# JSX must be in .tsx files

Solid.js components that use JSX syntax must have a `.tsx` extension.

```grit
language js

or {
  `<$tag $attrs>$children</$tag>`,
  `<$tag $attrs />`
} where {
  $filename <: not includes ".tsx"
}
```
