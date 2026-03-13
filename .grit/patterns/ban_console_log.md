---
title: No console.log
level: error
tags: [quality]
---

# No console.log

Use `console.error` or `console.warn` for legitimate output. Remove debug logging.

```grit
language js

`console.log($args)` => .
```
