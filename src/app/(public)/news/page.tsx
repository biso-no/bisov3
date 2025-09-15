import Link from 'next/link'
import { getNews } from '@/app/(alumni)/alumni/actions'
import { Query } from 'node-appwrite'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { PublicPageHeader } from '@/components/public/PublicPageHeader'
import Image from 'next/image'
import { formatDateReadable } from '@/lib/utils'

export default async function PublicNewsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const q = params.q || ''
  const category = params.category || 'all'

  const filters: any[] = []
  if (category && category !== 'all') filters.push(Query.equal('category', category))
  if (q) filters.push(Query.search('title', q))

  const news = await getNews(100, filters as any)
  const categories = Array.from(new Set(news.map(n => n.category).filter(Boolean))) as string[]

  return (
    <div className="space-y-6">
      <PublicPageHeader
        title="News"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'News' }]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <form className="contents">
          <Input name="q" defaultValue={q} placeholder="Search news..." className="md:col-span-2" />
          <Select name="category" defaultValue={category}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button type="submit" className="hidden" />
        </form>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {news.map(item => (
          <article key={(item as any).$id} className="border rounded-lg overflow-hidden bg-background/60 backdrop-blur-sm">
            {item.image && (
              <div className="relative w-full h-40">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg">
                <Link href={`/news/${(item as any).$id}`} className="underline-offset-4 hover:underline">{item.title}</Link>
              </h3>
              <div className="text-xs text-muted-foreground mb-2">{formatDateReadable(item.date)} · {item.author}</div>
              <p className="text-sm text-muted-foreground line-clamp-3">{(item as any).summary}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}


