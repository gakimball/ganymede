export type RecutilsSelector = (
  { type?: string }
  & (
    { selector?: string }
    | { index?: number }
  )
)
