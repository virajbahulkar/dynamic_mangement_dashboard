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

    

  
    return (
      <Component className={generateClasses(style)}
        style={{backgroundColor: style?.background?.color === "themeColor" ? currentColor : ''}}
        >
        {content}
      </Component>
    )
  }

export default Heading