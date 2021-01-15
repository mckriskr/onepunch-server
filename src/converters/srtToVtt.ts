import fs from 'fs'
import {parse, map, filter, stringify} from 'subtitle'
import * as U from '../utils'
import type {ReadStreamType, WriteStreamType} from './types'

export const srtToVtt = (
  inputStream: ReadStreamType,
  outputStream: WriteStreamType
) => {
  inputStream
    .pipe(parse())
    .pipe(filter((node) => node.type === 'cue' && node.data.text.length > 0))
    .pipe(
      map((node) => {
        if (node.type === 'cue') {
          //console.log(node.data.text)
        }

        return node
      })
    )
    .pipe(stringify({format: 'WebVTT'}))
    .pipe(outputStream)
}
