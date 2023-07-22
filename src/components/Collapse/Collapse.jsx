import React from 'react'
import "./style.css"

const Collapse = (props) => {
  const { show, children, collapseComponent, isCollapsed } = props
    return (
      <>
        <>{collapseComponent}</>
        {show ? <div
          className={`collapse-content ${isCollapsed ? 'collapsed' : 'expanded'}`}
          aria-expanded={isCollapsed}
        >
        {children}
        </div> : <>{children}</>}
      </>
    );
};

export default Collapse