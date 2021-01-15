import util from 'util'
import fs from 'fs'
import {ReadStream, WriteStream} from 'fs'
import {GridFSBucketReadStream, GridFSBucketWriteStream} from 'mongodb'
import express from 'express'

export const writeStream = (
  srcStream: ReadStream | GridFSBucketReadStream,
  dstStream: WriteStream | GridFSBucketWriteStream | express.Response
): Promise<boolean> =>
  new Promise<boolean>((resolve, reject) => {
    //console.log('enter', srcStream, dstStream)
    dstStream
      .once('finish', () => {
        //console.log('finish')
        resolve(true)
      })
      .on('error', (e: Error) => {
        console.log('err', e.message)
        resolve(false)
      })

    srcStream.pipe(dstStream)
    //console.log('leave')
  })
