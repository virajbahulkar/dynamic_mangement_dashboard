import React from 'react';
import HtmlComponents from './Dynamic-Components/HtmlComponents/HtmlComponents';

const Header = ({ category, title, isDynamicComponent, quadrantHeaderFields }) => <>{!isDynamicComponent ? (
  <div className=" mb-5">
    <p className="text-lg text-gray-400">{category}</p>
    <p className="text-md font-extrabold tracking-tight text-slate-900">
      {title}
    </p>
  </div>
) : (<HtmlComponents fields={quadrantHeaderFields} />)} </>;

export default Header;
