import { listEvents } from '@/app/actions/events'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpDown, CalendarDays, Users, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const campus = params.campus
  const status = params.status || 'all'
  const search = params.q

  // Admin should see events in all locales, so we don't pass locale parameter
  const events = await listEvents({ campus, status, search, limit: 200 })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.filter(e => e.status === 'published').length}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.filter(e => e.status === 'draft').length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/admin/events/new">Create event</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-5">
          <form className="contents">
            <Input defaultValue={search || ''} name="q" placeholder="Search by title..." className="md:col-span-2" />
            <Select name="status" defaultValue={status}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Input name="campus" defaultValue={campus || ''} placeholder="Campus ID" />
            <Button type="submit" className="w-full">Apply</Button>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Translations</th>
              <th className="p-3 text-left">Campus</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => {
              const hasEnglish = evt.translation_refs?.some((t: any) => t.locale === 'en')
              const hasNorwegian = evt.translation_refs?.some((t: any) => t.locale === 'no')
              const primaryTitle = evt.translation_refs?.[0]?.title || evt.slug || 'Untitled'
              const metadata = evt.metadata ? JSON.parse(evt.metadata) : {}
              
              return (
                <tr key={evt.$id} className="border-t">
                  <td className="p-3 font-medium">{primaryTitle}</td>
                  <td className="p-3 capitalize">{evt.status}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {hasEnglish && (
                        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          🇬🇧 EN
                        </span>
                      )}
                      {hasNorwegian && (
                        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          🇳🇴 NO
                        </span>
                      )}
                      {!hasEnglish && !hasNorwegian && (
                        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          No translations
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">{evt.campus?.name || evt.campus_id}</td>
                  <td className="p-3">{metadata.start_date ? new Date(metadata.start_date).toLocaleDateString() : '-'}</td>
                <td className="p-3 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/events/${evt.$id}`}>Edit</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/alumni/events/${evt.$id}`}>Preview</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/events/new?duplicate=${evt.$id}`}>Duplicate</Link>
                  </Button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}
