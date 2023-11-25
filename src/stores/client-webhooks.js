export function setClientWebhooks (clientId, webhookUrls) {
  initClientWebhooks()

  global.webhook[clientId] = webhookUrls
}

function initClientWebhooks () {
  if (!global.webhook) {
    global.webhook = {}
  }
}
