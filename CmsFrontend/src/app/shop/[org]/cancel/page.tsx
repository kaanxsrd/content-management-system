import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Props = { params: Promise<{ org: string }> }

export default async function CancelPage({ params }: Props) {
  const { org } = await params

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center'>
      <div className='flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl dark:bg-amber-900/30'>
        ↩
      </div>
      <div>
        <h1 className='text-3xl font-bold'>Payment Cancelled</h1>
        <p className='text-muted-foreground mt-2 text-lg'>
          No charge was made. You can go back and try again.
        </p>
      </div>
      <Button asChild>
        <Link href={`/shop/${org}`}>Back to Shop</Link>
      </Button>
    </div>
  )
}
