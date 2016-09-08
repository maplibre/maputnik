import React from 'react';
import { Space, Toolbar, ButtonCircle, Text, Panel, PanelHeader, PanelFooter } from 'rebass'
import Icon from 'react-geomicons';


export class Workspace extends React.Component {
	render() {
		return <div className="workspace">
<Toolbar>
 <Text>Hey layer</Text>
<Space
    auto
    x={1}
  />
 <ButtonCircle title="Like">
    <Icon
      fill="currentColor"
      height="1em"
      name="no"
      width="1em"
    />
  </ButtonCircle>
 <ButtonCircle title="Like">
    <Icon
      fill="currentColor"
      height="1em"
      name="trash"
      width="1em"
    />
  </ButtonCircle>
 <ButtonCircle title="Like">
    <Icon
      fill="currentColor"
      height="1em"
      name="triangleUp"
      width="1em"
    />
  </ButtonCircle>
 <ButtonCircle title="Like">
    <Icon
      fill="currentColor"
      height="1em"
      name="heart"
      width="1em"
    />
  </ButtonCircle>
</Toolbar>
			</div>
	}
}
