import fs from 'fs'
import {parse, resync, stringify} from 'subtitle'
import * as U from './utils'
import type {IWaveFileHeader} from './utils'
import * as C from './converters'

C.ffprobe('../uploads/3.mp4')
  .then((data) => console.log(data))
  .catch((e) => console.log('e', e.message))
//C.movieToMp4()
// ffmpeg -i ./The.Mandalorian.S02E04.2160p.WEB-DL.DDP5.1.Atmos.DV.HEVC-MZABI.mp4 -ac 1 ./The.Mandalorian.S02E04.2160p.WEB-DL.DDP5.1.Atmos.DV.HEVC-MZABI.wav
