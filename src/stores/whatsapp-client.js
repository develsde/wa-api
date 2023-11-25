import whatsappWeb from 'whatsapp-web.js'
const { MessageMedia } = whatsappWeb

export function getWhatsappClient (clientId) {
  initWhatsappClient()

  return global.clients[clientId]
}

export function setWhatsappClient (clientId, client) {
  initWhatsappClient()

  global.clients[clientId] = client
}

export async function generateMedia (media) {
  if (media?.url) {
    return await MessageMedia.fromUrl(media.url)
  }
}

export function generateWid (groupId, phone) {
  return groupId ? groupId + '@g.us' : phone + '@c.us'
}

function initWhatsappClient () {
  if (!global.clients) {
    global.clients = {}
  }
}
