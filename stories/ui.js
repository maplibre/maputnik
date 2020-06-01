import React from 'react';


export function Describe ({children}) {
  return (
    <div style={{maxWidth: "600px", margin: "0.8em"}}>
      {children}
    </div>
  )
}

export function Wrapper ({children}) {
  return (
    <div style={{maxWidth: "180px", margin: "0.4em"}}>
      {children}
    </div>
  );
};

