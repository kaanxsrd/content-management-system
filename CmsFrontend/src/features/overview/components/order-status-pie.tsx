'use client'

import { Cell, Pie, PieChart } from 'recharts'
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
  ChartLegend,
  ChartLegendContent,
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

export function OrderStatusPie({ data, total }: Props) {
  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((d) => [
      d.status,
      { label: d.status, color: STATUS_COLORS[d.status] ?? 'var(--chart-1)' }
    ])
  )

  const chartData = data.map((d) => ({
    ...d,
    fill: STATUS_COLORS[d.status] ?? 'var(--chart-1)'
  }))

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Order Status</CardTitle>
        <CardDescription>{total} total orders</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center justify-center pb-0'>
        {total === 0 ? (
          <p className='text-muted-foreground py-8 text-center text-sm'>No orders yet.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square max-h-[280px] min-h-[220px] w-full'
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey='status' hideLabel />} />
              <Pie
                data={chartData}
                dataKey='count'
                nameKey='status'
                innerRadius={50}
                paddingAngle={3}
                cornerRadius={4}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey='status' />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
