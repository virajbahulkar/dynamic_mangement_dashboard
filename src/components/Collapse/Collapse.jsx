import React from 'react';
import './style.css';

const Collapse = (props) => {
  const { show, children, collapseComponent, isCollapsed } = props;
  return (
    <>
      {collapseComponent}
      {show ? (
        <div
          className={`collapse-content ${isCollapsed ? 'collapsed' : 'expanded'}`}
          aria-expanded={isCollapsed}
        >
          <span>{children}</span>
        </div>
      ) : (
        <span>{children}</span>
      )}
    </>
  );
};

export default Collapse;
