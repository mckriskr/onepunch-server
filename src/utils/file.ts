import util from 'util'
import fs from 'fs'
import path from 'path'
// npm i text-encoding
// npm i -D @types/text-encoding
import {TextDecoder, TextEncoder} from 'text-encoding'

export const stat = util.promisify(fs.stat)
export const getFileSize = (filename: string) =>
  new Promise<number>((resolve, reject) => {
    stat(filename)
      .then(({size}) => resolve(size))
      .catch(reject)
  })
export const exists = util.promisify(fs.exists)

export const open = util.promisify(fs.open)
export const openForRead = (filename: string) => open(filename, 'r', 0o666)
export const openForWrite = (filename: string) => open(filename, 'w')
export const openForAppend = (filename: string) => open(filename, 'a')

export const read = util.promisify(fs.read)

export type ReadResult = {
  bytesRead: number
  buffer: Uint8Array
}
export const readUsingBuffer = (
  fd: number,
  bufferSize: number,
  offset: number
) =>
  new Promise<ReadResult>((resolve, reject) => {
    const buffer = new Uint8Array(bufferSize)
    read(fd, buffer, offset, bufferSize, null).then(resolve).catch(reject)
  })
export const Uint8ArrayToString = (buffer: Uint8Array) =>
  new TextDecoder('utf-8').decode(buffer)

export const close = util.promisify(fs.close)

export type WriteResult = {
  written: number
  buffer: Uint8Array
}
export const write = util.promisify(fs.write)

export const writeText = (fd: number, text: string, offset: number) =>
  new Promise<WriteResult>((resolve, reject) => {
    const buffer = new TextEncoder('utf-8').encode(text)

    write(fd, buffer, offset)
      .then((result: unknown) => {
        resolve(result as WriteResult)
      })
      .catch(reject)
  })

export const unlink = util.promisify(fs.unlink)
export const deleteFile = unlink

export const readTest = async () => {
  const filename = path.resolve(__dirname, 'dir.ts')

  try {
    const fileSize = await getFileSize(filename)
    const fd = await openForRead(filename)
    const {bytesRead, buffer} = await readUsingBuffer(fd, fileSize, 0)
    const str = Uint8ArrayToString(buffer)
    console.log('fileSize', fileSize, 'bytesRead', bytesRead)
    console.log(str)
  } catch (e) {
    console.log('error', e.message)
  }
}
export const rename = util.promisify(fs.rename)

export const writeTextTest = async () => {
  const filename = path.resolve(__dirname, 'test.ts')
  try {
    const fd = await openForAppend(filename)
    let {written, buffer} = await writeText(fd, 'Hello world!', 0)
    await writeText(fd, '\nHi Tom!', written)
    await close(fd)
  } catch (e) {
    console.log('err', e.message)
  }
}

export const readFile = util.promisify(fs.readFile)
export const writeFile = util.promisify(fs.writeFile)

export const test = async () => {
  try {
    const filename = path.resolve(__dirname, 'test.ts')
    const result = await unlink(filename)
    console.log(result)
  } catch (e) {
    console.log(e.message)
  }
}
