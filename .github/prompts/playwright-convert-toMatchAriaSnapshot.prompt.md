---
description: 'convert parts of test to use toMatchAriaSnapshot'
---

use `toMatchAriaSnapshot` instead of `toBeVisible()` for visibility checks when 2 or more elements are involved.

For paragraphs of text don't add big chunks of text to the snapshot as this will make the snapshot too large and hard to read and the text of the paragraph is not important for the snapshot.
