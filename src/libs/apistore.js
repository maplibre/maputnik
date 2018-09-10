import style from './style.js'
import ReconnectingWebSocket from 'reconnecting-websocket'

const host = 'localhost'
const port = '8000'
const localUrl = `http://${host}:${port}`
const websocketUrl = `ws://${host}:${port}/ws`


export class ApiStyleStore {
  constructor(opts) {
    this.onLocalStyleChange = opts.onLocalStyleChange || (() => {})
  }

  init(cb) {
    fetch(localUrl + '/styles', {
      mode: 'cors',
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(body) {
      const styleIds = body;
      this.latestStyleId = styleIds[0]
      this.notifyLocalChanges()
      cb(null)
    })
    .catch(function() {
      cb(new Error('Can not connect to style API'))
    })
  }

  notifyLocalChanges() {
    const connection = new ReconnectingWebSocket(websocketUrl)
    connection.onmessage = e => {
      if(!e.data) return
      console.log('Received style update from API')
      let parsedStyle = style.emptyStyle
      try {
        parsedStyle = JSON.parse(e.data)
      } catch(err) {
        console.error(err)
      }
      const updatedStyle = style.ensureStyleValidity(parsedStyle)
      this.onLocalStyleChange(updatedStyle)
    }
  }

  latestStyle(cb) {
    if(this.latestStyleId) {
      fetch(localUrl + '/styles/' + this.latestStyleId, {
        mode: 'cors',
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(body) {
        cb(style.ensureStyleValidity(body))
      })
    } else {
      throw new Error('No latest style available. You need to init the api backend first.')
    }
  }

  // Save current style replacing previous version
  save(mapStyle) {
    const id = mapStyle.id
    fetch(localUrl + '/styles/' + id, {
      method: "PUT",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(mapStyle)
    })
    .catch(function(error) {
      if(error) console.error(error)
    })
    return mapStyle
  }
}
