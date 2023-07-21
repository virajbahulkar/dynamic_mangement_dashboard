export const generateClasses = (style) => {
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