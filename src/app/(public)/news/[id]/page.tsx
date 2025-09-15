import { getNewsById } from '@/app/(alumni)/alumni/actions'
import { notFound } from 'next/navigation'
import { PublicPageHeader } from '@/components/public/PublicPageHeader'
import { formatDateReadable } from '@/lib/utils'

export default async function PublicNewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getNewsById(id)
  if (!item) return notFound()
  return (
    <div className="space-y-6">
      <PublicPageHeader
        title={item.title}
        subtitle={[formatDateReadable(item.date), '·', item.author].join(' ')}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: item.title }]}
      />
      {item.image && (
        <img src={item.image} alt={item.title} className="w-full rounded-lg" />
      )}
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.content || '' }} />
    </div>
  )
}


