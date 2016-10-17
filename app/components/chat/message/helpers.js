export function extractImageDimentions(width, height) {
  var originalWidth = width
  var originalHeight = height
  if (width && height) {
    if (width > 400) {
      width = 400
      height = height * (width / originalWidth)
    }
    if (height > 475) {
      height = 475
      width = width * (height / originalHeight)
    }
  } else {
    width = 200
    height = 300
  }
  return { width, height }
}
