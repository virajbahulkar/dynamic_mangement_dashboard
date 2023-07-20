import React from 'react'

const Heading = ({
    typeAs,
    content,
    style
  }) => {
    const Component = typeAs;

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

    const generateClasses = (style) => {
        let classes = ""
        for (let key in style) {
            if (typeof style[key] === "object") {
              for (let nestedKey in style[key]) {
                classes += Object.values(style[key][nestedKey]).join(" ")+" ";
              }
            } else {
                classes += Object.values(style[key]).join(" ")+" ";
            }
          }
          return classes
          
    }

  
    return (
      <Component className={generateClasses(style)}>
        {content}
      </Component>
    )
  }

export default Heading