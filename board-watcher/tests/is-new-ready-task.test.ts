import { describe, expect, it } from 'vitest'
import { isNewReadyTask } from '../lib/is-new-ready-task'

const readyRoot = {
  re: null as string | null,
  labels: { 'board.task': 'ready', topic: 'site' },
}

describe('isNewReadyTask', () => {
  it('accepts a new ready task (task.created on a ready root)', () => {
    expect(
      isNewReadyTask({
        type: 'task.created',
        message: readyRoot,
      }),
    ).toBe(true)
  })

  it('rejects a thread reply that still matches the ready-label tail', () => {
    expect(
      isNewReadyTask({
        type: 'message.posted',
        message: { re: '812', labels: {} },
      }),
    ).toBe(false)
  })

  it('rejects a label change', () => {
    expect(
      isNewReadyTask({
        type: 'labels.changed',
        message: readyRoot,
      }),
    ).toBe(false)
  })

  it('rejects a claim (thread leaving the ready view)', () => {
    expect(
      isNewReadyTask({
        type: 'task.claimed',
        message: {
          re: null,
          labels: { 'board.task': 'claimed' },
        },
      }),
    ).toBe(false)
  })

  it('rejects message.posted even on a root (label is not set yet on create)', () => {
    expect(
      isNewReadyTask({
        type: 'message.posted',
        message: { re: null, labels: { topic: 'site' } },
      }),
    ).toBe(false)
  })

  it('rejects other task lifecycle events', () => {
    for (const type of [
      'task.ready',
      'task.completed',
      'task.released',
      'task.canceled',
      'task.reopened',
    ]) {
      expect(isNewReadyTask({ type, message: readyRoot })).toBe(false)
    }
  })

  it('rejects task.created without a ready label', () => {
    expect(
      isNewReadyTask({
        type: 'task.created',
        message: { re: null, labels: { 'board.task': 'waiting' } },
      }),
    ).toBe(false)
  })
})
