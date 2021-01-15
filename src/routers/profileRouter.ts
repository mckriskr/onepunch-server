import express, {Router} from 'express'
import fs from 'fs'
import path from 'path'

import * as U from '../utils'
import * as M from '../mongodb'
import * as C from '../config'

export const profileRouter = (client: M.MongoClient) => {
  const router = Router()
  router.use(U.authenticate())
  router.get('/', async (req, res: express.Response) => {
    res.json({response: 'OK'})
  })
  return router
}
