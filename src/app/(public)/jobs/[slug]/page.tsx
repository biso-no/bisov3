import { getJobBySlug, createJobApplication } from '@/app/actions/jobs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'

export default async function AlumniJobDetailBySlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job) return notFound()
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-muted-foreground">{job.campus} • {job.type}</p>
      </header>
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: job.description || '' }} />
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Apply for this role</h2>
        <form
          action={async (formData: FormData) => {
            'use server'
            await createJobApplication({
              job_id: String((job as any).$id),
              applicant_name: String(formData.get('name') || ''),
              applicant_email: String(formData.get('email') || ''),
              applicant_phone: String(formData.get('phone') || ''),
              cover_letter: String(formData.get('cover_letter') || ''),
            })
          }}
          className="grid gap-3"
        >
          <Input name="name" placeholder="Full name" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="phone" placeholder="Phone (optional)" />
          <Textarea name="cover_letter" placeholder="Cover letter" rows={6} />
          <div className="flex justify-end"><Button type="submit">Submit application</Button></div>
        </form>
      </section>
    </div>
  )
}


