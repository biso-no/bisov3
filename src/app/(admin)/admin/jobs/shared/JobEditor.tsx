"use client"
import * as React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/lib/hooks/use-toast'
import { createJob, updateJob, uploadJobImage } from '@/app/actions/jobs'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

const formSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  campus: z.string().min(1),
  department_id: z.string().min(1),
  status: z.enum(['open', 'draft', 'closed']).default('open'),
  type: z.string().min(1),
  duration_months: z.coerce.number().int().min(0),
  application_deadline: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  interests: z.array(z.string()).optional(),
  apply_url: z.string().url().optional(),
  image: z.string().optional(),
  description: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

export default function JobEditor({ job, campuses, departments }: { job?: any, campuses?: { $id: string; name: string }[], departments?: { $id: string; Name: string; campus_id?: string }[] }) {
  const router = useRouter()
  const [selectedCampus, setSelectedCampus] = React.useState<string>(job?.campus || '')
  const filteredDepartments = React.useMemo(() => {
    if (!departments) return []
    if (!selectedCampus) return departments
    return departments.filter(d => (d as any).campus_id === selectedCampus)
  }, [departments, selectedCampus])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job?.title || '',
      slug: job?.slug || '',
      campus: job?.campus || '',
      department_id: job?.department_id || '',
      status: (job?.status as any) || 'open',
      type: job?.type || '',
      duration_months: job?.duration_months || 0,
      application_deadline: job?.application_deadline || '',
      start_date: job?.start_date || '',
      end_date: job?.end_date || '',
      contact_name: job?.contact_name || '',
      contact_email: job?.contact_email || '',
      contact_phone: job?.contact_phone || '',
      interests: job?.interests || [],
      apply_url: job?.apply_url || '',
      image: job?.image || '',
      description: job?.description || '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      if (job?.$id) {
        await updateJob(job.$id, values as any)
        toast({ title: 'Job updated' })
      } else {
        await createJob(values as any)
        toast({ title: 'Job created' })
      }
      router.push('/admin/jobs')
    } catch (e) {
      console.error(e)
      toast({ title: 'Failed to save job', variant: 'destructive' })
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const uploaded = await uploadJobImage(fd)
    const url = `https://appwrite.biso.no/v1/storage/buckets/events/files/${(uploaded as any).$id}/view?project=biso`
    form.setValue('image', url)
    toast({ title: 'Image uploaded' })
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Job details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="unique-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <JoditEditor value={field.value} config={{ height: 400 }} onBlur={field.onBlur} onChange={(val: string) => field.onChange(val)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="campus" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus</FormLabel>
                      <Select value={field.value} onValueChange={(v) => { field.onChange(v); setSelectedCampus(v) }}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campus" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campuses?.map(c => (
                            <SelectItem key={c.$id} value={c.$id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="department_id" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredDepartments.map((d) => (
                            <SelectItem key={d.$id} value={d.$id}>{d.Name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="committee / project / board" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="duration_months" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (months)</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="application_deadline" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="start_date" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="end_date" render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="apply_url" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apply URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField control={form.control} name="contact_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="contact_email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="contact_phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover image</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {field.value && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={field.value} alt="cover" className="w-full h-32 object-cover rounded" />
                        )}
                        <Input placeholder="https://..." {...field} />
                        <Input type="file" accept="image/*" onChange={handleImageChange} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests / Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(field.value || []).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-muted">
                          {tag}
                          <button type="button" className="opacity-70 hover:opacity-100" onClick={() => field.onChange((field.value || []).filter(t => t !== tag))}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      <Input placeholder="Add tag and press Enter" onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const target = e.target as HTMLInputElement
                          const val = target.value.trim()
                          if (!val) return
                          const next = Array.from(new Set([...(field.value || []), val]))
                          field.onChange(next)
                          target.value = ''
                        }
                      }} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


