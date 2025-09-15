import { getDepartments, getDepartmentTypes } from '@/lib/admin/departments'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { PublicPageHeader } from '@/components/public/PublicPageHeader'

export const revalidate = 0

export default async function PublicUnitsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const filters = {
    active: true,
    campus_id: params.campus_id,
    type: params.type,
    searchTerm: params.search,
    limit: 300,
  }
  const [departments, types] = await Promise.all([
    getDepartments(filters as any),
    getDepartmentTypes(),
  ])

  return (
    <div className="space-y-6">
      <PublicPageHeader
        title="Units"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Units' }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => (
          <Card key={d.$id} className="overflow-hidden">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                  {d.logo ? (
                    <Image src={d.logo} alt={d.name} width={48} height={48} className="object-cover h-12 w-12" />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center font-bold">{d.name.substring(0,2).toUpperCase()}</div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.campusName || ''}{d.type ? ` · ${d.type}` : ''}</div>
                </div>
              </div>
              {d.description && (
                <div className="text-sm text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: d.description }} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


