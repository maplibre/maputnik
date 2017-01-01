import request from 'request'
import style from './style.js'
import ReconnectingWebSocket from 'reconnecting-websocket'

const host = 'localhost'
const port = '8000'
const localUrl = `http://${host}:${port}`
const websocketUrl = `ws://${host}:${port}/ws`

console.log(localUrl, websocketUrl)

export class ApiStyleStore {
  constructor(opts) {
    if(opts.onLocalStyleChange) {
      const connection = new ReconnectingWebSocket(websocketUrl)
      connection.onmessage = function(e) {
        if(!e.data) return
        try {
          console.log('Received style update from API')
          const updatedStyle = style.ensureStyleValidity(JSON.parse(e.data))
          opts.onLocalStyleChange(updatedStyle)
        } catch(err) {
          console.error('Cannot parse local file ' + e.data)
        }
      }
    }
  }

  supported(cb) {
    request(localUrl + '/styles', (error, response, body) => {
      cb(error === null)
    })
  }

  latestStyle(cb) {
    if(this.latestStyleId) {
      request(localUrl + '/styles/' + this.latestStyleId, (error, response, body) => {
        cb(JSON.parse(body))
      })
    } else {
      request(localUrl + '/styles', (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const styleIds = JSON.parse(body);
          this.latestStyleId = styleIds[0];
          request(localUrl + '/styles/' + this.latestStyleId, (error, response, body) => {
            cb(style.ensureStyleValidity(JSON.parse(body)))
          })
        }
      })
    }
  }

  // Save current style replacing previous version
  save(mapStyle) {
    const id = mapStyle.id
    request.put({
      url: localUrl + '/styles/' + id,
      json: true,
      body: mapStyle
    }, (error, response, body) => {
     console.log('Saved style');
    })
    return mapStyle
  }
}
