import assert from 'node:assert/strict'
import { getTagDisplayName } from './tags.ts'

assert.equal(getTagDisplayName('dev-rel'), 'DevRel')
assert.equal(getTagDisplayName('devrel'), 'DevRel')
assert.equal(getTagDisplayName('Dev-Rel'), 'DevRel')
