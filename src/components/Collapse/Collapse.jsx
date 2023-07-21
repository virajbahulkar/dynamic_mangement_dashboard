import React from 'react'
import "./style.css"
import { BsChevronDoubleDown, BsChevronDoubleRight } from 'react-icons/bs'

const Collapse = (props) => {
  const { show, children, collapseComponent, isCollapsed,  ...rest} = props
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