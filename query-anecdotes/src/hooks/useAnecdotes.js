import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../services/anecdotes'
import { useNotify } from '../NotificationContext'

export const useAnecdotes = () =>
  useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  })

export const useCreateAnecdote = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  return useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (anecdotes) =>
        anecdotes.concat(newAnecdote)
      )
      notify(`you created '${newAnecdote.content}'`)
    },
    onError: (error) => {
      notify(error.message)
    },
  })
}

export const useVoteAnecdote = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  return useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updated) => {
      queryClient.setQueryData(['anecdotes'], (anecdotes) =>
        anecdotes.map((a) => (a.id === updated.id ? updated : a))
      )
      notify(`you voted '${updated.content}'`)
    },
  })
}
