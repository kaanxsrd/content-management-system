import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CustomerIdentityStore = {
  email: string
  name: string
  setIdentity: (email: string, name: string) => void
  clearIdentity: () => void
}

export const useCustomerIdentityStore = create<CustomerIdentityStore>()(
  persist(
    (set) => ({
      email: '',
      name: '',
      setIdentity: (email, name) => set({ email, name }),
      clearIdentity: () => set({ email: '', name: '' })
    }),
    { name: 'cms-customer-identity' }
  )
)
