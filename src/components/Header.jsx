import React from 'react';
import HtmlComponents from './Dynamic-Components/HtmlComponents/HtmlComponents';
import { BsChevronDoubleDown, BsChevronDoubleRight } from 'react-icons/bs';

const Header = (props) => {

  const { category, title, isDynamicComponent, quadrantHeaderFields, setIsCollapsed, isCollapsed, show } = props

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
          {show && (<button
            className="collapse-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <BsChevronDoubleDown />: <BsChevronDoubleRight />}
          </button>)}
        </>
      ) : (
        <>
          <HtmlComponents fields={quadrantHeaderFields} />
          {show && (
            <button
              className="collapse-button"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <BsChevronDoubleDown /> : <BsChevronDoubleRight />}
            </button>)
          }
        </>)}
    </>
  )
};

export default Header;
