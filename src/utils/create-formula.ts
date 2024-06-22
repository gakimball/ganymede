import Formula from 'fparser';

const functions = {
  if: (condition: number, ifTrue: number, ifFalse: number) => {
    return condition ? ifTrue : ifFalse
  }
}

export const createFormula = (text: string): Formula => {
  const formula = new Formula(text)
  Object.assign(formula, functions)
  return formula
}
