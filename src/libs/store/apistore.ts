import style from "../style";
import {format} from "@maplibre/maplibre-gl-style-spec";
import ReconnectingWebSocket from "reconnecting-websocket";
import type {IStyleStore, OnStyleChangedCallback, StyleSpecificationWithId} from "../definitions";

export type ApiStyleStoreOptions = {
  onLocalStyleChange?: OnStyleChangedCallback
};

export class ApiStyleStore implements IStyleStore {

  localUrl: string;
  websocketUrl: string;
  latestStyleId: string | undefined = undefined;
  onLocalStyleChange: OnStyleChangedCallback;

  constructor(opts: ApiStyleStoreOptions) {
    this.onLocalStyleChange = opts.onLocalStyleChange || (() => {});
    const port = window.location.port;
    const host = "localhost";
    this.localUrl = `http://${host}:${port}`;
    this.websocketUrl = `ws://${host}:${port}/ws`;
    this.init = this.init.bind(this);
  }

  async init(): Promise<void> {
    try {
      const response = await fetch(this.localUrl + "/styles", {mode: "cors"});
      const body = await response.json();
      const styleIds = body;
      this.latestStyleId = styleIds[0];
      this.notifyLocalChanges();
    } catch {
      throw new Error("Can not connect to style API");
    }
  }

  notifyLocalChanges() {
    const connection = new ReconnectingWebSocket(this.websocketUrl);
    connection.onmessage = e => {
      if(!e.data) return;
      console.log("Received style update from API");
      let parsedStyle = style.emptyStyle;
      try {
        parsedStyle = JSON.parse(e.data);
      } catch(err) {
        console.error(err);
      }
      const updatedStyle = style.ensureStyleValidity(parsedStyle);
      this.onLocalStyleChange(updatedStyle);
    };
  }

  async getLatestStyle(): Promise<StyleSpecificationWithId> {
    if(this.latestStyleId) {
      const response = await fetch(this.localUrl + "/styles/" + this.latestStyleId, {
        mode: "cors",
      });
      const body = await response.json();
      return style.ensureStyleValidity(body);
    } else {
      throw new Error("No latest style available. You need to init the api backend first.");
    }
  }

  // Save current style replacing previous version
  save(mapStyle: StyleSpecificationWithId) {
    const styleJSON = format(
      style.stripAccessTokens(
        style.replaceAccessTokens(mapStyle)
      )
    );

    const id = mapStyle.id;
    fetch(this.localUrl + "/styles/" + id, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: styleJSON
    })
      .catch(function(error) {
        if(error) console.error(error);
      });
    return mapStyle;
  }
}
