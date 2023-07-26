export const generateClasses = (style) => {
  return `font-${style?.font?.size}
    font-${style?.font?.color}
    ${style?.font?.style}
    p-${style?.padding?.all}
    p-${style?.padding?.top}
    p-${style?.padding?.bottom}
    p-${style?.padding?.left}
    p-${style?.padding?.right}
    p-${style?.padding?.leftRight}
    p-${style?.padding?.topBottom}
    m-${style?.padding?.all}
    m-${style?.padding?.top}
    m-${style?.padding?.bottom}
    m-${style?.padding?.left}
    m-${style?.padding?.right}
    m-${style?.padding?.leftRight}
    m-${style?.padding?.topBottom}
    border-${style?.width} 
    border-${style?.color} 
    border-${style?.style}
    rounded-${style?.radius}  
    bg-${style?.background?.color} 
    col-span-${style?.span}`

}
