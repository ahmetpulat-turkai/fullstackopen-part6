import { create } from 'zustand'

let timer = null

const useNotificationStore = create((set) => ({
  message: null,
  actions: {
    set: (message) => set(() => ({ message })),
    clear: () => set(() => ({ message: null })),
  },
}))

// shows the message for five seconds
export const notify = (message) => {
  const { set, clear } = useNotificationStore.getState().actions
  clearTimeout(timer)
  set(message)
  timer = setTimeout(clear, 5000)
}

export const useNotification = () => useNotificationStore((state) => state.message)
