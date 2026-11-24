/* eslint-disable react-refresh/only-export-components -- context + hooks live together, as in the course material */
import { createContext, useContext, useReducer, useRef } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext).notification

// returns a function that shows a message for five seconds
export const useNotify = () => {
  const { dispatch } = useContext(NotificationContext)
  const timer = useRef(null)

  return (message) => {
    clearTimeout(timer.current)
    dispatch({ type: 'SET', payload: message })
    timer.current = setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }
}
