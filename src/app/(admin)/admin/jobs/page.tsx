import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { listJobs } from '@/app/actions/jobs'
import { ArrowUpDown, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminJobsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const status = params.status || 'all'
  const campus = params.campus
  const q = params.q
  const jobs = await listJobs({ limit: 200, status, campus, query: q })
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total jobs</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter(j => j.status === 'open').length}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter(j => j.status === 'draft').length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Button asChild>
          <Link href="/admin/jobs/new">Create job</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-5">
          <form className="contents">
            <Input defaultValue={q || ''} name="q" placeholder="Search by title..." className="md:col-span-2" />
            <Select name="status" defaultValue={status}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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
              <th className="p-3 text-left">Deadline</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.$id} className="border-t">
                <td className="p-3 font-medium">{job.title}</td>
                <td className="p-3 capitalize">{job.status}</td>
                <td className="p-3">{job.campus}</td>
                <td className="p-3">{job.application_deadline || '-'}</td>
                <td className="p-3 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/jobs/${job.$id}`}>Edit</Link>
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


