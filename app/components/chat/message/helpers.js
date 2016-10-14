export function extractImageDimentions(width, height) {
  if (width && height) {
    if (width > 400) {
      width = 400
      height = height * (width / width)
    }
    if (height > 475) {
      height = 475
      width = width * (height / height)
    }
  } else {
    width = 200
    height = 300
  }
  return {width, height}
}
