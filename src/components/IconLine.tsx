import React from 'react'


const IconLine: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={props.width || 20}
      height={props.height || 20}
      fill={props.color || 'currentColor'}
      {...props}
    >
      <path d="M 12.34,1.29 C 12.5114,1.1076 12.7497,1.0029 13,1 13.5523,1 14,1.4477 14,2 14.0047,2.2478 13.907,2.4866 13.73,2.66 9.785626,6.5516986 6.6148407,9.7551593 2.65,13.72 2.4793,13.8963 2.2453,13.9971 2,14 1.4477,14 1,13.5523 1,13 0.9953,12.7522 1.093,12.5134 1.27,12.34 4.9761967,8.7018093 9.0356422,4.5930579 12.34,1.29 Z" transform="translate(2,2)" />
    </svg>
  )
}

export default IconLine;
