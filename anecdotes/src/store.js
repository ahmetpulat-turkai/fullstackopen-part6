import { create } from 'zustand'
import anecdoteService from './services/anecdotes'
import { notify } from './notificationStore'

export const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    add: async (content) => {
      const created = await anecdoteService.createNew(content)
      set((state) => ({ anecdotes: state.anecdotes.concat(created) }))
      notify(`you created '${created.content}'`)
    },
    vote: async (id) => {
      const anecdote = get().anecdotes.find((a) => a.id === id)
      const updated = await anecdoteService.update(id, {
        ...anecdote,
        votes: anecdote.votes + 1,
      })
      set((state) => ({
        anecdotes: state.anecdotes.map((a) => (a.id === id ? updated : a)),
      }))
      notify(`you voted '${updated.content}'`)
    },
    remove: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({ anecdotes: state.anecdotes.filter((a) => a.id !== id) }))
    },
    setFilter: (filter) => set(() => ({ filter })),
  },
}))

// sorted by votes (descending) and filtered by the filter text
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  return anecdotes
    .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
    .toSorted((a, b) => b.votes - a.votes)
}

export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
