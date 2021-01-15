import path from 'path'

export const getOnePunchMainDir = (delim:string = '/') => {
  const dir = path.resolve(__dirname)
  .split(delim)
  .reverse()
  .filter((notUsed, index) => index > 2 )
  .reverse()
  .join(delim)
  //console.log('dir', dir)
  return dir
}

export const getAssetsDir = () => {
  return path.join(getOnePunchMainDir(), 'assets')
}