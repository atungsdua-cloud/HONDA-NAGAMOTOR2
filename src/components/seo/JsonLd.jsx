import { useData } from '../../context/DataContext'

export function ProductJsonLd({ product }) {
  const priceStr = product.variants?.[0]?.price || product.price
  if (!product || !priceStr) return null
  const price = String(priceStr).replace(/[^\d]/g, '')
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || product.images?.[0],
    brand: { '@type': 'Brand', name: 'Honda' },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      url: window.location.href,
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export function ReviewJsonLd({ testimonials }) {
  if (!testimonials?.length) return null
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@type': 'Organization', name: 'Honda Nagamotor' },
    reviewRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      reviewCount: testimonials.length,
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export function FaqJsonLd({ faqs }) {
  if (!faqs?.length) return null
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export function LocalBusinessJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Honda Nagamotor',
    description: 'Dealer Resmi Honda',
    url: window.location.origin,
    telephone: '+6281234567890',
    email: 'sales@hondanagamotor.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Raya Contoh No. 123',
      addressLocality: 'Jakarta Selatan',
      addressCountry: 'ID',
    },
    sameAs: ['#', '#', '#'],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export default function StructuredData() {
  const { data } = useData()
  return (
    <>
      <LocalBusinessJsonLd />
      <ReviewJsonLd testimonials={data.testimonials} />
      <FaqJsonLd faqs={data.faqs} />
      {data.products.map(p => (
        <ProductJsonLd key={p.id} product={p} />
      ))}
    </>
  )
}
