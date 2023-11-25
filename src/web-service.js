import express from 'express'
import { initWhatsappEngine } from './whatsapp-engine.js'
import whatsappWeb from 'whatsapp-web.js'
import qrcode from 'qrcode'
const app = express()

const { MessageMedia } = whatsappWeb

global.clients = {}
global.qrcode = {}
global.webhook = {}

export function initWebService () {
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))

  const port = process.env.PORT

  app.get('/', (req, res) => {
    res.send('Whatsapp API')
  })

  app.post('/v1/messages', async (req, res) => {
    try {
      const { phone, message, groupId, clientId, media } = req.body

      const client = global.clients[clientId]
      if (!client) return res.status(404).send('Client ID not found, please register before!')

      const state = await client.getState()
      if (!state) return res.status(503).send('Send message is not ready, please try later!')

      const waid = groupId ? groupId + '@g.us' : phone + '@c.us'

      const options = {}

      if (media?.url) {
        const messageMedia = await MessageMedia.fromUrl(media.url)
        options.media = messageMedia
      }

      const responseMessage = await client.sendMessage(waid, message, options)
      res.send(responseMessage)
    } catch (error) {
      console.error('error', error)
      res.status(403).send(error.message)
    }
  })

  app.post('/v1/register', async (req, res) => {
    const { clientId, webhookUrls } = req.body

    if (!global.clients[clientId]) {
      global.clients[clientId] = initWhatsappEngine(clientId)
    }

    if (webhookUrls) {
      global.webhook[clientId] = webhookUrls
    }

    const baseUrl = process.env.BASE_URL
    const url = `${baseUrl}/v1/qr?clientId=${clientId}`

    res.send(`Getting QR Code from link : ${url}`)
  })

  app.get('/v1/qr', async (req, res) => {
    const clientId = req.query.clientId

    const client = global.clients[clientId]
    if (!client) return res.status(404).send('Client ID not found, please register before!')

    const state = await client.getState()
    if (state === 'CONNECTED') return res.status(200).send('Whatsapp is already to use')

    const qrCode = global.qrcode[clientId]
    if (!qrCode) return res.status(503).send('QR is not ready, please try later!')

    const qrcodeUri = await qrcode.toDataURL(qrCode)
    res.send(`<img src="${qrcodeUri}" />`)
  })

  app.post('/test-webhook', (req, res) => {
    console.log('req', req.body)
    console.log('contact', req.body.data.chat.contact)
    res.send('ok')
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
