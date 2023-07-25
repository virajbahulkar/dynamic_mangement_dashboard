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
      <Component className={`    
        p-${style?.padding?.all}
        border-${style?.border?.width} 
        border-${style?.border?.color} 
        border-${style?.border?.style}
        rounded-${style?.border?.radius}  
        bg-${style?.background?.color} 
        font-${style?.typography?.font?.weight}
        ${style?.typography?.font?.style}
        text-${style?.typography?.text?.size}
      `}
        style={{backgroundColor: style?.background?.color === "themeColor" ? currentColor : ''}}
        >
        {content}
      </Component>
    )
  }

export default Heading