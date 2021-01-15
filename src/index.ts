import {createServer} from 'http'
import type {IncomingMessage} from 'http'
import * as ENV from 'dotenv'
import * as S from './server'
import type {Socket} from 'net'

import * as M from './mongodb'
import * as R from './routers'
import * as U from './utils'
import fs, {fstat} from 'fs'

//import Converter from 'subtitle-convert'

const {parsed} = ENV.config()
const config = parsed as any
//console.log(config)

M.connect(config.mongodbUrl)
  .then(run)
  .catch((e: Error) => console.log('error', e.message))

async function run(client: M.MongoClient) {
  const app = S.createExpressServer(),
    port = 4000
  const db = client.db(config.mongodbName)
  app
    .get('/', (req, res) => {
      res.json({message: 'Hello world'})
    })
    .use(R.authRouter(client))
    .use(R.streamRouter(client, db))
    .use(R.uploadFilesRouter(client, db))
    .use('/profile', R.profileRouter(client))

  const server = createServer(app)
  const wss = S.createWsServer() // web socket server

  server.on(
    'upgrade',
    (request: IncomingMessage, socket: Socket, head: Buffer) => {
      //console.log('upgrade')

      wss.handleUpgrade(request, socket, head, function (ws) {
        ws.emit('connection', ws, request)
      })
    }
  )

  wss.on('connection', (ws, request) => {
    //console.log('connection')
    ws.on('message', function (message) {
      //console.log(`message`, message)
      ws.send(JSON.stringify({response: 'OK'}))
    })
    ws.on('close', function () {
      //console.log('close')
    })
  })

  server.listen(port, () => {
    console.log(`http server start listening at http://localhost:${port}`)
    console.log(`ws server start listening at ws://localhost:${port}`)
  })
}
