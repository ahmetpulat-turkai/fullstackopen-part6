const baseUrl = 'http://localhost:3001/anecdotes'

const request = async (url, options) => {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`request failed with status ${response.status}`)
  }
  return response.json()
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

const getAll = () => request(baseUrl)

const createNew = (content) => request(baseUrl, json('POST', { content, votes: 0 }))

const update = (id, anecdote) => request(`${baseUrl}/${id}`, json('PUT', anecdote))

const remove = (id) => request(`${baseUrl}/${id}`, { method: 'DELETE' })

export default { getAll, createNew, update, remove }
