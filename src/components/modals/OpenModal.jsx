import React from 'react'
import PropTypes from 'prop-types'
import LoadingModal from './LoadingModal'
import Modal from './Modal'
import Button from '../Button'
import FileReaderInput from 'react-file-reader-input'

import {MdFileUpload} from 'react-icons/md'
import {MdAddCircleOutline} from 'react-icons/md'

import style from '../../libs/style.js'
import publicStyles from '../../config/styles.json'

class PublicStyle extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  render() {
    return <div className="maputnik-public-style">
      <Button
        className="maputnik-public-style-button"
        aria-label={this.props.title}
        onClick={() => this.props.onSelect(this.props.url)}
      >
        <header className="maputnik-public-style-header">
          <h4>{this.props.title}</h4>
          <span className="maputnik-space" />
          <MdAddCircleOutline />
        </header>
        <div
          className="maputnik-public-style-thumbnail"
          style={{
            backgroundImage: `url(${this.props.thumbnailUrl})`
          }}
        ></div>
      </Button>
    </div>
  }
}

class OpenModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
    onStyleOpen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      styleUrl: ""
    };
  }

  clearError() {
    this.setState({
      error: null
    })
  }

  onCancelActiveRequest(e) {
    // Else the click propagates to the underlying modal
    if(e) e.stopPropagation();

    if(this.state.activeRequest) {
      this.state.activeRequest.abort();
      this.setState({
        activeRequest: null,
        activeRequestUrl: null
      });
    }
  }

  onStyleSelect = (styleUrl) => {
    this.clearError();

    let canceled;

    const activeRequest = fetch(styleUrl, {
      mode: 'cors',
      credentials: "same-origin"
    })
    .then(function(response) {
      return response.json();
    })
    .then((body) => {
      if(canceled) {
        return;
      }

      this.setState({
        activeRequest: null,
        activeRequestUrl: null
      });

      const mapStyle = style.ensureStyleValidity(body)
      console.log('Loaded style ', mapStyle.id)
      this.props.onStyleOpen(mapStyle)
      this.onOpenToggle()
    })
    .catch((err) => {
      this.setState({
        error: `Failed to load: '${styleUrl}'`,
        activeRequest: null,
        activeRequestUrl: null
      });
      console.error(err);
      console.warn('Could not open the style URL', styleUrl)
    })

    this.setState({
      activeRequest: {
        abort: function() {
          canceled = true;
        }
      },
      activeRequestUrl: styleUrl
    })
  }

  onOpenUrl = () => {
    const url = this.styleUrlElement.value;
    this.onStyleSelect(url);
  }

  onUpload = (_, files) => {
    const [e, file] = files[0];
    const reader = new FileReader();

    this.clearError();

    reader.readAsText(file, "UTF-8");
    reader.onload = e => {
      let mapStyle;
      try {
        mapStyle = JSON.parse(e.target.result)
      }
      catch(err) {
        this.setState({
          error: err.toString()
        });
        return;
      }
      mapStyle = style.ensureStyleValidity(mapStyle)
      this.props.onStyleOpen(mapStyle);
      this.onOpenToggle();
    }
    reader.onerror = e => console.log(e.target);
  }

  onOpenToggle() {
    this.setState({
      styleUrl: ""
    });
    this.clearError();
    this.props.onOpenToggle();
  }

  onChangeUrl = () => {
    this.setState({
      styleUrl: this.styleUrlElement.value
    });
  }

  render() {
    const styleOptions = publicStyles.map(style => {
      return <PublicStyle
        key={style.id}
        url={style.url}
        title={style.title}
        thumbnailUrl={style.thumbnail}
        onSelect={this.onStyleSelect}
      />
    })

    let errorElement;
    if(this.state.error) {
      errorElement = (
        <div className="maputnik-modal-error">
          {this.state.error}
          <a href="#" onClick={() => this.clearError()} className="maputnik-modal-error-close">×</a>
        </div>
      );
    }

    return  (
      <div>
        <Modal
          data-wd-key="open-modal"
          isOpen={this.props.isOpen}
          onOpenToggle={() => this.onOpenToggle()}
          title={'Open Style'}
        >
          {errorElement}
          <section className="maputnik-modal-section">
            <h2>Upload Style</h2>
            <p>Upload a JSON style from your computer.</p>
            <FileReaderInput onChange={this.onUpload} tabIndex="-1">
              <Button className="maputnik-upload-button"><MdFileUpload /> Upload</Button>
            </FileReaderInput>
          </section>

          <section className="maputnik-modal-section">
            <h2>Load from URL</h2>
            <p>
              Load from a URL. Note that the URL must have <a href="https://enable-cors.org" target="_blank" rel="noopener noreferrer">CORS enabled</a>.
            </p>
            <input
              data-wd-key="open-modal.url.input"
              type="text"
              ref={(input) => this.styleUrlElement = input}
              className="maputnik-input"
              placeholder="Enter URL..."
              value={this.state.styleUrl}
              onChange={this.onChangeUrl}
            />
            <div>
              <Button
                data-wd-key="open-modal.url.button"
                className="maputnik-big-button"
                onClick={this.onOpenUrl}
                disabled={this.state.styleUrl.length < 1}
              >Open URL</Button>
            </div>
          </section>

          <section className="maputnik-modal-section maputnik-modal-section--shrink">
            <h2>Gallery Styles</h2>
            <p>
              Open one of the publicly available styles to start from.
            </p>
            <div className="maputnik-style-gallery-container">
            {styleOptions}
            </div>
          </section>
        </Modal>

        <LoadingModal
          isOpen={!!this.state.activeRequest}
          title={'Loading style'}
          onCancel={(e) => this.onCancelActiveRequest(e)}
          message={"Loading: "+this.state.activeRequestUrl}
        />
      </div>
    )
  }
}

export default OpenModal
