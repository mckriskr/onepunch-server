import fs from 'fs'
import {parse, resync, stringify} from 'subtitle'
import * as U from './utils'
import type {IWaveFileHeader} from './utils'
/*
ffmpeg -i SampleVideo_360x240_1mb.mp4 SampleVideo_360x240_1mb.wav
ffmpeg -i ./man-s2-e2.mp4 -ac 1 ./man-s2-e2-mono.wav
fs.createReadStream('./assets/1.srt', 'utf-8')
  .pipe(parse())
  .pipe(resync(-100))
  .pipe(stringify({format: 'WebVTT'}))
  .pipe(fs.createWriteStream('./assets/my-subtitles.vtt'))
*/
U.getWavHeader('./assets/1.wav')
  .then((header: IWaveFileHeader) =>
    console.log(JSON.stringify(header, null, 2))
  )
  .catch((e: Error) => console.log('err', e.message))
/*
fs.createReadStream('./my-subtitles.srt')
  .pipe(parse())
  .pipe(resync(-100))
  .pipe(stringify({format: 'WebVTT'}))
  .pipe(fs.createWriteStream('./my-subtitles.vtt'))
*/
