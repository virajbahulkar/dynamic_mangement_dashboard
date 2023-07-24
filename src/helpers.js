export const generateClasses = (style, prefix) => {
  switch (prefix) {
    case "col-span-":
      return style ? `${prefix}${style}` : ""
    case "border-":
      return style ? `${prefix}${style}` : ""
    case "bg-":
      return style ? `${style}` : ""
    case "text-":
      return style ? `${prefix}${style}` : ""
    case "p-":
      return style ? `${prefix}${style}` : ""
    case "font-":
      return style ? `${prefix}${style}` : ""
    case "rounded-":
      return style ? `${prefix}${style}` : ""

    default:
      return ""
  }
}
