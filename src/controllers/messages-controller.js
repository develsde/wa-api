import { generateMedia, generateWid, getWhatsappClient } from '../stores/whatsapp-client.js'

export async function sendMessage ({ body: { phone, message, groupId, clientId, media } }, res) {
  try {
    const client = getWhatsappClient(clientId)

    await validate(client)

    const wid = generateWid(groupId, phone)

    const options = {
      media: await generateMedia(media)
    }

    const responseMessage = await client.sendMessage(wid, message, options)
 
    res.send(responseMessage)
  } catch (error) {
    handleErrorResponse(res, error)
  }
}

async function validate (client) {
  if (!client) throw Error('client_not_found')

  const state = await client.getState()
  if (!state) throw Error('client_is_not_ready')
}

function handleErrorResponse (res, error) {
  console.error('error', error)

  if (error.message === 'client_not_found') {
    return res.status(404).send('Client ID not found, please register before!')
  }

  if (error.message === 'client_is_not_ready') {
    return res.status(503).send('Send message is not ready, please try later!')
  }

  res.status(403).send(error.message)
}
