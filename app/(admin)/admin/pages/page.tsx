import { PageManagement } from "@/components/page-management";
import { getPages } from '@/lib/admin/db';

export default async function Page() {

  return <PageManagement getPages={getPages} />;
}