import React from 'react';
import HtmlComponents from './Dynamic-Components/HtmlComponents/HtmlComponents';

const ChartsHeader = ({ category, title, isDynamicComponent, quadrantHeaderFields }) => <>{!isDynamicComponent ? (
  <div className="">
    <div>
      <p className="text-md font-extrabold tracking-tight dark:text-gray-200 text-slate-900">{category}</p>
    </div>
    <p className="text-center dark:text-gray-200 text-md  ">{title}</p>
  </div>
) : (<HtmlComponents fields={quadrantHeaderFields} />)}</>;

export default ChartsHeader;
