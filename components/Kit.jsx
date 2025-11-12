import React from 'react'

export default function Kit({title, children, actions}){
  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <h3 className="title">{title}</h3>
        <div className="toolbar">{actions}</div>
      </div>
      {children}
    </div>
  )
}
