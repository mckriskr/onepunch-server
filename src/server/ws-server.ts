import WebSocket from 'ws'

export const createWsServer = () => {
  return new WebSocket.Server({clientTracking: false, noServer: true})
}