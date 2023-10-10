export const generateClasses = (style) => {
  return `text-${style?.font?.size}
    text-${style?.text?.color}
    text-${style?.text?.size}
    font-${style?.font?.weight}
    ${style?.font?.style}
    ${style?.font?.style}
    p-${style?.padding?.all}
    p-${style?.padding?.top}
    p-${style?.padding?.bottom}
    pl-${style?.padding?.left}
    pr-${style?.padding?.right}
    px-${style?.padding?.leftRight}
    py-${style?.padding?.topBottom}
    m-${style?.margin?.all}
    m-${style?.margin?.top}
    m-${style?.margin?.bottom}
    ml-${style?.margin?.left}
    -ml-${style?.margin?.negativeLeft}
    mr-${style?.margin?.right}
    mx-${style?.margin?.leftRight}
    my-${style?.margin?.topBottom}
    border-${style?.border?.width}
    border-l-${style?.border?.left?.width}
    border-r-${style?.border?.right?.width}
    border-x-${style?.border?.leftRight?.width}
    border-y-${style?.border?.topBottom?.width}
    border-${style?.border?.style}
    border-${style?.border?.color}

    first:border-${style?.first?.border?.width}
    first:border-l-${style?.first?.border?.left?.width}
    first:border-r-${style?.first?.border?.right?.width}
    first:border-x-${style?.first?.border?.leftRight?.width}
    first:border-y-${style?.first?.border?.topBottom?.width}
    first:border-${style?.first?.border?.style}
    first:border-${style?.first?.border?.color}
    first:rounded-${style?.first?.border?.radius}
    first:rounded-l-${style?.first?.border?.radius?.left}

    last:border-${style?.last?.border?.width}
    last:border-l-${style?.last?.border?.left?.width}
    last:border-r-${style?.last?.border?.right?.width}
    last:border-x-${style?.last?.border?.leftRight?.width}
    last:border-y-${style?.last?.border?.topBottom?.width}
    last:border-${style?.last?.border?.style}
    last:border-${style?.last?.border?.color}
    last:rounded-${style?.last?.border?.radius}
    last:rounded-r-${style?.first?.border?.radius?.left}

    even:border-${style?.left?.border?.width}
    even:border-l-${style?.left?.border?.left?.width}
    even:border-r-${style?.left?.border?.right?.width}
    even:border-x-${style?.left?.border?.leftRight?.width}
    even:border-y-${style?.left?.border?.topBottom?.width}
    even:border-${style?.left?.border?.style}
    even:border-${style?.left?.border?.color}

    odd:border-${style?.right?.border?.width}
    odd:border-l-${style?.right?.border?.left?.width}
    odd:border-r-${style?.right?.border?.right?.width}
    odd:border-x-${style?.right?.border?.leftRight?.width}
    odd:border-y-${style?.right?.border?.topBottom?.width}
    odd:border-${style?.right?.border?.style}
    odd:border-${style?.right?.border?.color}
   
    rounded-${style?.border?.radius}  
    bg-${style?.background?.color} 
    col-span-${style?.span} ${style?.customClasses}`

}

export const generatePsudoClassesOdd = (style) => {
  return `text-${style?.font?.size}
    text-${style?.font?.color}
    text-${style?.text?.size}
    font-${style?.font?.weight}
    ${style?.font?.style}
    ${style?.font?.style}
    p-${style?.padding?.all}
    p-${style?.padding?.top}
    p-${style?.padding?.bottom}
    pl-${style?.padding?.left}
    pr-${style?.padding?.right}
    px-${style?.padding?.leftRight}
    py-${style?.padding?.topBottom}
    m-${style?.margin?.all}
    m-${style?.margin?.top}
    m-${style?.margin?.bottom}
    ml-${style?.margin?.left}
    -ml-${style?.margin?.negativeLeft}
    mr-${style?.margin?.right}
    mx-${style?.margin?.leftRight}
    my-${style?.margin?.topBottom}
    odd:border-${style?.border?.width}
    odd:border-l-${style?.border?.left?.width}
    odd:border-r-${style?.border?.right?.width}
    odd:border-x-${style?.border?.leftRight?.width}
    odd:border-y-${style?.border?.topBottom?.width}
    odd:border-${style?.border?.style}
    odd:border-${style?.border?.color}
    rounded-${style?.border?.radius}  
    bg-${style?.background?.color} 
    col-span-${style?.span}`

}

export const generatePsudoClassesEven = (style) => {
  return `text-${style?.font?.size}
    text-${style?.font?.color}
    text-${style?.text?.size}
    font-${style?.font?.weight}
    ${style?.font?.style}
    ${style?.font?.style}
    p-${style?.padding?.all}
    p-${style?.padding?.top}
    p-${style?.padding?.bottom}
    pl-${style?.padding?.left}
    pr-${style?.padding?.right}
    px-${style?.padding?.leftRight}
    py-${style?.padding?.topBottom}
    m-${style?.margin?.all}
    m-${style?.margin?.top}
    m-${style?.margin?.bottom}
    ml-${style?.margin?.left}
    -ml-${style?.margin?.negativeLeft}
    mr-${style?.margin?.right}
    mx-${style?.margin?.leftRight}
    my-${style?.margin?.topBottom}
    even:border-${style?.border?.width}
    even:border-l-${style?.border?.left?.width}
    even:border-r-${style?.border?.right?.width}
    even:border-x-${style?.border?.leftRight?.width}
    even:border-y-${style?.border?.topBottom?.width}
    even:border-${style?.border?.style}
    even:border-${style?.border?.color}
    rounded-${style?.border?.radius}  
    bg-${style?.background?.color} 
    col-span-${style?.span}`

}

export const generateStyles = (style) => {
  return {
    height: `${style?.height}px`,
    width: `${style?.width}px`,
    position: style?.position,
    textAlign: style?.text?.align,
    fontSize: `${style?.font?.size}em`,
    padding: `${style?.padding?.all}px`
  }
}
