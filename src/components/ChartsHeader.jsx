import React from 'react';
import HtmlComponents from './Dynamic-Components/HtmlComponents/HtmlComponents';
import { BsChevronDoubleDown, BsChevronDoubleRight } from 'react-icons/bs';

const ChartsHeader = ({ category, title, isDynamicComponent, quadrantHeaderFields, show, setIsCollapsed, isCollapsed }) => <>{!isDynamicComponent ? (
  <>
  <div className="">
    <div>
      <p className="text-md font-extrabold tracking-tight dark:text-gray-200 text-slate-900">{category}</p>
    </div>
    <p className="text-center dark:text-gray-200 text-md  ">{title}</p>
  </div>
  {show && (<button
    className="collapse-button"
    onClick={() => setIsCollapsed(!isCollapsed)}
  >
    {isCollapsed ? <BsChevronDoubleDown /> : <BsChevronDoubleRight /> }
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
          {isCollapsed ? <BsChevronDoubleDown /> : <BsChevronDoubleRight /> }
        </button>)
      }
    </>
  )}</>;

export default ChartsHeader;
