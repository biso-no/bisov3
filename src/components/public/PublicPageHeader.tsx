import Link from 'next/link'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Fragment } from 'react'

export function PublicPageHeader({
  title,
  breadcrumbs,
  subtitle,
}: {
  title: string
  subtitle?: string
  breadcrumbs: Array<{ label: string; href?: string }>
}) {
  return (
    <div className="space-y-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((bc, idx) => (
            <Fragment key={`${bc.label}-${idx}`}> 
              <BreadcrumbItem key={`${bc.label}-${idx}`}>
                {bc.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={bc.href}>{bc.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{bc.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  )
}


