import fs from 'fs'
import {parse, map, filter, parseTimestamp, formatTimestamp} from 'subtitle'
import * as U from './utils'

type IWebVTTNodeData = {
  start: number
  end: number
  text: string
}

fs.createReadStream('./assets/1.vtt', 'utf-8')
  .pipe(parse())
  .pipe(filter((node) => node.type === 'cue'))
  .pipe(map(({data}) => data as IWebVTTNodeData))
  .pipe(
    map((data, index) => {
      //console.log(index, data)
      const {start, end, text} = (data as unknown) as IWebVTTNodeData
      return {start: start / 1000, end: end / 1000, text}
    })
  )
//.pipe(outputStream)
