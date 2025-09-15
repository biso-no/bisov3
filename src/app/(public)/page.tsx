import Image from 'next/image'
import Link from 'next/link'
import { listEvents } from '@/app/actions/events'
import { getNews } from '@/app/(alumni)/alumni/actions'
import { listJobs } from '@/app/actions/jobs'
import { getProducts } from '@/app/actions/products'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDateReadable } from '@/lib/utils'

export default async function HomePage() {
  const [events, news, jobs, products] = await Promise.all([
    listEvents({ status: 'publish', limit: 8 }),
    getNews(8),
    listJobs({ status: 'open', limit: 8 }),
    getProducts('in-stock'),
  ])

  const safeProducts = Array.isArray(products) ? products.slice(0, 6) : []
  const safeEvents = Array.isArray(events) ? events.slice(0, 6) : []
  const safeNews = Array.isArray(news) ? news.slice(0, 6) : []
  const safeJobs = Array.isArray(jobs) ? jobs.slice(0, 6) : []

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-500 to-indigo-600 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.25),transparent_35%)]" />
        <div className="relative px-6 py-16 md:px-10 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-5">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                BI Student Organisation
              </h1>
              <p className="text-white/90 text-base md:text-lg max-w-prose">
                We connect and empower students across BI campuses in Oslo, Bergen, Trondheim and Stavanger. Explore our events, join a unit, find a role, and make the most of student life.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" variant="default" className="bg-white text-blue-700 hover:bg-white/90">
                  <Link href="/events">Explore Events</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10">
                  <Link href="/units">Discover Units</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-56 md:h-80">
              <Image src="/images/logo-home.png" alt="BISO" fill className="object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="golden" className="">
          <CardHeader>
            <CardTitle>Join a Unit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-primary-100/90">
            <p>Find your community across marketing, events, finance, HR and more.</p>
            <Button asChild size="sm" variant="secondary">
              <Link href="/units">Browse units</Link>
            </Button>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>Talks, parties, workshops and fairs happening at your campus.</p>
            <Button asChild size="sm" variant="secondary">
              <Link href="/events">See events</Link>
            </Button>
          </CardContent>
        </Card>
        <Card variant="animated">
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>Contribute, learn and lead. Find roles across BISO units.</p>
            <Button asChild size="sm" variant="default">
              <Link href="/jobs">View jobs</Link>
            </Button>
          </CardContent>
        </Card>
        <Card variant="animated">
          <CardHeader>
            <CardTitle>Shop</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>Merch and more. Support your campus with every purchase.</p>
            <Button asChild size="sm" variant="default">
              <Link href="/shop">Visit shop</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Events preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Link href="/events" className="text-sm underline hover:no-underline">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeEvents.map((ev: any) => (
            <Card key={ev.$id} className="overflow-hidden">
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{ev.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{ev.description}</p>
                <div className="text-xs text-muted-foreground">{formatDateReadable(ev.start_date)}</div>
              </CardContent>
              <div className="px-4 py-3 border-t bg-muted/20 flex justify-end">
                <Link href={`/events/${ev.$id}`} className="text-sm underline hover:no-underline">Details</Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* News preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest News</h2>
          <Link href="/news" className="text-sm underline hover:no-underline">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeNews.map((n: any) => (
            <Card key={n.$id} className="overflow-hidden">
              {n.image && (
                <div className="relative w-full h-36">
                  <Image src={n.image} alt={n.title} fill className="object-cover" />
                </div>
              )}
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold">{n.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{n.summary}</p>
                <div className="text-xs text-muted-foreground">{formatDateReadable(n.date)}</div>
              </CardContent>
              <div className="px-4 py-3 border-t bg-muted/20 flex justify-end">
                <Link href={`/news/${n.$id}`} className="text-sm underline hover:no-underline">Read</Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Jobs preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Open Positions</h2>
          <Link href="/jobs" className="text-sm underline hover:no-underline">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeJobs.map((job: any) => (
            <Card key={job.$id} className="overflow-hidden">
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description?.replace(/<[^>]+>/g, '').slice(0, 140)}...</p>
                <div className="text-xs text-muted-foreground">{job.campus} • Deadline: {job.application_deadline || '—'}</div>
              </CardContent>
              <div className="px-4 py-3 border-t bg-muted/20 flex justify-end">
                <Link href={`/jobs/${job.slug}`} className="text-sm underline hover:no-underline">Details</Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Shop preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Popular in Shop</h2>
          <Link href="/shop" className="text-sm underline hover:no-underline">Visit shop</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeProducts.map((p: any) => (
            <Card key={p.$id} className="overflow-hidden">
              {p.images?.[0] && (
                <div className="relative w-full h-40">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                </div>
              )}
              <CardContent className="p-4 space-y-1">
                <h3 className="font-semibold">{p.name}</h3>
                <div className="text-sm text-muted-foreground line-clamp-2">{p.description}</div>
                <div className="text-sm font-medium">{Number(p.price).toFixed(2)} kr</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}


