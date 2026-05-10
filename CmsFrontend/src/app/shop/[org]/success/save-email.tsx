'use client'

import { useEffect } from 'react'
import { useCustomerIdentityStore } from '@/features/shop/store/customer'

export function SaveEmail({ email, name }: { email: string; name?: string }) {
  const setIdentity = useCustomerIdentityStore((s) => s.setIdentity)

  useEffect(() => {
    if (email) setIdentity(email, name ?? '')
  }, [email, name, setIdentity])

  return null
}
