import { getEvent, getEventImageViewUrl } from '@/app/actions/events'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PublicPageHeader } from '@/components/public/PublicPageHeader'
import { formatDateReadable } from '@/lib/utils'

export default async function PublicEventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEvent(id)
  if (!event) return notFound()

  const imageUrl = event.image ? await getEventImageViewUrl(event.image) : null

  return (
    <div className="space-y-6">
      <PublicPageHeader
        title={event.title}
        subtitle={[formatDateReadable(event.start_date), event.end_date ? `– ${formatDateReadable(event.end_date)}` : '', event.campus ? `· ${event.campus}` : ''].filter(Boolean).join(' ')}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events', href: '/events' }, { label: event.title }]}
      />
      {imageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <Image src={imageUrl} alt={event.title} fill className="object-cover" />
        </div>
      )}
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
      {event.ticket_url && (
        <div>
          <a href={event.ticket_url} target="_blank" rel="noreferrer" className="underline">Get tickets</a>
        </div>
      )}
    </div>
  )
}


