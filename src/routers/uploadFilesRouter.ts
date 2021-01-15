import express, {Router} from 'express'
import path from 'path'
import fs from 'fs'
import * as U from '../utils'
import * as M from '../mongodb'
import * as C from '../converters'
import multer from 'multer'

const upload = multer({dest: 'uploads/'})

export type UploadFileType = Express.Multer.File

export const uploadFilesRouter = (client: M.MongoClient, db: M.Db) => {
  const router = Router()
  //router.use(U.authenticate())
  return router.use(upload.any()).post('/upload', async (req, res) => {
    try {
      const {fields} = req
      const files = req.files
      if (!files) {
        res.json({result: 'fail', error: 'no files'})
        return
      }
      console.log('fields', fields)
      const renamePromises = (files as UploadFileType[]).map((file) => {
        const {originalname, destination, path: filepath} = file
        //console.log('file', file)
        return U.rename(filepath, path.join(destination, originalname))
      })
      await renamePromises

      const uploadToGridFS = (files as any[]).map((file) => {
        console.log(file)
        const {originalname, destination, path: filepath} = file

        const source = path.join(destination, originalname)
        //path.join(process.cwd(), filepath)
        console.log(source)
        //return U.exists(source)

        const bucket = M.createBucket(db)

        const readStream = fs.createReadStream(source)
        const uploadStream = bucket.openUploadStream(originalname)
        const id = uploadStream.id as M.ObjectID

        return U.writeStream(readStream, uploadStream)
      })
      const result = await uploadToGridFS

      res.json({result})
    } catch (e) {
      res.json({result: 'fail', error: e.message})
    }
  }) // router.use() end
}
