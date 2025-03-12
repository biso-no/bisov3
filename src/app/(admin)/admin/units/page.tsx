import { getDepartments, getDepartmentTypes } from '@/lib/admin/departments';
import { getCampuses } from '@/lib/admin/db';
import { DepartmentStats } from '@/components/units/department-stats';
import { DepartmentClientWrapper } from './client-wrapper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface PageProps {
  searchParams: {
    active?: string;
    campus_id?: string;
    type?: string;
    search?: string;
    sort?: string;
  };
}

export default async function UnitsPage({ searchParams }: PageProps) {
  // Prepare filter values from search params
  const filters = {
    active: searchParams.active === 'false' 
      ? false
      : searchParams.active === 'true'
        ? true
        : undefined,
    campus_id: searchParams.campus_id,
    type: searchParams.type,
    searchTerm: searchParams.search
  };

  // Fetch data concurrently
  const [departments, campuses, types] = await Promise.all([
    getDepartments(filters),
    getCampuses(),
    getDepartmentTypes()
  ]);
  
  // Sort departments if needed
  let sortedDepartments = [...departments];
  const sortOrder = searchParams.sort || 'name-asc';
  const [sortField, sortDirection] = sortOrder.split('-');
  
  if (sortField && sortDirection) {
    sortedDepartments.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'campus':
          comparison = (a.campusName || '').localeCompare(b.campusName || '');
          break;
        case 'users':
          comparison = (a.userCount || 0) - (b.userCount || 0);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }
  
  return (
    <div className="space-y-8">
      {/* Header section with title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Units Overview</h1>
        <p className="text-muted-foreground mt-1">
          Manage all departments across all campuses
        </p>
      </div>
      
      {/* Stats cards */}
      <DepartmentStats departments={departments} />
      
      {/* Client-side components with filters */}
      <DepartmentClientWrapper
        departments={sortedDepartments}
        campuses={campuses}
        types={types}
        initialFilters={{
          active: filters.active,
          campus_id: filters.campus_id,
          type: filters.type,
          searchTerm: filters.searchTerm
        }}
        sortOrder={sortOrder}
      />
    </div>
  );
}