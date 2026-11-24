import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import anecdoteService from './services/anecdotes'
import { useAnecdoteStore, useAnecdotes, useAnecdoteActions } from './store'

const anecdotes = [
  { id: '1', content: 'Make it work', votes: 1 },
  { id: '2', content: 'Real artists ship code', votes: 5 },
  { id: '3', content: 'Untested code is broken code', votes: 3 },
]

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('initialization', () => {
  it('state is initialized with the anecdotes returned by the backend', async () => {
    anecdoteService.getAll.mockResolvedValue(anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.initialize()
    })

    expect(anecdoteService.getAll).toHaveBeenCalledTimes(1)
    expect(useAnecdoteStore.getState().anecdotes).toEqual(anecdotes)
  })
})

describe('useAnecdotes', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes })
  })

  it('returns the anecdotes sorted by votes, highest first', () => {
    const { result } = renderHook(() => useAnecdotes())

    expect(result.current.map((a) => a.votes)).toEqual([5, 3, 1])
  })

  it('does not mutate the anecdotes kept in the store', () => {
    renderHook(() => useAnecdotes())

    expect(useAnecdoteStore.getState().anecdotes).toEqual(anecdotes)
  })

  it('returns only the anecdotes matching the filter, still sorted', () => {
    useAnecdoteStore.setState({ filter: 'code' })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current.map((a) => a.id)).toEqual(['2', '3'])
  })

  it('returns an empty list when nothing matches the filter', () => {
    useAnecdoteStore.setState({ filter: 'no such anecdote' })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual([])
  })
})

describe('voting', () => {
  it('increases the number of votes of the voted anecdote', async () => {
    useAnecdoteStore.setState({ anecdotes })
    anecdoteService.update.mockResolvedValue({ ...anecdotes[0], votes: 2 })

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.vote('1')
    })

    expect(anecdoteService.update).toHaveBeenCalledWith('1', { ...anecdotes[0], votes: 2 })
    const state = useAnecdoteStore.getState().anecdotes
    expect(state.find((a) => a.id === '1').votes).toBe(2)
    expect(state.find((a) => a.id === '2').votes).toBe(5)
  })
})
