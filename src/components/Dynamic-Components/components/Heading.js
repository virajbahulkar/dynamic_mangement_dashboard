import React from 'react'
import { generateClasses } from '../../../helpers';
import { useStateContext } from '../../../contexts/ContextProvider';

const Heading = ({
    typeAs,
    content,
    style
  }) => {
    const Component = typeAs;
    const { currentColor } = useStateContext()

    function getStyles(path, obj) {
        const arrayPattern = /(.+)\[(\d+)\]/;
        let i, match;
        try {
            path = path.split('.');
            for(i = 0; i < path.length; i++) {
                match = arrayPattern.exec(path[i]);
                if (match) {
                    obj = obj[match[1]][parseInt (match [2])];
                } else {
                    obj = obj[path[i]];
                }
            }
            return obj;
        } catch (error) {
            return null;
        }
    }

    

  
    return (
      <Component className={`${generateClasses(style?.padding?.all, "p-")} 
        ${generateClasses(style?.border?.width, "border-")} 
        ${generateClasses(style?.border?.color, "border-")}
        ${generateClasses(style?.border?.style, "border-")}
        ${generateClasses(style?.border?.radius, "rounded-")}
        ${generateClasses(style?.background?.color, "bg-")}
        ${generateClasses(style?.typography?.font?.weight, "font-")}
        ${generateClasses(style?.typography?.font?.style, "italic")}
        ${generateClasses(style?.typography?.text?.size, "text-")}`}
        style={{backgroundColor: style?.background?.color === "themeColor" ? currentColor : ''}}
        >
        {content}
      </Component>
    )
  }

export default Heading