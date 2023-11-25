import qrcode from 'qrcode'

export async function generateQrcodeToHtml (qrCode) {
  const qrcodeUri = await qrcode.toDataURL(qrCode)
  const qrCodeHtml = `<img src="${qrcodeUri}" />`
  return qrCodeHtml
}
