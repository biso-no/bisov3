import { PageManagement } from "@/components/page-management";
import { getPages } from '@/lib/admin/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TemplateManagement from "@/components/page-template";

export default async function Page() {

  return (
    <div className="flex flex-col">
      <Tabs defaultValue="pages">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="pages">
          <PageManagement getPages={getPages} />
        </TabsContent>
        <TabsContent value="templates">
          <TemplateManagement />
        </TabsContent>
      </Tabs> 
    </div>
  )
}