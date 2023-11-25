import whatsappWeb from 'whatsapp-web.js'
import axios from 'axios'
import { setClientQrcode } from '../stores/client-qrcode.js'

const { Client, LocalAuth } = whatsappWeb

export function initWhatsappEngine (clientId) {
  console.log('init whatsapp engine', clientId)

  const client = new Client({
    authStrategy: new LocalAuth({ clientId }),
    puppeteer: {
      args: ['--no-sandbox']
    }
  })

  client.on('qr', qr => {
    setClientQrcode(clientId, qr)
  })

  client.on('disconnected', async reason => {
    console.log('disconnected', reason, clientId)
    await client.destroy()
    delete global.clients[clientId]
    console.log('global.clients', global.clients)
  })

  client.on('ready', () => {
    console.log('Client is ready!')
  })

  client.on('message', async (message) => {
    const chat = await message.getChat()
    if (chat.id.user === 'status') return

    const webhookUrls = global.webhook[clientId]
    if (webhookUrls) {
      const contact = await message.getContact()
      let media
      if (message.hasMedia) {
        media = await message.downloadMedia()
        media = {
          ...media,
          caption: message.rawData.caption
        }
      }

      webhookUrls.forEach(webhookUrl => {
        axios.post(webhookUrl, {
          data: {
            ...message.rawData,
            media,
            fromNumber: chat.id.user,
            timestamp: message.timestamp,
            chat: {
              ...chat,
              type: chat.isGroup ? 'group' : 'chat',
              contact: {
                ...contact,
                displayName: contact.name
              }
            }
          }
        }).catch(console.error)
      })
    }
  })

  client.initialize()

  return client
}
