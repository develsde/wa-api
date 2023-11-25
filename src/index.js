import { config } from 'dotenv'

import { initWebService } from './web-service.js'

config()

async function bootstrap () {
  initWebService()
}

bootstrap()
