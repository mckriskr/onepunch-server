import Ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs'
import * as U from '../utils'

export const ffprobe = (filename: string) =>
  new Promise((resolve, reject) => {
    Ffmpeg.ffprobe(filename, (err, data: Ffmpeg.FfprobeData) => {
      err ? reject(err) : resolve(data)
    })
  })

const convert = (inputFilename: string, outputFilename: string) =>
  new Promise((resolve, reject) => {
    const outStream = fs.createWriteStream(outputFilename)
    outStream
      .on('finish', () => {
        console.log('outstream finish')
        resolve(1)
      })
      .on('error', (e) => {
        console.log('hereerror', e.message)
        reject(e)
      })
    const r = Ffmpeg(inputFilename)
      .videoCodec('libx264')
      .withAudioCodec('aac')
      .audioChannels(1)
      .format('mpeg4')
      .size('50%')
      .on('end', () => {
        //resolve(true)
        console.log('file has been converted succesfully')
      })
      .on('error', (err) => {
        console.log('an error happened: ' + err.message)
        reject(err)
      })
      //.save(outputFilename)
      .pipe(outStream)
  })

export const movieToMp4 = async () => {
  Ffmpeg.getAvailableFormats(function (err, formats) {
    console.log('Available formats:')
    console.dir(formats)
  })
  return

  Ffmpeg.getAvailableCodecs(function (err, codecs) {
    console.log('Available codecs:')
    console.dir(codecs)
  })

  Ffmpeg.getAvailableEncoders(function (err, encoders) {
    console.log('Available encoders:')
    console.dir(encoders)
  })

  Ffmpeg.getAvailableFilters(function (err, filters) {
    console.log('Available filters:')
    console.dir(filters)
  })
  return
  try {
    const names = await U.readdir('../uploads')
    const movies = names.filter((name) => {
      const ext = U.getFileExtension(name).toLowerCase()
      return ext == '.mp4'
    })
    //console.log('names', names)
    console.log('moves', movies)
    const r = await movies.map((_source) => {
      const source = path.join('../uploads', _source)
      return convert(source, '../1.mp4')
    })
    console.log('r', r)
  } catch (e) {
    console.log('movieToMp4.error', e.message)
  }
}
