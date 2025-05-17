"use client"

import { create } from "zustand"

interface StoreState {
  hasSubscription: boolean
  setSubscriptionStatus: (status: boolean) => void
}

export const useStore = create<StoreState>((set) => ({
  hasSubscription: false,
  setSubscriptionStatus: (status) => set({ hasSubscription: status }),
}))
