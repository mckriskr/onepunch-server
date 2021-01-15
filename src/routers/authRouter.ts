import express, {Router} from 'express'
import fs from 'fs'
import path from 'path'

import * as U from '../utils'
import * as M from '../mongodb'
import * as C from '../config'

export const authRouter = (client: M.MongoClient) => {
  const router = Router()
  router.post('/login', async (req, res: express.Response) => {
    const {email, password} = req.body
    const jwt = await U.jwtSign({email, password}, {expiresIn: '1d'})
    res.json({jwt, email, password})
  })
  router.post('/signup', async (req, res: express.Response) => {
    const {name, email, password} = req.body
    const jwt = await U.jwtSign({email, password}, {expiresIn: '1d'})
    res.json({jwt, name, email, password})
  })
  router.post('/logout', async (req, res) => {})
  return router
}
