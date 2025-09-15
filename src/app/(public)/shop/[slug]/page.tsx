import { getProductBySlug } from '@/app/actions/products'
import { notFound } from 'next/navigation'
import { PublicPageHeader } from '@/components/public/PublicPageHeader'
import Image from 'next/image'

export default async function PublicProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return notFound()

  return (
    <div className="space-y-6">
      <PublicPageHeader
        title={product.name}
        subtitle={`${Number(product.price).toFixed(2)} kr`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: product.name }]}
      />
      {product.images?.[0] && (
        <div className="relative w-full h-72 rounded-lg overflow-hidden">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        </div>
      )}
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
      {product.url && (
        <a href={product.url} target="_blank" rel="noreferrer" className="underline">Buy or Learn more</a>
      )}
    </div>
  )
}


