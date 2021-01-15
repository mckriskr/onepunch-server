import path from 'path'

export const getFileExtension = path.extname

export const renameExtension = (filepath: string, ext: string) => {
  const lastDot = filepath.lastIndexOf('.')
  const newName = [filepath.substr(0, lastDot), ext].join('')
  //console.log('newName', newName)
  return newName
}
