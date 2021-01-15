import {ReadStream, WriteStream} from 'fs'
import {GridFSBucketReadStream, GridFSBucketWriteStream} from 'mongodb'
import express from 'express'

export type ReadStreamType = ReadStream | GridFSBucketReadStream
export type WriteStreamType =
  | WriteStream
  | GridFSBucketWriteStream
  | express.Response
