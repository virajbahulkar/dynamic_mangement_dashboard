// ...existing code...
import React from 'react';

import { useStateContext } from '../contexts/ContextProvider';

const Button = ({ icon, bgColor, type, color, bgHoverColor, size, text, borderRadius, width }) => {
  const { setIsClicked, initialState, currentColor } = useStateContext();

  return (
    <button
      type={type}
      onClick={() => setIsClicked(initialState)}
      style={{
        backgroundColor: bgColor === 'themeColor' ? currentColor : bgColor,
        color: color === 'themeColor' ? currentColor : color,
        borderRadius,
      }}
      className={` text-${size} w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor} ${
        !icon && 'p-3 '
      }`}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
