import React from 'react';

const ChartsHeader = ({ category, title }) => (
  <div className="">
    <div>
      <p className="text-md font-extrabold tracking-tight dark:text-gray-200 text-slate-900">{category}</p>
    </div>
    <p className="text-center dark:text-gray-200 text-md  ">{title}</p>
  </div>
);

export default ChartsHeader;
