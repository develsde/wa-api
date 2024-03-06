import express from 'express'
import { logging } from '../middlewares/logging-middleware.js'
import { auth } from '../middlewares/auth-middleware.js'
import { sendMessage } from '../controllers/messages-controller.js'
import { getQR, register } from '../controllers/auth-controller.js'

export function initWebService () {
  const app = express()

  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))
  app.use([logging, auth])

  const port = 3035

  app.get('/', (req, res) => {
    res.send('Whatsapp API')
  })

  app.post('/v1/messages', sendMessage)

  app.post('/v1/register', register)

  app.get('/v1/qr', getQR)

  app.post('/test-webhook', (req, res) => {
    console.log('req', req.body)
    console.log('contact', req.body.data.chat.contact)
    res.send('ok')
  })

  app.listen(port, () => {
    console.log(`Berjalan Pada Port ${port}`)
  })
}
