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
  const { data } = useData()
  const contact = data.contact || {}
  const profile = data.profile || {}
  const socialMedia = contact.socialMedia || profile.socialMedia || []
  const getSocialUrl = (platform) => {
    const found = socialMedia.find(s => s.platform === platform)
    return found?.url || ''
  }
  const json = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: profile.namaPerusahaan || 'Honda Nagamotor',
    description: 'Dealer Resmi Honda',
    url: window.location.origin,
    telephone: contact.phone || profile.phone || '+6281234567890',
    email: contact.email || profile.email || 'sales@hondanagamotor.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address || profile.address || 'Jl. Raya Contoh No. 123',
      addressLocality: contact.kota || profile.kota || 'Jakarta Selatan',
      addressCountry: 'ID',
    },
    sameAs: [getSocialUrl('instagram'), getSocialUrl('facebook'), getSocialUrl('twitter')].filter(Boolean),
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
      {(data.products || []).map(p => (
        <ProductJsonLd key={p.id} product={p} />
      ))}
    </>
  )
}
