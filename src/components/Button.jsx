import React from 'react';

import { useStateContext } from '../contexts/ContextProvider';

const Button = ({ icon, bgColor, color, bgHoverColor, size, text, borderRadius, width, type }) => {
  const { setIsClicked, initialState, currentColor } = useStateContext();

  return (
    <button
      type={type}
      onClick={() => setIsClicked(initialState)}
      style={{ backgroundColor: (bgColor === 'themeColor') ? currentColor : bgColor, color: (color === 'themeColor') ? currentColor : color, borderRadius }}
      className={` text-${size} w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor} ${!icon && 'p-3 '}`}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
