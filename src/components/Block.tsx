import React, {PropsWithChildren, SyntheticEvent} from 'react'
import classnames from 'classnames'
import FieldDocLabel from './FieldDocLabel'
import Doc from './Doc'


type BlockProps = PropsWithChildren & {
  "data-wd-key"?: string
  label?: string
  action?: React.ReactElement
  style?: object
  onChange?(...args: unknown[]): unknown
  fieldSpec?: object
  wideMode?: boolean
  error?: {message: string}
};

type BlockState = {
  showDoc: boolean
};

/** Wrap a component with a label */
export default class Block extends React.Component<BlockProps, BlockState> {
  _blockEl: HTMLDivElement | null = null;

  constructor (props: BlockProps) {
    super(props);
    this.state = {
      showDoc: false,
    }
  }

  onChange(e: React.BaseSyntheticEvent<Event, HTMLInputElement, HTMLInputElement>) {
    const value = e.target.value
    if (this.props.onChange) {
      return this.props.onChange(value === "" ? undefined : value)
    }
  }

  onToggleDoc = (val: boolean) => {
    this.setState({
      showDoc: val
    });
  }

  /**
   * Some fields for example <InputColor/> bind click events inside the element
   * to close the picker. This in turn propagates to the <label/> element
   * causing the picker to reopen. This causes a scenario where the picker can
   * never be closed once open.
   */
  onLabelClick = (event: SyntheticEvent<any, any>) => {
    const el = event.nativeEvent.target;
    const contains = this._blockEl?.contains(el);

    if (event.nativeEvent.target.nodeName !== "INPUT" && !contains) {
      event.stopPropagation();
    }
    if (event.nativeEvent.target.nodeName !== "A") {
      event.preventDefault();
    }
  }

  render() {
    return <label style={this.props.style}
      data-wd-key={this.props["data-wd-key"]}
      className={classnames({
        "maputnik-input-block": true,
        "maputnik-input-block--wide": this.props.wideMode,
        "maputnik-action-block": this.props.action
      })}
      onClick={this.onLabelClick}
    >
      {this.props.fieldSpec &&
        <div className="maputnik-input-block-label">
          <FieldDocLabel
            label={this.props.label}
            onToggleDoc={this.onToggleDoc}
            fieldSpec={this.props.fieldSpec}
          />
        </div>
      }
      {!this.props.fieldSpec &&
        <div className="maputnik-input-block-label">
          {this.props.label}
        </div>
      }
      <div className="maputnik-input-block-action">
        {this.props.action}
      </div>
      <div className="maputnik-input-block-content" ref={el => { this._blockEl = el; }}>
        {this.props.children}
      </div>
      {this.props.fieldSpec &&
        <div
          className="maputnik-doc-inline"
          style={{display: this.state.showDoc ? '' : 'none'}}
        >
          <Doc fieldSpec={this.props.fieldSpec} />
        </div>
      }
    </label>
  }
}
