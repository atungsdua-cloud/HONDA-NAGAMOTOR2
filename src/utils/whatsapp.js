const PHONE_NUMBER = '6281234567890'

export function getWhatsAppLink(message = '') {
  const text = encodeURIComponent(message || 'Hallo Kak, saya tertarik dengan mobil Honda.')
  return `https://wa.me/${PHONE_NUMBER}?text=${text}`
}

export function getProductWhatsApp(productName) {
  return getWhatsAppLink(`Hallo Kak, saya tertarik dengan ${productName}. Bisa minta informasinya?`)
}
