import React from 'react'
import { generateClasses } from '../../../helpers';

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

    

  
    return (
      <Component className={generateClasses(style)}>
        {content}
      </Component>
    )
  }

export default Heading