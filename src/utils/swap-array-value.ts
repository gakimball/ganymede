export const swapArrayValue = <T>(array: T[], value: T): T[] => {
  const spliceIndex = array.indexOf(value)
  const next = [...array]

  if (spliceIndex === -1) {
    next.push(value)
  } else {
    next.splice(spliceIndex, 1)
  }

  return next
}
