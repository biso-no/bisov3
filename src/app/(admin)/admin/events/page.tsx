import { listEvents } from '@/app/actions/events'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpDown, CalendarDays, Users, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

export default async function AdminEventsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const campus = searchParams.campus
  const status = searchParams.status || 'all'
  const search = searchParams.q

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
            <div className="text-2xl font-bold">{events.filter(e => e.status === 'publish').length}</div>
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
                <SelectItem value="publish">Published</SelectItem>
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
              <th className="p-3 text-left">Campus</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.$id} className="border-t">
                <td className="p-3 font-medium">{evt.title}</td>
                <td className="p-3 capitalize">{evt.status}</td>
                <td className="p-3">{evt.campus}</td>
                <td className="p-3">{evt.start_date} {evt.start_time ? `• ${evt.start_time}` : ''}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
