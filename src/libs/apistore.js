import style from './style.js'
import {format} from '@mapbox/mapbox-gl-style-spec'
import ReconnectingWebSocket from 'reconnecting-websocket'

export class ApiStyleStore {

  constructor(opts) {
    this.onLocalStyleChange = opts.onLocalStyleChange || (() => {})
    const port = opts.port || '8000'
    const host = opts.host || 'localhost'
    this.localUrl = `http://${host}:${port}`
    this.websocketUrl = `ws://${host}:${port}/ws`
    this.init = this.init.bind(this)
  }

  init(cb) {
    fetch(this.localUrl + '/styles', {
      mode: 'cors',
    })
    .then((response) =>  {
      return response.json();
    })
    .then((body) => {
      const styleIds = body;
      this.latestStyleId = styleIds[0]
      this.notifyLocalChanges()
      cb(null)
    })
    .catch(function(e) {
      cb(new Error('Can not connect to style API'))
    })
  }

  notifyLocalChanges() {
    const connection = new ReconnectingWebSocket(this.websocketUrl)
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
      fetch(this.localUrl + '/styles/' + this.latestStyleId, {
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
    const styleJSON = format(
      style.stripAccessTokens(
        style.replaceAccessTokens(mapStyle)
      )
    );

    const id = mapStyle.id
    fetch(this.localUrl + '/styles/' + id, {
      method: "PUT",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: styleJSON
    })
    .catch(function(error) {
      if(error) console.error(error)
    })
    return mapStyle
  }
}
