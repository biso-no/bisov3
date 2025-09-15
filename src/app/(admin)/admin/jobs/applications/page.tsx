import { listJobApplications } from '@/app/actions/jobs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EXPORT_ROUTE } from './export'
import Link from 'next/link'

export default async function AdminAllJobApplications({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const jobId = (await searchParams).job_id
  const apps = jobId ? await listJobApplications(jobId) : []
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Applications</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-5">
          <form className="contents">
            <Input name="job_id" defaultValue={jobId || ''} placeholder="Filter by Job ID" className="md:col-span-2" />
            <button type="submit" className="hidden" />
          </form>
          {jobId && (
            <a href={`${EXPORT_ROUTE}?job_id=${jobId}`}>
              <Button type="button" variant="outline">Export CSV</Button>
            </a>
          )}
        </CardContent>
      </Card>
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">Job</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Applied</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a: any) => (
              <tr key={a.$id} className="border-t">
                <td className="p-3">
                  <Link href={`/admin/jobs/${a.job_id}`} className="underline hover:no-underline">{a.job_id}</Link>
                </td>
                <td className="p-3">{a.applicant_name}</td>
                <td className="p-3">{a.applicant_email}</td>
                <td className="p-3">{a.applicant_phone || '-'}</td>
                <td className="p-3">{a.applied_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


