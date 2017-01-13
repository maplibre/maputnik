import React from 'react'
import { saveAs } from 'file-saver'

import GlSpec from 'mapbox-gl-style-spec/reference/latest.js'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import Button from '../Button'
import Modal from './Modal'
import MdFileDownload from 'react-icons/lib/md/file-download'
import formatStyle from 'mapbox-gl-style-spec/lib/format'
import GitHub from 'github-api'


class Gist extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {}
  }

  onSave() {
    this.setState({
      saving: true
    });
    const mapStyleStr = formatStyle(this.props.mapStyle);
    const styleTitle = this.props.mapStyle.name || 'Style';
    const htmlStr = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>`+styleTitle+` Preview</title>
    <link rel="stylesheet" type="text/css" href="https://api.mapbox.com/mapbox-gl-js/v0.28.0/mapbox-gl.css" />
    <script src="https://api.mapbox.com/mapbox-gl-js/v0.28.0/mapbox-gl.js"></script>
    <style>
      body { margin:0; padding:0; }
      #map { position:absolute; top:0; bottom:0; width:100%; }
    </style>
  </head>
  <body>
    <div id='map'></div>
    <script>
        var map = new mapboxgl.Map({
          container: 'map',
          style: 'style.json',
          attributionControl: true,
          hash: true
        });
        map.addControl(new mapboxgl.NavigationControl());
    </script>
  </body>
  </html>
`
    const gh = new GitHub();
    let gist = gh.getGist(); // not a gist yet
    gist.create({
      public: true,
      description: styleTitle + 'Preview',
      files: {
        "style.json": {
          content: mapStyleStr
        },
        "index.html": {
          content: htmlStr
        }
      }
    }).then(function({data}) {
      return gist.read();
    }).then(function({data}) {
      this.setState({
        latestGist: data
      });
    }.bind(this));
  }

  renderLatestGist() {
    const gist = this.state.latestGist;
    const saving = this.state.saving;
    if(gist) {
      const user = gist.user || 'anonymous';
      return <p>
        Latest saved gist:{' '}
        <a target="_blank" href={"https://bl.ocks.org/"+user+"/"+gist.id}>Preview</a>,{' '}
        <a target="_blank" href={"https://gist.github.com/"+user+"/"+gist.id}>Source</a>
      </p>
    } else if(saving) {
      return <p>Saving...</p>
    }
  }

  render() {
    return <div>
      <Button onClick={this.onSave.bind(this)}>
        <MdFileDownload />
        Save to Gist (anonymous)
      </Button>
      {this.renderLatestGist()}
    </div>
  }
}

function stripAccessTokens(mapStyle) {
  const changedMetadata = { ...mapStyle.metadata }
  delete changedMetadata['maputnik:mapbox_access_token']
  delete changedMetadata['maputnik:openmaptiles_access_token']
  return {
    ...mapStyle,
    metadata: changedMetadata
  }
}

class ExportModal extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    onOpenToggle: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  downloadStyle() {
    const blob = new Blob([formatStyle(stripAccessTokens(this.props.mapStyle))], {type: "application/json;charset=utf-8"});
    saveAs(blob, this.props.mapStyle.id + ".json");
  }

  render() {
    return <Modal
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Export Style'}
    >

      <div className="maputnik-modal-section">
        <h4>Download Style</h4>
        <p>
          Download a JSON style to your computer.
        </p>
        <Button onClick={this.downloadStyle.bind(this)}>
          <MdFileDownload />
          Download
        </Button>
      </div>

      <div className="maputnik-modal-section">
        <h4>Save style</h4>
        <Gist mapStyle={this.props.mapStyle} />
      </div>
    </Modal>
  }
}

export default ExportModal
