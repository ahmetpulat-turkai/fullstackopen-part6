import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

  const onCreate = (event) => {
    event.preventDefault()
    add(event.target.anecdote.value)
    event.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onCreate}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
