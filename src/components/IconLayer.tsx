import type React from "react";
import type { CSSProperties } from "react";
import { BsDiamond, BsDiamondFill, BsFonts, BsSun } from "react-icons/bs";
import { IoAnalyticsOutline } from "react-icons/io5";
import { MdBubbleChart, MdOutlineCircle, MdPriorityHigh } from "react-icons/md";

type IconLayerProps = {
  type: string;
  style?: CSSProperties;
  className?: string;
};

const IconLayer: React.FC<IconLayerProps> = (props) => {
  const iconProps = { style: props.style };
  switch (props.type) {
    case "fill-extrusion":
      return <BsDiamondFill {...iconProps} />;
    case "raster":
      return <BsDiamond {...iconProps} />;
    case "hillshade":
      return <BsSun {...iconProps} />;
    case "color-relief":
      return <MdBubbleChart {...iconProps} />;
    case "heatmap":
      return <BsDiamond {...iconProps} />;
    case "fill":
      return <BsDiamond {...iconProps} />;
    case "background":
      return <BsDiamondFill {...iconProps} />;
    case "line":
      return <IoAnalyticsOutline {...iconProps} />;
    case "symbol":
      return <BsFonts {...iconProps} />;
    case "circle":
      return <MdOutlineCircle {...iconProps} />;
    default:
      return <MdPriorityHigh {...iconProps} />;
  }
};

export default IconLayer;
