const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('failed to fetch anecdotes')
  }
  return response.json()
}

export const createAnecdote = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error ?? 'failed to create anecdote')
  }
  return response.json()
}

export const updateAnecdote = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })
  if (!response.ok) {
    throw new Error('failed to update anecdote')
  }
  return response.json()
}
