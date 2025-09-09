import React from 'react'


const IconSymbol: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={props.width || 20}
      height={props.height || 20}
      fill={props.color || 'currentColor'}
      {...props}
    >
      <g transform="matrix(1.2718518,0,0,1.2601269,16.559526,-7.4065264)">
        <path d="m -9.7959773,11.060163 c -0.3734787,-0.724437 -0.3580577,-1.2147051 -0.00547,-1.8767873 l 8.6034029,-0.019416 c 0.39670292,0.6865644 0.38365934,1.4750693 -0.011097,1.8864953 l -3.1359613,-0.0033 -0.013695,7.1305 c -0.4055357,0.397083 -1.3146432,0.397083 -1.7769191,-0.02274 l 0.030226,-7.104422 z" />
      </g>
    </svg>
  )
}
export default IconSymbol;
