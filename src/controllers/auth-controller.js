import { getClientQrcode } from '../stores/client-qrcode.js'
import { setClientWebhooks } from '../stores/client-webhooks.js'
import { generateQrcodeToHtml } from '../helpers/qrcode.js'
import { getWhatsappClient, setWhatsappClient } from '../stores/whatsapp-client.js'
import { initWhatsappEngine } from '../services/whatsapp-engine.js'

export async function register ({ body: { clientId, webhookUrls } }, res) {
  if (!getWhatsappClient(clientId)) {
    const client = initWhatsappEngine(clientId)
    setWhatsappClient(clientId, client)
  }

  if (webhookUrls) {
    setClientWebhooks(clientId, webhookUrls)
  }

  const baseUrl = process.env.BASE_URL
  const url = `${baseUrl}/v1/qr?clientId=${clientId}`

  res.send(`Getting QR Code from link : ${url}`)
}

export async function getQR ({ query: { clientId } }, res) {
  const client = getWhatsappClient(clientId)
  if (!client) return res.status(404).send('Client ID not found, please register before!')

  const state = await client.getState()
  if (state === 'CONNECTED') return res.status(200).send('Whatsapp is already to use')

  const qrCode = getClientQrcode(clientId)
  if (!qrCode) return res.status(503).send('QR is not ready, please try later!')

  const qrCodeHtml = await generateQrcodeToHtml(qrCode)

  res.send(qrCodeHtml)
}
