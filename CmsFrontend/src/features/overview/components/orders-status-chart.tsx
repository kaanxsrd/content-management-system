'use client'

import { Bar, BarChart, XAxis, YAxis, Cell } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

type Props = {
  data: { status: string; count: number }[]
  total: number
}

const STATUS_COLORS: Record<string, string> = {
  Pending: 'var(--chart-1)',
  Confirmed: 'var(--chart-2)',
  Shipped: 'var(--chart-3)',
  Delivered: 'var(--chart-4)',
  Cancelled: 'var(--chart-5)'
}

const chartConfig = {
  count: { label: 'Orders' }
} satisfies ChartConfig

export function OrdersStatusChart({ data, total }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by Status</CardTitle>
        <CardDescription>{total} total orders</CardDescription>
      </CardHeader>
      <CardContent>
        {data.every((d) => d.count === 0) ? (
          <p className='text-muted-foreground py-8 text-center text-sm'>No orders yet.</p>
        ) : (
          <ChartContainer config={chartConfig} className='min-h-[220px] w-full'>
            <BarChart data={data} accessibilityLayer margin={{ top: 8 }}>
              <XAxis
                dataKey='status'
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey='count' radius={6} maxBarSize={64}>
                {data.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] ?? 'var(--chart-1)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
