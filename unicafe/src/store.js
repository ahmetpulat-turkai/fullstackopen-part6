import { create } from 'zustand'

const useFeedbackStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    good: () => set(state => ({ good: state.good + 1 })),
    neutral: () => set(state => ({ neutral: state.neutral + 1 })),
    bad: () => set(state => ({ bad: state.bad + 1 })),
  },
}))

export const useFeedback = () => useFeedbackStore(state => state)
export const useFeedbackActions = () => useFeedbackStore(state => state.actions)
