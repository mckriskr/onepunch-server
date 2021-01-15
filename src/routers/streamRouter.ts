import express, {Router} from 'express'
import {ObjectID} from 'mongodb'
import fs from 'fs'
import path from 'path'
import {parse, map, filter, stringify} from 'subtitle'

import * as U from '../utils'
import * as M from '../mongodb'
import * as C from '../config'
import * as D from '../data'
import type {IWaveFileHeader} from '../utils'

/*

app.get("/video", function (req, res) {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  // get video stats (about 61MB)
  const videoPath = "bigbuck.mp4";
  const videoSize = fs.statSync("bigbuck.mp4").size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});
*/
export const streamRouter = (client: M.MongoClient, db: M.Db) => {
  const router = Router()
  //router.use(U.authenticate())
  router.get('/stream2', async (req, res: express.Response) => {
    const source = path.join(C.getAssetsDir(), 'full.wav')
    const readStream = fs.createReadStream(source)
    await U.writeStream(readStream, res)
    console.log('download finish')
  })
  router
    .get('/list', async (req, res) => {
      const files = await db.collection('fs.files')
      //console.log('files', files)
      const result = await files.find({})
      //console.log('result', result)
      const array = await result.toArray()
      //console.log('array', array)
      res.json({response: 'OK', files: array})
    })
    .get('/get_mp4/:_id', async (req, res) => {
      console.log('start----------------------------------')
      const {_id} = req.params
      console.log('/get_mp4: _id', _id)
      if (!_id) {
        res.json({error: `${_id} not found in db`})
        return
      }
      const id = new ObjectID(_id)
      const video = await db.collection('fs.files').findOne({_id: id})
      if (!video) {
        console.log('err3')
        res.status(404).json({error: 'No video found!'})
        return
      }
      console.log('video', video)

      const ignore = false

      if (!ignore && req.headers && req.headers.range) {
        console.log('req.headers.range', req.headers.range)
        const id = new ObjectID(_id)
        const bucket = M.createBucket(db)

        const gridfs = true
        console.log('gridfs', gridfs)
        if (!gridfs) {
          const videoPath = `${video.filename}.mp4`
          let fileExists = await U.exists(videoPath)
          console.log('fileExists', fileExists)
          if (!fileExists) {
            const inputStream = bucket.openDownloadStream(id)
            const writeStream = fs.createWriteStream(videoPath)
            await U.writeStream(inputStream, writeStream)
            fileExists = await U.exists(videoPath)
            console.log('file creation success.')
          }

          const videoSize = await U.getFileSize(videoPath)
          console.log('videoSize', videoSize)
          //const CHUNK_SIZE = video.chunkSize
          const CHUNK_SIZE = 10 ** 6 // 1MB

          const start = Number(req.headers.range.replace(/\D/g, ''))
          const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
          const contentLength = end - start + 1
          console.log('start', start, 'end', end)
          const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4'
          }
          res.writeHead(206, headers)
          console.log('header', headers)
          res.status(200)
          const videoStream = fs.createReadStream(videoPath, {start, end})
          await U.writeStream(videoStream, res)
          console.log('end--------------------------------------')
        } else {
          const videoSize = video.length
          console.log('videoSize', videoSize)
          const CHUNK_SIZE = video.chunkSize
          const start = Number(req.headers.range.replace(/\D/g, ''))
          const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
          const contentLength = end - start + 1
          console.log('start', start, 'end', end)
          const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4'
          }
          res.writeHead(206, headers)
          console.log('header', headers)
          const videoStream = bucket.openDownloadStream(id, {
            start,
            end: end + 1 // gridfs bug! https://jira.mongodb.org/browse/NODE-2050
          })

          res.status(200)

          await U.writeStream(videoStream, res)
          console.log('end--------------------------------------')
        }
      } else {
        const bucket = M.createBucket(db)
        const inputStream = bucket.openDownloadStream(id)
        await U.writeStream(inputStream, res)
      }
    })
    .get('/getFile/:_id', async (req, res) => {
      console.log('-------------------------------')
      const videoPath = 'bigbuck.mp4'
      const videoSize = fs.statSync('bigbuck.mp4').size
      console.log('videoSize', videoSize)
      const CHUNK_SIZE = 10 ** 6 // 1MB
      if (req && req.headers && req.headers.range) {
        const start = Number(req.headers.range.replace(/\D/g, ''))
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
        const contentLength = end - start + 1
        console.log('start', start, 'end', end)
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${videoSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': contentLength,
          'Content-Type': 'video/mp4'
        }
        res.writeHead(206, headers)

        // create video read stream for this particular chunk
        const videoStream = fs.createReadStream(videoPath, {start, end})

        // Stream the video chunk to the client
        //videoStream.pipe(res)
        await U.writeStream(videoStream, res)
      }
      /*
      const range = req.headers.range
      console.log('range', range)
      if (range) {
        const {_id} = req.params
        if (_id) {
          const id = new ObjectID(_id)
          const video = await db.collection('fs.files').findOne({_id: id})
          if (video) {
            const videoSize = video.length
            const CHUNK_SIZE = 10 ** 6 // 1MB
            const start = Number(range.replace(/\D/g, ''))
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
            console.log('start', start, 'end', end)

            const contentLength = end - start + 1
            console.log('contentLength', contentLength)
            const headers = {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: 0,
              'Content-Range': `bytes ${start}-${end}/${videoSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': contentLength,
              'Content-Type': 'video/mp4'
            }
            res.writeHead(206, headers)

            const bucket = M.createBucket(db)
            const inputStream = bucket.openDownloadStream(id, {start, end})
            U.writeStream(inputStream, res)
          }
        }
      }
      */
      return
      /*
      if (!range) {
        console.log('err1')
        res.status(400).send('Requires Range header')
        return
      }
      const {_id} = req.params
      if (!_id) {
        console.log('err2')
        res.json({error: `${_id} not found in db`})
        return
      }
      return
      */
      /*
      range bytes=0-
videoSize 63614462
start 0 end 1000000
contentLength 1000001
range bytes=1000001-
videoSize 63614462
start 1000001 end 2000001
contentLength 1000001
range bytes=2000002-
videoSize 63614462
start 2000002 end 3000002
contentLength 1000001
range bytes=3000003-
videoSize 63614462
start 3000003 end 4000003
contentLength 1000001
range bytes=4000004-
videoSize 63614462
start 4000004 end 5000004
contentLength 1000001
range bytes=5000005-
videoSize 63614462
start 5000005 end 6000005
contentLength 1000001
range bytes=6000006-
videoSize 63614462
start 6000006 end 7000006
contentLength 1000001
range bytes=7000007-
videoSize 63614462
start 7000007 end 8000007
contentLength 1000001
range bytes=8000008-
videoSize 63614462
start 8000008 end 9000008
contentLength 1000001
range bytes=9000009-
videoSize 63614462
start 9000009 end 10000009
contentLength 1000001

*/
      /*
      const id = new ObjectID(_id)
      const video = await db.collection('fs.files').findOne({_id: id})
      if (!video) {
        console.log('err3')
        res.status(404).json({error: 'No video uploaded!'})
        return
      }
      //console.log('video', video)

      const videoSize = video.length
      console.log('videoSize', videoSize)
      const bucket = M.createBucket(db)
      //console.log('1')
      // Parse Range
      // Example: "bytes=32324-"
      const CHUNK_SIZE = 10 ** 6 // 1MB
      const start = Number(range.replace(/\D/g, ''))
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
      console.log('start', start, 'end', end)
      // Create headers
      const contentLength = end - start + 1
      console.log('contentLength', contentLength)
      const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
      }

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers)

      const inputStream = bucket.openDownloadStream(id, {start, end})
      //console.log('2')

      await U.writeStream(inputStream, res)
      //U.writeStream(inputStream, res)
      //console.log('here')
      */
      console.log('-------------------------------')
    })
    .get('/getVTT/:_id', async (req, res) => {
      try {
        const {_id} = req.params
        //console.log('/getVTT: _id', _id)
        if (!_id) {
          res.json({error: `${_id} not found in db`})
          return
        }
        const id = new ObjectID(_id)
        const bucket = M.createBucket(db)
        const inputStream = bucket.openDownloadStream(id)
        const filename = `./${D.randomId()}.vtt`
        //const filename = path.join(C.getOnePunchMainDir(), 'test.wav')
        const writeStream = fs.createWriteStream(filename)
        await U.writeStream(inputStream, writeStream)

        const json: D.IWebVTTNodeData[] = []

        const readStream = fs.createReadStream(filename)

        readStream
          .pipe(parse())
          .on('data', (node) => {
            //console.log('parsed node:', node)
            if (node.type == 'cue') {
              const {
                start,
                end,
                text
              } = (node.data as unknown) as D.IWebVTTNodeData
              const n = {start: start / 1000, end: end / 1000, text}
              json.push(n)
            }
          })
          .on('error', console.error)
          .on('finish', () => {
            //console.log('parser has finished', json)
            res.json(json)
          })

        /*
          .pipe(filter((node) => node.type === 'cue'))
          .pipe(map(({data}) => data as D.IWebVTTNodeData))
          .pipe(
            map((data, index) => {
              //console.log(index, data)
              const {start, end, text} = (data as unknown) as D.IWebVTTNodeData
              const n = {start: start / 1000, end: end / 1000, text}
              json.push(n)
              return data
            })
          )
          */
      } catch (e) {
        console.log('/getVTT/:id err', e.message)
      }
    })
    .get('/getHeader/:_id', async (req, res) => {
      try {
        const {_id} = req.params
        //console.log('/getHeader: _id', _id)
        if (!_id) {
          res.json({error: `${_id} not found in db`})
          return
        }
        const id = new ObjectID(_id)
        const bucket = M.createBucket(db)
        const inputStream = bucket.openDownloadStream(id)
        const filename = `./${D.randomId()}.wav`
        //const filename = path.join(C.getOnePunchMainDir(), 'test.wav')
        const writeStream = fs.createWriteStream(filename)

        await U.writeStream(inputStream, writeStream)
        const header = await U.getWavHeader(filename)
        await U.unlink(filename)
        res.json(header)
      } catch (e) {
        console.log('/waveHeader/:id err', e.message)
      }
    })

  return router
}
