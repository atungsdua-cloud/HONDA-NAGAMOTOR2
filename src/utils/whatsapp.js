const FALLBACK_PHONE = '6281234567890'

export function getWhatsAppLink(message = '', phone) {
  const number = phone || FALLBACK_PHONE
  const text = encodeURIComponent(message || 'Hallo Kak, saya tertarik dengan mobil Honda.')
  return `https://wa.me/${number}?text=${text}`
}

export function getProductWhatsApp(productName) {
  return getWhatsAppLink(`Hallo Kak, saya tertarik dengan ${productName}. Bisa minta informasinya?`)
}
