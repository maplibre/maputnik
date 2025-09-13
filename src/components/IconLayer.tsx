import React from "react";

import type {CSSProperties} from "react";
import { BsDiamondFill, BsFonts, BsSun } from "react-icons/bs";
import { MdBubbleChart, MdOutlineCircle, MdOutlineStreetview, MdOutlineVerticalShades, MdPriorityHigh } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { CiMountain1 } from "react-icons/ci";

type IconLayerProps = {
  type: string
  style?: CSSProperties
  className?: string
};

const IconLayer: React.FC<IconLayerProps> = (props) => {
  const iconProps = { style: props.style };
  switch(props.type) {
    case "fill-extrusion": return <MdOutlineVerticalShades {...iconProps} />;
    case "raster": return <BsDiamondFill {...iconProps} />;
    case "hillshade": return <BsSun {...iconProps} />;
    case "color-relief": return <CiMountain1 {...iconProps} />;
    case "heatmap": return <MdBubbleChart {...iconProps} />;
    case "fill": return <BsDiamondFill {...iconProps} />;
    case "background": return <MdOutlineStreetview {...iconProps} />;
    case "line": return <IoAnalyticsOutline {...iconProps} />;
    case "symbol": return <BsFonts {...iconProps} />;
    case "circle": return <MdOutlineCircle {...iconProps} />;
    default: return <MdPriorityHigh {...iconProps} />;
  }
};

export default IconLayer;
