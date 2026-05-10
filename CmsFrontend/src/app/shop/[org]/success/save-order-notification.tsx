'use client'

import { useEffect } from 'react'
import { useNotificationStore } from '@/features/notifications/utils/store'

type Props = {
  sessionId: string
  customerName: string | null
  itemSummary: string
  totalAmount: string
}

export function SaveOrderNotification({ sessionId, customerName, itemSummary, totalAmount }: Props) {
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => {
    const from = customerName ? `from ${customerName}` : ''
    addNotification({
      id: `order-${sessionId}`,
      type: 'order',
      title: 'New Order Received',
      body: `${from ? `${from} — ` : ''}${itemSummary} · ${totalAmount}`.trim(),
      createdAt: new Date().toISOString(),
      actions: [
        {
          id: 'view-orders',
          label: 'View Orders',
          type: 'redirect',
          style: 'primary'
        }
      ]
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  return null
}
