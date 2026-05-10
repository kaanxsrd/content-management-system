'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
  data: { month: string; revenue: number; count: number }[]
}

const chartConfig = {
  revenue: { label: 'Revenue ($)', color: 'var(--chart-1)' },
  count: { label: 'Orders', color: 'var(--chart-2)' }
} satisfies ChartConfig

export function RevenueAreaGraph({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
        <CardDescription>Monthly order revenue and volume</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className='text-muted-foreground py-8 text-center text-sm'>
            No order data available yet.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className='min-h-[220px] w-full'>
            <AreaChart data={data} accessibilityLayer margin={{ top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${v}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id='revenue-gradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='var(--color-revenue)' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='var(--color-revenue)' stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                dataKey='revenue'
                type='monotone'
                fill='url(#revenue-gradient)'
                stroke='var(--color-revenue)'
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
