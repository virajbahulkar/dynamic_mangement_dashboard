import React from 'react';
import HtmlComponents from './Dynamic-Components/HtmlComponents/HtmlComponents';


const Header = (props) => {

  const { category, title, isDynamicComponent, quadrantHeaderFields, show, collapseButton, showFilters, filtersComponent } = props

  return (
    <>
      {!isDynamicComponent ? (
        <>
          <div className=" mb-5">
            <p className="text-lg text-gray-400">{category}</p>
            <p className="text-md font-extrabold tracking-tight text-slate-900">
              {title}
            </p>
          </div>
          {showFilters && <span>{filters}</span>}
          {show && <>{collapseButton}</>}
        </>
      ) : (
        <>
          <HtmlComponents fields={quadrantHeaderFields} />
          {showFilters && <span>{filtersComponent}</span>}
          {show && <>{collapseButton}</>}
        </>)}
    </>
  )
};

export default Header;
