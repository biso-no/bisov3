import Link from "next/link";
import { Suspense } from "react";
import { listPartners, createPartner, deletePartner } from "@/app/actions/partners";
import { getCampuses } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PartnersAdminPage() {
  const [partners, campuses] = await Promise.all([
    listPartners(),
    getCampuses(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Partners</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create partner</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPartner} className="grid gap-4 sm:grid-cols-2">
            <Input name="name" placeholder="Name" required />
            <Input name="url" placeholder="Website URL (optional)" />
            <Select name="level" defaultValue="national">
              <SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="national">National</SelectItem>
                <SelectItem value="campus">Campus</SelectItem>
              </SelectContent>
            </Select>
            <Select name="campus_id">
              <SelectTrigger><SelectValue placeholder="Campus (if campus partner)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {campuses.map((c: any) => (
                  <SelectItem key={c.$id} value={c.$id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input name="image_bucket" placeholder="Image bucket" defaultValue="partners" required />
            <Input name="image_file_id" placeholder="Image file id" required />
            <div className="sm:col-span-2">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All partners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Level</th>
                  <th className="p-2">Campus</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <tr key={p.$id} className="border-t">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.level}</td>
                    <td className="p-2">{(p as any).campus?.name || ''}</td>
                    <td className="p-2">{p.image_bucket}/{p.image_file_id}</td>
                    <td className="p-2">
                      <form action={deletePartner}>
                        <input type="hidden" name="id" value={p.$id} />
                        <Button variant="destructive" size="sm">Delete</Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


