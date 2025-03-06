import { Suspense } from 'react';
import Link from 'next/link';
import { getDepartments, getDepartmentTypes } from '@/lib/admin/departments';
import { getCampuses } from '@/lib/admin/db';
import { DepartmentSkeletonGrid } from '@/components/units/department-skeleton';
import { DepartmentCard } from '@/components/units/department-card';
import { DepartmentFilters } from '@/components/units/department-filters';
import { DepartmentStats } from '@/components/units/department-stats';
import { DepartmentClientWrapper } from './client-wrapper';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpDown } from 'lucide-react';

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
      {/* Header section with title and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Units Overview</h1>
          <p className="text-muted-foreground mt-1">
            Manage all departments across all campuses
          </p>
        </div>
        
        <div className="flex gap-2 sm:self-start">
          <Button asChild variant="outline" size="sm" className="gap-1">
            <div>
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </div>
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Add Unit
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <DepartmentStats departments={sortedDepartments} />
      
      {/* Filters section */}
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
