export function getClientQrcode (clientId) {
  initClientQrcode()

  return global.qrcode[clientId]
}

export function setClientQrcode (clientId, qr) {
  initClientQrcode()

  console.log('qr', qr)
  global.qrcode[clientId] = qr
}

function initClientQrcode () {
  if (!global.qrcode) {
    global.qrcode = {}
  }
}
