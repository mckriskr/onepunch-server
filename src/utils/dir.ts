import util from 'util'
import fs from 'fs'
import path from 'path'

export const readdir = util.promisify(fs.readdir)
