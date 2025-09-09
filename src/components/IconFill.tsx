import React from 'react'


const IconFill: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={props.width || 20}
      height={props.height || 20}
      fill={props.color || 'currentColor'}
      {...props}
    >
      <path d="M 2.84978,9.763512 9.462149,4.7316391 16.47225,9.478015 9.859886,14.509879 2.84978,9.763512 m -1.028761,0.492069 7.414535,5.020197 c 0.372277,0.25206 0.958697,0.239771 1.30985,-0.02745 L 17.539255,9.926162 C 17.89041,9.658941 17.873288,9.238006 17.501015,8.985946 L 10.08648,3.9657402 C 9.714204,3.7136802 9.127782,3.7259703 8.776627,3.9931918 L 1.782775,9.315365 c -0.3511551,0.267221 -0.3340331,0.688156 0.03824,0.940216 l 0,0 z" />
    </svg>
  )
}
export default IconFill;
