export function getWhatsAppLink(message = '', phone) {
  if (!phone) return '#'
  const number = phone.replace(/\D/g, '')
  const text = encodeURIComponent(message || 'Hallo Kak, saya tertarik dengan mobil Honda.')
  return `https://wa.me/${number}?text=${text}`
}

export function getProductWhatsApp(productName) {
  return getWhatsAppLink(`Hallo Kak, saya tertarik dengan ${productName}. Bisa minta informasinya?`)
}
