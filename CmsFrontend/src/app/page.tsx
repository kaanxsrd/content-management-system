import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/icons'

export default async function Page() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard/overview')

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      {/* Nav */}
      <header className='border-b'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-2 font-bold text-lg'>
            <Icons.product className='size-5 text-primary' />
            ShopCMS
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='ghost' asChild>
              <Link href='/auth/sign-in'>Sign in</Link>
            </Button>
            <Button asChild>
              <Link href='/auth/sign-up'>Start free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className='flex-1 flex items-center justify-center px-6 py-24 text-center'>
        <div className='mx-auto max-w-3xl space-y-8'>
          <Badge variant='secondary' className='text-sm px-4 py-1.5'>
            <Icons.sparkles className='mr-1.5 size-3.5' />
            Multi-tenant ecommerce in minutes
          </Badge>

          <h1 className='text-5xl sm:text-6xl font-bold tracking-tight leading-tight'>
            Your store,
            <span className='text-primary'> your way.</span>
          </h1>

          <p className='text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed'>
            Create a Shopify-quality storefront in under 5 minutes. Manage products, customers, and orders — all in one dashboard.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' className='text-base px-8 h-12' asChild>
              <Link href='/auth/sign-up'>
                Start your free store
                <Icons.arrowRight className='ml-2 size-4' />
              </Link>
            </Button>
            <Button size='lg' variant='outline' className='text-base px-8 h-12' asChild>
              <Link href='/auth/sign-in'>Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className='border-t bg-muted/30 px-6 py-20'>
        <div className='mx-auto max-w-5xl'>
          <div className='text-center mb-14'>
            <h2 className='text-3xl font-bold tracking-tight'>How it works</h2>
            <p className='text-muted-foreground mt-3 text-lg'>Three steps to your live storefront.</p>
          </div>

          <div className='grid grid-cols-1 gap-8 sm:grid-cols-3'>
            {[
              {
                step: '01',
                icon: <Icons.teams className='size-6 text-primary' />,
                title: 'Create your org',
                description: 'Sign up and create a Clerk organization. Your org slug becomes your shop URL.'
              },
              {
                step: '02',
                icon: <Icons.product className='size-6 text-primary' />,
                title: 'Add products',
                description: 'Use the dashboard to add products with names, prices, descriptions, and images.'
              },
              {
                step: '03',
                icon: <Icons.share className='size-6 text-primary' />,
                title: 'Share your shop',
                description: 'Send your /shop/[org] link to customers. They can browse and pay via Stripe.'
              }
            ].map((item) => (
              <div key={item.step} className='relative flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm'>
                <div className='flex items-center justify-between'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                    {item.icon}
                  </div>
                  <span className='text-4xl font-bold text-muted-foreground/20 tabular-nums'>
                    {item.step}
                  </span>
                </div>
                <h3 className='text-lg font-semibold'>{item.title}</h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / features */}
      <section className='border-t px-6 py-20'>
        <div className='mx-auto max-w-5xl'>
          <div className='text-center mb-14'>
            <h2 className='text-3xl font-bold tracking-tight'>Everything you need</h2>
            <p className='text-muted-foreground mt-3 text-lg'>Built on the same stack as production SaaS.</p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                icon: <Icons.billing className='size-5 text-primary' />,
                title: 'Stripe Checkout',
                description: 'Secure, hosted checkout pages. No PCI compliance headaches.'
              },
              {
                icon: <Icons.dashboard className='size-5 text-primary' />,
                title: 'Full Dashboard',
                description: 'Manage products, orders, and customers from one place.'
              },
              {
                icon: <Icons.teams className='size-5 text-primary' />,
                title: 'Multi-tenant',
                description: 'Each org gets their own storefront at /shop/[your-slug].'
              },
              {
                icon: <Icons.checks className='size-5 text-primary' />,
                title: 'Order State Machine',
                description: 'Pending → Confirmed → Shipped → Delivered. Full lifecycle.'
              },
              {
                icon: <Icons.trendingUp className='size-5 text-primary' />,
                title: 'Live Analytics',
                description: 'Revenue charts, order breakdowns, and customer metrics.'
              },
              {
                icon: <Icons.lock className='size-5 text-primary' />,
                title: 'API Key Auth',
                description: 'Secure CRM API with rotating API keys. No browser exposure.'
              }
            ].map((feature) => (
              <div key={feature.title} className='flex gap-4 rounded-lg border bg-card p-5'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                  {feature.icon}
                </div>
                <div>
                  <h3 className='font-semibold'>{feature.title}</h3>
                  <p className='text-muted-foreground text-sm mt-1 leading-relaxed'>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='border-t bg-primary/5 px-6 py-20'>
        <div className='mx-auto max-w-2xl text-center space-y-6'>
          <h2 className='text-3xl font-bold tracking-tight'>Ready to launch?</h2>
          <p className='text-muted-foreground text-lg'>
            No credit card required. Your storefront goes live the moment you add your first product.
          </p>
          <Button size='lg' className='text-base px-10 h-12' asChild>
            <Link href='/auth/sign-up'>
              Start your free store
              <Icons.arrowRight className='ml-2 size-4' />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t py-8'>
        <div className='mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2 font-semibold text-sm'>
            <Icons.product className='size-4 text-primary' />
            ShopCMS
          </div>
          <p className='text-muted-foreground text-sm'>
            &copy; {new Date().getFullYear()} ShopCMS. Built with Next.js &amp; ASP.NET Core.
          </p>
          <div className='flex gap-4 text-sm text-muted-foreground'>
            <Link href='/privacy-policy' className='hover:text-foreground transition-colors'>Privacy</Link>
            <Link href='/terms-of-service' className='hover:text-foreground transition-colors'>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
