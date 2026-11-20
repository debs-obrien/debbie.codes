import { describe, expect, it } from 'vitest'
import { assigneeProfile, isAssignedToEngineer } from '../lib/is-assigned-to-engineer'

describe('assigneeProfile', () => {
  it('returns the profile after the last +', () => {
    expect(assigneeProfile('local:user:julian+engineer')).toBe('engineer')
  })

  it('returns null for null or undefined', () => {
    expect(assigneeProfile(null)).toBeNull()
    expect(assigneeProfile(undefined)).toBeNull()
  })
})

describe('isAssignedToEngineer', () => {
  it('accepts task.assigned to engineer', () => {
    expect(
      isAssignedToEngineer({
        type: 'task.assigned',
        payload: { for: 'local:user:debbie+engineer' },
      }),
    ).toBe(true)
  })

  it('rejects assignment to qa', () => {
    expect(
      isAssignedToEngineer({
        type: 'task.assigned',
        payload: { for: 'local:user:debbie+qa' },
      }),
    ).toBe(false)
  })

  it('rejects assignment to designer', () => {
    expect(
      isAssignedToEngineer({
        type: 'task.assigned',
        payload: { for: 'local:user:debbie+designer' },
      }),
    ).toBe(false)
  })

  it('rejects unassignment (for: null)', () => {
    expect(
      isAssignedToEngineer({
        type: 'task.assigned',
        payload: { for: null },
      }),
    ).toBe(false)
  })

  it('rejects non-assignment events', () => {
    expect(
      isAssignedToEngineer({
        type: 'task.created',
        payload: { for: 'local:user:debbie+engineer' },
      }),
    ).toBe(false)
  })
})
